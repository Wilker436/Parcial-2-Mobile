import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonList, IonInput } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonList, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInput ]
})
export class RegisterPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  } 

 form = new FormGroup({
  email: new FormControl('', Validators.required),
  password: new FormControl('', Validators.required),
  firstname: new FormControl('', Validators.required),
  phone: new FormControl('', Validators.required),
  picture: new FormControl(''),

 });

 onSubmit() {
  if (this.form.valid) {
    const formValue = this.form.value;

    const user: User = {
      email: formValue.email ?? '',
      password: formValue.password ?? '',
      firstname: formValue.firstname ?? '',
      phone: formValue.phone ?? '',
      picture: formValue.picture ?? undefined
    };

    this.authService.register(user).then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Error en el registro', error);
    });
  }
}


}
