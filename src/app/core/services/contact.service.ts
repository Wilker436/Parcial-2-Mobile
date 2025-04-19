import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, where, setDoc, getDoc, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Contact } from 'src/app/interfaces/contact.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  async addContact(contact: Contact): Promise<void> {
    const currentUser = this.auth.currentUser;
  
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }
  
    // Paso 1: Buscar el usuario por número de teléfono
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('phone', '==', String(contact.number)));  // Asegúrate de convertir el número a string
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      throw new Error('El número de teléfono no está registrado');
    }
  
    const contactDoc = querySnapshot.docs[0];
    const contactData = contactDoc.data();
    const contactId = contactDoc.id;
  
    if (contactId === currentUser.uid) {
      throw new Error('No puedes agregarte a ti mismo como contacto');
    }
  
    // Paso 2: Validar que no exista ya en los contactos
    const contactRef = doc(this.firestore, `users/${currentUser.uid}/contacts/${contactId}`);
    const existingContactSnap = await getDoc(contactRef);
  
    if (existingContactSnap.exists()) {
      throw new Error('Este contacto ya está agregado');
    }
  
    // Paso 3: Crear objeto de contacto para guardar
    const newContact: Contact = {
      Contactid: contactId,
      number: contactData['phone'],
      name: contact.name || contactData['name'] || 'Sin nombre',
      picture: contactData['picture'],
    };
  
    // Paso 4: Guardar
    await setDoc(contactRef, newContact);
  }

  getContacts(): Observable<Contact[]> {
    const currentUser = this.auth.currentUser;
  
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }
  
    const contactsRef = collection(this.firestore, `users/${currentUser.uid}/contacts`);
  
    // Esto devuelve un Observable que se actualiza en tiempo real
    return collectionData(contactsRef, { idField: 'Contactid' }) as Observable<Contact[]>;
  }
  
  
}
