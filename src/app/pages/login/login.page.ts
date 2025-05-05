import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonList, IonInput, IonIcon, IonTabButton, IonText } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { LoginData } from '../../interfaces/user.interface';
import { AuthFlowService } from 'src/app/core/services/auth-flow.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonText, IonIcon, IonList, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInput ]
})

export class LoginPage implements OnInit {

  errorMessage: string | null = null;
  // isLoading = false; // Opcional, si luego quieres mostrar un spinner

  constructor(
    private authService: AuthService,
    private router: Router,
    private authFlowService: AuthFlowService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.form.valid) {
      this.errorMessage = null;
      const credentials = this.form.value as LoginData;
  
      // Intentamos iniciar sesión
      this.authService.logIn(credentials)
        .then(async () => {
          try {
            // Guardamos el token en Firestore después de iniciar sesión
            await this.notificationService.savePushTokenToFirestore();
  
            // Redirigir a la página principal después de obtener y guardar el token
            this.router.navigate(['/home']);
          } catch (error) {
            // Manejo de errores al obtener o guardar el token
            console.error('Error al obtener o guardar el token:', error);
            this.errorMessage = 'Hubo un error al guardar el token. Por favor, intenta nuevamente.';
          }
        })
        .catch(error => {
          // Manejo de errores en el login
          console.error('Error en el login', error);
          this.errorMessage = this.getErrorMessage(error.code);
        });
    }
  }
  
  

  loginWithGoogle() {
    this.authService.logInGoogle()
      .then(async (result) => {
        const user = result.user;
        const uid = user.uid;
  
        // Consultar si ya existe el perfil del usuario en Firestore
        const userDoc = await this.authService.getUserProfile(uid);
  
        if (!userDoc.exists()) {
          this.authFlowService.setFromGoogleLogin(true);
          this.router.navigate(['/complete-profile']);
        } else {
          // Si existe, ir al home
          this.router.navigate(['/home']);
        }
      })
      .catch(error => console.error('Error con login de Google', error));
  }
  

  goToRegister(){
    this.router.navigate(['/register']);
   }


  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      case 'auth/user-disabled':
        return 'Este usuario ha sido deshabilitado.';
      case 'auth/user-not-found':
        return 'No existe ninguna cuenta con este correo.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      default:
        return 'Error al iniciar sesión. Intenta nuevamente.';
    }
  }
}

