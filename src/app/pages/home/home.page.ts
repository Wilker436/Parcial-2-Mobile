import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonIcon, IonFabList, IonFabButton } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFabList, IonIcon, IonFab, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  constructor(
    private authSerive: AuthService,
    private Router: Router,

  ) { }

  ngOnInit() {
  }

  logOut(){
    this.authSerive.logOut().then(() => {
      this.Router.navigate(['/login']);
    }).catch(error => {
      console.error('Error al cerrar sesión', error);
    });
  }

  addContact(){

  }

}
