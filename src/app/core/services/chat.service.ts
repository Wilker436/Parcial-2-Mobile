// chat.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, orderBy, query, updateDoc, writeBatch } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(
        private firestore: Firestore,
        private auth: Auth,
        private authService: AuthService
    ) { }



    async sendMessage(recipientId: string, text: string): Promise<void> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) throw new Error('Usuario no autenticado');

        // 1. Referencias a los documentos de chat
        const senderChatPath = `users/${currentUser.uid}/chats/${recipientId}`;
        const recipientChatPath = `users/${recipientId}/chats/${currentUser.uid}`;

        // 2. Referencias a las subcolecciones de mensajes
        const senderMessagesRef = collection(this.firestore, `${senderChatPath}/messages`);
        const recipientMessagesRef = collection(this.firestore, `${recipientChatPath}/messages`);

        // 3. Crear el mensaje
        const newMessage = {
            text,
            senderId: currentUser.uid,
            timestamp: new Date(),
            status: 'delivered'
        };

        const batch = writeBatch(this.firestore);

        // 4. Asegurar que existan los documentos de chat (SET + MERGE)
        batch.set(doc(this.firestore, senderChatPath), {
            lastUpdated: new Date(),
            participants: [currentUser.uid, recipientId]
        }, { merge: true });

        batch.set(doc(this.firestore, recipientChatPath), {
            lastUpdated: new Date(),
            participants: [currentUser.uid, recipientId]
        }, { merge: true });

        // 5. Agregar mensajes a ambas conversaciones
        batch.set(doc(senderMessagesRef), newMessage);
        batch.set(doc(recipientMessagesRef), newMessage);

        // 6. Actualizar metadatos de último mensaje
        batch.update(doc(this.firestore, senderChatPath), {
            lastMessage: text,
            lastMessageTime: new Date()
        });

        batch.update(doc(this.firestore, recipientChatPath), {
            lastMessage: text,
            lastMessageTime: new Date()
        });

        try {
            await batch.commit();
        } catch (error) {
            console.error('Error en transacción:', error);
            throw new Error('Error al enviar mensaje');
        }
    }
    
    // Obtener mensajes de un chat
    getMessages(chatId: string): Observable<any[]> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) throw new Error('Usuario no autenticado');

        const messagesRef = collection(
            this.firestore,
            `users/${currentUser.uid}/chats/${chatId}/messages`
        );

        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        return collectionData(q, { idField: 'id' }) as Observable<any[]>;
    }
}