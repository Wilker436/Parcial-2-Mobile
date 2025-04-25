import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform} from '@ionic/angular';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  
  constructor(
    private platform: Platform, private authService: AuthService
  ) {
   
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.authService.getToken().then((token) => {
        console.log('Token obtenido al iniciar:', token);
      }).catch(err => {
        console.error('Error al obtener token al iniciar:', err);
      });
    });
  }

}
