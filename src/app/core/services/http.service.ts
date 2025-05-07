import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import SendNotification from '../../interfaces/SendNotification.model';
import { stringify } from 'uuid';



@Injectable({
  providedIn: 'root'
})



export class HttpService {
  
  

  constructor(
    private http: HttpClient,
  ) { }


  async setToken() {
    const body = { 
      email: "wilker.pachecoperez@unicolombo.edu.co",
      password: "wilker123W"
    };
    console.log('email:', environment.credentials.email);
    console.log('password:', environment.credentials.password);
  
    try {
      const res = await firstValueFrom(
        this.http.post<any>('https://ravishing-courtesy-production.up.railway.app/user/login', body)
      );
  
      let token = res?.data?.access_token;
      if (token) {
        token = token.replace("Bearer ", "");
        localStorage.setItem('ravishing_token', token);
        console.log('Token guardado:', token); 
      }
  
    } catch (error) {
      console.error('Error al obtener el token:', JSON.stringify(error));
    }
  }


  sendNotification(notification: SendNotification): Observable<any> {
    console.log('Notification:', notification);
    console.log('Token:', localStorage.getItem('ravishing_token'));
    return this.http.post(
      'https://ravishing-courtesy-production.up.railway.app/notifications',
      notification,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ravishing_token')}`,
        }),
        
      }
    );
  }

  
}
