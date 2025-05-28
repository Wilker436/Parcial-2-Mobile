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

import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { FilePicker } from '@capawesome/capacitor-file-picker';


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
  isRecording = false;
  recordingTime = 0;
  recordingTimer: any;
  audioBlob: Blob | null = null;
  audioUrl: string | null = null;
  selectedFile: { name: string, url: string, type: string } | null = null;
  isSelectingFile = false;

  constructor(
    private route: ActivatedRoute,
    private auth: Auth,
    private contactService: ContactService,
    private chatService: ChatService,
    private navCtrl: NavController,
    private authService: AuthService,
    private firestore: Firestore,
    private httpService: HttpService,
    private supabaseService: SupabaseService
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

  async startRecording() {
    try {
      const { value: hasPermission } = await VoiceRecorder.requestAudioRecordingPermission();
      if (!hasPermission) {
        console.error('Permission denied for audio recording');
        return;
      }

      this.isRecording = true;
      this.recordingTime = 0;

      // Iniciar temporizador
      this.recordingTimer = setInterval(() => {
        this.recordingTime++;
      }, 1000);

      await VoiceRecorder.startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      this.stopRecording();
    }
  }

  async stopRecording() {
    try {
      if (!this.isRecording) return;

      this.isRecording = false;
      clearInterval(this.recordingTimer);

      const { value: recordingResult } = await VoiceRecorder.stopRecording();

      if (recordingResult && recordingResult.recordDataBase64) {
        this.audioBlob = this.base64ToBlob(recordingResult.recordDataBase64, 'audio/aac');
        this.audioUrl = URL.createObjectURL(this.audioBlob);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }

  async sendAudioMessage() {
    if (!this.audioBlob) return;

    try {
      // Convertir Blob a File
      const audioFile = new File([this.audioBlob], 'recording.aac', { type: 'audio/aac' });

      // Subir a Supabase
      const audioUrl = await this.supabaseService.uploadAudio(audioFile);

      // Enviar mensaje con la URL del audio
      await this.chatService.sendMessage(this.contactId, '', audioUrl);

      // Limpiar
      this.audioBlob = null;
      if (this.audioUrl) {
        URL.revokeObjectURL(this.audioUrl);
        this.audioUrl = null;
      }
    } catch (error) {
      console.error('Error sending audio message:', error);
    }
  }


  cancelRecording() {
    this.stopRecording();
    this.audioBlob = null;
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  scrollToBottom() {
    setTimeout(() => {
      const messageList = document.querySelector('.message-list');
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }, 100);
  }

async pickFile() {
  try {
    this.isSelectingFile = true;

    // Intentar seleccionar el archivo
    const result = await FilePicker.pickFiles({
      types: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/*',
        'video/*',
        'audio/*'
      ],
      limit: 1,
      readData: true // Es crucial para obtener el archivo en base64
    });

    if (!result || result.files.length === 0) {
      console.warn('No se seleccionó ningún archivo.');
      return;
    }

    const file = result.files[0];

    // Obtener MIME
    const mimeType = file.mimeType || 'application/octet-stream';

    // Convertir el base64 a blob
    if (file.data) {
      const byteCharacters = atob(file.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // Crear el archivo
      const rawFile = new File([blob], file.name, { type: mimeType });

      // Subir el archivo a Supabase (adaptar según tu servicio)
      const fileData = await this.supabaseService.uploadFile(rawFile);

      this.selectedFile = {
        name: fileData.name,
        url: fileData.url,
        type: fileData.type
      };
    } else {
      console.warn('No se pudo leer el archivo seleccionado.');
    }
  } catch (error) {
    console.error('Error al seleccionar archivo:', error);
  } finally {
    this.isSelectingFile = false;
  }
}




  async sendFileMessage() {
    if (!this.selectedFile) return;

    try {
      await this.chatService.sendMessage(
        this.contactId,
        '',
        undefined,
        {
          url: this.selectedFile.url,
          name: this.selectedFile.name,
          type: this.selectedFile.type
        }
      );

      // Limpiar
      this.selectedFile = null;
    } catch (error) {
      console.error('Error al enviar archivo:', error);
    }
  }

  cancelFileSelection() {
    this.selectedFile = null;
  }

  getFileIcon(type: string): string {
    if (type.includes('pdf')) return 'document-text-outline';
    if (type.includes('word')) return 'document-text-outline';
    if (type.includes('excel') || type.includes('sheet')) return 'document-text-outline';
    return 'document-outline';
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