import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonItem, IonLabel, IonInput, IonButton]
})
export class CompleteProfilePage implements OnInit {

  profileForm: FormGroup<{
    firstname: FormControl<string>;
    phone: FormControl<string>;
    picture: FormControl<string>;
  }>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: NonNullableFormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstname: this.fb.control('', Validators.required),
      phone: this.fb.control('', Validators.required),
      picture: this.fb.control(''),
    });
  }

  ngOnInit() { }

  async onSubmit() {
    if (this.profileForm.valid) {
      const auth = this.authService.getAuth();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        const { firstname, phone } = this.profileForm.getRawValue(); 
  
        await this.authService.createUserProfile(currentUser.uid, {
          uid: currentUser.uid, 
          firstname,
          phone,
          ...(currentUser.email ? { email: currentUser.email } : {})
        });
  
        this.router.navigate(['/home']);
      } else {
        console.error('No se encontró el usuario autenticado');
      }
    }
  }
  

}
