import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { ContactService } from 'src/app/core/services/contact.service';
import { ChatService } from 'src/app/core/services/chat.service';
import { Subscription } from 'rxjs';
import { IonHeader, IonFooter, IonToolbar, IonItem, IonInput, IonButtons, IonButton, IonIcon, IonAvatar, IonTitle, IonContent } from "@ionic/angular/standalone";
import { BurblesComponent } from 'src/app/component/burbles/burbles.component';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Contact } from 'src/app/interfaces/contact.model';
import { User } from 'src/app/interfaces/user.interface';
import SendNotification from 'src/app/interfaces/SendNotification.model';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { HttpService } from 'src/app/core/services/http.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  imports: [IonContent, IonTitle, IonAvatar, IonIcon, IonHeader, IonFooter, IonToolbar, IonItem, IonInput, IonButtons, IonButton, BurblesComponent, CommonModule, FormsModule]
})
export class ChatPage implements OnInit, OnDestroy {
  contactId!: string;
  contactInfo: any;
  messages: any[] = [];
  newMessage = '';
  currentUserId: string | null = null;
  private messagesSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private auth: Auth,
    private contactService: ContactService,
    private chatService: ChatService,
    private navCtrl: NavController,
    private authService: AuthService,
    private firestore: Firestore,
    private httpService: HttpService,

  ) {
    this.currentUserId = this.auth.currentUser?.uid || null;
  }

  async ngOnInit() {
    this.contactId = this.route.snapshot.paramMap.get('id') ?? '';

    // Obtener información del contacto
    this.contactService.getContactById(this.contactId).subscribe(contact => {
      this.contactInfo = contact;
    });

    // Cargar mensajes existentes
    this.loadMessages();
  }

  loadMessages() {
    this.messagesSub = this.chatService.getMessages(this.contactId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.scrollToBottom();
      },
      error: (err) => console.error('Error loading messages:', err)
    });
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    try {
      await this.chatService.sendMessage(this.contactId, this.newMessage);
      this.newMessage = '';
      this.scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      // Puedes mostrar un toast o alerta al usuario
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const messageList = document.querySelector('.message-list');
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.messagesSub) {
      this.messagesSub.unsubscribe();
    }
  }

  goBack() {
    this.navCtrl.back();
  }


  callContact(contact: Contact) {
    const currentUser = this.authService.getAuth().currentUser;
    const uid = currentUser ? currentUser.uid : '';

    this.authService.getUser(uid).then((userSnapshot) => {
      if (!userSnapshot.exists()) {
        console.error('Usuario actual no encontrado');
        return;
      }

      const userData: User = userSnapshot.data() as User;

      if (!contact.Contactid) {
        console.error('El Contactid del contacto no está definido');
        return;
      }
      const contactRef = doc(this.firestore, 'users', contact.Contactid);

      getDoc(contactRef).then((contactSnapshot) => {
        if (!contactSnapshot.exists()) {
          console.error('Usuario de contacto no encontrado en Firestore');
          return;
        }

        const contactData = contactSnapshot.data() as User;
        const tokenDestino = contactData.token;

        if (!tokenDestino) {
          console.error('El token del contacto no está disponible');
          return;
        }

        const notification: SendNotification = {
          token: tokenDestino,
          notification: {
            title: "Llamada entrante",
            body: `${userData.firstname} te está llamando`,
          },
          android: {
            priority: "high",
            data: {
              userId: contact.Contactid ?? '',
              meetingId: uuidv4(),
              type: "incoming_call",
              name: contact.name,
              userFrom: userData.uid ?? ''
            }
          }
        };

        //console.log('Enviando notificación:', JSON.stringify(notification, null, 2));

        this.httpService.sendNotification(notification).subscribe({
          next: (response) => console.log('Notificación enviada correctamente:', response?.data ?? response),
          error: (err) => {
            console.error('Error al enviar la notificación:', err.response?.data ?? err);
            console.error('Error al enviar la notificación:', err);
            console.error('Error al enviar la notificación:', JSON.stringify(err, null, 2));
          }
        });


      }).catch(err => {
        console.error('Error al obtener los datos del contacto:', err);
      });

    }).catch(err => {
      console.error('Error al obtener los datos del usuario actual:', err);
    });
  }
}