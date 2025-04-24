import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable() export class AuthInterceptor implements HttpInterceptor {

  public constructor() { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string | null = localStorage.getItem('token');

    if (token) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
      return next.handle(cloned);
    }
    return next.handle(request);
  }
}
