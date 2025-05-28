import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/core/services/contact.service';
import { EMPTY, Observable } from 'rxjs';
import { Contact } from 'src/app/interfaces/contact.model';
import { IonList, IonItem, IonLabel, IonButton, IonIcon, IonAvatar, IonSpinner, IonBadge } from "@ionic/angular/standalone";
import { NgIf, NgForOf, AsyncPipe } from '@angular/common';
import SendNotification from 'src/app/interfaces/SendNotification.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { HttpService } from 'src/app/core/services/http.service';
import { Firestore, collection, doc, getDocs, query, where, setDoc, getDoc, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Component({
  selector: 'app-card-contact',
  templateUrl: './card-contact.component.html',
  styleUrls: ['./card-contact.component.scss'],
  imports: [
    IonSpinner, 
    IonAvatar,
    IonIcon, 
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    NgIf,
    NgForOf,
    AsyncPipe,
    IonBadge,
  ],
})
export class CardContactComponent implements OnInit {

  contacts$: Observable<Contact[]> = EMPTY; // Variable para almacenar el Observable

  constructor(
    private contactService: ContactService, 
    private authService: AuthService,
    private httpService: HttpService,
    private firestore: Firestore,
    private router: Router
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
    
  openChat(contact: Contact) {
    console.log('Abriendo chat con:', contact);
    this.router.navigate(['/chat', contact.Contactid]);

  }


}

