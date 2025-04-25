import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import SendNotification from '../../interfaces/SendNotification.model';



@Injectable({
  providedIn: 'root'
})



export class HttpService {
  
  

  constructor(
    private http: HttpClient,
  ) { }


  public findToken(): Observable<any> {
    return this.http.post('https://ravishing-courtesy-production.up.railway.app/user/login', environment.credentials);
  }


  public sendNotification(notification: SendNotification): Observable<any> {
    return this.http.post(
      'https://ravishing-courtesy-production.up.railway.app/notifications',
      notification,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    )
  }

  
}
