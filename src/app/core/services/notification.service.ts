import { Injectable } from '@angular/core';
import {
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  // Obtener el token de notificación
  async getPushToken(): Promise<string | null> {
    // Solicitar permisos antes de registrar el dispositivo para push notifications
    const permission = await PushNotifications.requestPermissions();
  
    if (permission.receive !== 'granted') {
      // Si los permisos no son otorgados, devolver null o manejar el error
      console.error('Permisos de notificación no concedidos');
      return null;
    }
  
    return new Promise((resolve, reject) => {
      PushNotifications.removeAllListeners().then(() => {
        PushNotifications.register();
  
        PushNotifications.addListener('registration', (token: Token) => {
          resolve(token.value); // Resuelve con el token
        });
  
        PushNotifications.addListener('registrationError', (err) => {
          reject(err); // Rechaza en caso de error
        });
      });
    });
  }
  

  // Guardar el token en Firestore
  async savePushTokenToFirestore() {
    try {
      const token = await this.getPushToken(); // Obtiene el token
      const currentUser = this.authService.getAuth().currentUser;

      if (!currentUser || !token) return;

      const uid = currentUser.uid;
      const userRef = doc(this.firestore, 'users', uid);
      await setDoc(userRef, { token }, { merge: true }); // Guarda el token
      console.log('Token guardado en Firestore');
    } catch (error) {
      console.error('Error al obtener o guardar el token:', error);
    }
  }
}
