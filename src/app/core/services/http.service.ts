import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})



export class HttpService {
  
  

  constructor(private http: HttpClient) { }


  public findToken(): Observable<any> {
    return this.http.post('https://ravishing-courtesy-production.up.railway.app/user/login', environment.credentials);
  }
  
}
