export interface User {
    uid?: string;
    email: string;
    password: string;
    firstname: string;
    phone: string;
    picture?: string;
    token?: string;
}

export interface LoginData {
    email: string;
    password: string;
  }
  