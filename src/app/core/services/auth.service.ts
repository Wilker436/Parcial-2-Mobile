import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { LoginData } from '../../interfaces/user.interface';

import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;

  constructor(private firestore: Firestore, private httpService: HttpService) { 
   /*  this.listenToAuthState(); */
  }

  private async listenToAuthState() {
    onAuthStateChanged(this.getAuth(), async (user) => {
      if (user) {
        this.token = await user.getIdToken();
        console.log('Token obtenido:', this.token); // ✅ Verificación
      } else {
        this.token = null;
        console.log('Usuario no autenticado');
      }
    });
  }
  
  

  getAuth() {
    return getAuth();
  }


  async getToken(): Promise<string | null> {
    return this.httpService.findToken().toPromise().then((response) => {
      console.log('Token desde el servidor:', response.data.access_token); 
      localStorage.setItem('token', response.data.access_token); 
      return response.data.access_token;
    }) as Promise<string | null>;
  }

  async register(user: User) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.getAuth(), user.email, user.password);

      const newUser = {
        uid: userCredential.user.uid,
        email: user.email,
        firstname: user.firstname,
        phone: user.phone,
        picture: user.picture ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8t5Qv9hoArKjwgA25zZgoNoKuhbVU2zc6-A&s'
      };

      // Guardamos en Firestore bajo la colección "users"
      await setDoc(doc(this.firestore, 'users', newUser.uid), newUser);

      return userCredential;
    } catch (error) {
      throw error;
    }
  }



  logIn(user: LoginData){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  logInGoogle(){
    return signInWithPopup(getAuth(), new GoogleAuthProvider());
  }

  getUserProfile(uid: string) {
    const userRef = doc(this.firestore, 'users', uid);
    return getDoc(userRef);
  }
  
  createUserProfile(uid: string, profileData: Partial<User>) {
    const userRef = doc(this.firestore, 'users', uid);
    return setDoc(userRef, profileData, { merge: true });
  }
  

  logOut(){
    return signOut(getAuth());
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }
  

  public async getUser(uid: string) {
    return await getDoc(doc(this.firestore, 'users', uid))
  }


}
