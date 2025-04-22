import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/core/services/contact.service';
import { EMPTY, Observable } from 'rxjs';
import { Contact } from 'src/app/interfaces/contact.model';
import { IonList, IonItem, IonLabel, IonButton, IonIcon, IonAvatar, IonSpinner } from "@ionic/angular/standalone";
import { NgIf, NgForOf, AsyncPipe } from '@angular/common';


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

  constructor(private contactService: ContactService) { }

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

  callContact(contact: Contact){
    
  }

  openChat(contact: Contact){
    
  }
    
  
}

