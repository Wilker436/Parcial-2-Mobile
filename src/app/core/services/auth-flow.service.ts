import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthFlowService {

  private fromGoogleLogin = false;

  setFromGoogleLogin(value: boolean) {
    this.fromGoogleLogin = value;
  }

  isFromGoogleLogin(): boolean {
    return this.fromGoogleLogin;
  }

  clear() {
    this.fromGoogleLogin = false;
  }

  constructor() { }
}
