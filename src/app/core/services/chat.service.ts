// chat.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, orderBy, query, updateDoc, writeBatch } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(
        private firestore: Firestore,
        private auth: Auth,
        private authService: AuthService
    ) { }



    async sendMessage(recipientId: string, text: string, audioUrl?: string, fileData?: { url: string, name: string, type: string }): Promise<void> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) throw new Error('Usuario no autenticado');

        // 1. Referencias a los documentos de chat
        const senderChatPath = `users/${currentUser.uid}/chats/${recipientId}`;
        const recipientChatPath = `users/${recipientId}/chats/${currentUser.uid}`;

        // 2. Referencias a las subcolecciones de mensajes
        const senderMessagesRef = collection(this.firestore, `${senderChatPath}/messages`);
        const recipientMessagesRef = collection(this.firestore, `${recipientChatPath}/messages`);

        // 3. Crear el mensaje con soporte para audio y archivos
        const newMessage: any = {
            senderId: currentUser.uid,
            timestamp: new Date(),
            status: 'delivered'
        };

        // Asignar contenido según el tipo de mensaje
        if (audioUrl) {
            newMessage.type = 'audio';
            newMessage.audioUrl = audioUrl;
            newMessage.duration = await this.getAudioDuration(audioUrl);
        } else if (fileData) {
            newMessage.type = 'file';
            newMessage.fileUrl = fileData.url;
            newMessage.fileName = fileData.name;
            newMessage.fileType = fileData.type;
        } else {
            newMessage.type = 'text';
            newMessage.text = text;
        }

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
        const newMessageRef = doc(senderMessagesRef);
        batch.set(newMessageRef, newMessage);
        batch.set(doc(recipientMessagesRef, newMessageRef.id), newMessage);

        // 6. Actualizar metadatos de último mensaje
        let lastMessageText = '';
        if (audioUrl) {
            lastMessageText = 'Mensaje de audio';
        } else if (fileData) {
            lastMessageText = `Archivo: ${fileData.name}`;
        } else {
            lastMessageText = text;
        }

        batch.update(doc(this.firestore, senderChatPath), {
            lastMessage: lastMessageText,
            lastMessageTime: new Date(),
            lastMessageType: newMessage.type
        });

        batch.update(doc(this.firestore, recipientChatPath), {
            lastMessage: lastMessageText,
            lastMessageTime: new Date(),
            lastMessageType: newMessage.type
        });

        try {
            await batch.commit();
        } catch (error) {
            console.error('Error en transacción:', error);
            throw new Error('Error al enviar mensaje');
        }
    }

    private async getAudioDuration(audioUrl: string): Promise<number> {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.src = audioUrl;
            audio.onloadedmetadata = () => {
                resolve(Math.round(audio.duration));
            };
            audio.onerror = () => {
                resolve(0); // Valor por defecto si hay error
            };
        });
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