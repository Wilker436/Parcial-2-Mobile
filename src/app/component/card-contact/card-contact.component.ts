import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/core/services/contact.service';
import { EMPTY, Observable } from 'rxjs';
import { Contact } from 'src/app/interfaces/contact.model';
import { IonList, IonItem, IonLabel, IonButton, IonIcon, IonAvatar, IonSpinner } from "@ionic/angular/standalone";
import { NgIf, NgForOf, AsyncPipe } from '@angular/common';
import SendNotification from 'src/app/interfaces/SendNotification.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { HttpService } from 'src/app/core/services/http.service';
import { Firestore, collection, doc, getDocs, query, where, setDoc, getDoc, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-card-contact',
  templateUrl: './card-contact.component.html',
  styleUrls: ['./card-contact.component.scss'],
  imports: [IonSpinner, IonAvatar, IonIcon, IonButton,
    IonList,
    IonItem,
    IonLabel,
    NgIf,
    NgForOf,
    AsyncPipe,
  ],
})
export class CardContactComponent implements OnInit {

  contacts$: Observable<Contact[]> = EMPTY; // Variable para almacenar el Observable

  constructor(
    private contactService: ContactService, 
    private authService: AuthService,
    private httpService: HttpService,
    private firestore: Firestore
  ) { }

  ngOnInit() {
    // Recupera los contactos del servicio
    this.contacts$ = this.contactService.getContacts();
    this.contacts$.subscribe((contacts) => {
      console.log('Contactos recibidos:');
      contacts.forEach(contact => {
        console.log('Nombre:', contact.name);
        console.log('Número:', contact.number);
        console.log('Foto (picture):', contact.picture);
      });
    });
  }


  deleteContact(contact: Contact) {

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
  
        console.log('Enviando notificación:', JSON.stringify(notification, null, 2));
  
        this.httpService.sendNotification(notification).subscribe({
          next: (response) => console.log('Notificación enviada correctamente:', response),
          error: (err) => console.error('Error al enviar la notificación:', err)
        });
  
      }).catch(err => {
        console.error('Error al obtener los datos del contacto:', err);
      });
  
    }).catch(err => {
      console.error('Error al obtener los datos del usuario actual:', err);
    });
  }
  
  


  openChat(contact: Contact) {

  }


}

