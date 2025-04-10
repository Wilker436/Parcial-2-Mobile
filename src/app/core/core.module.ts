import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';


import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = environment.firebaseConfig;

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig )),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
})
export class CoreModule { }
