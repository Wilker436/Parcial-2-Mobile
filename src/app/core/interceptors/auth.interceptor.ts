import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        console.log('🔍 Interceptor ejecutado. Token recibido:', token);
  
        if (token) {
          const authReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('✅ Se añadió la cabecera Authorization:', authReq.headers.get('Authorization'));
  
          return next.handle(authReq);
        }
  
        console.log('⚠️ No se encontró token. Enviando petición sin token.');
        return next.handle(request);
      })
    );
  }
  
}
