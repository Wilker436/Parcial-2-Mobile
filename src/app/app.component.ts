import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform} from '@ionic/angular';
import { HttpService } from './core/services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  
  constructor(
    private platform: Platform, 
    private httpService: HttpService, 
  ) {
   
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.httpService.setToken().then(() => {
        console.log('Token set successfully');
      });
    });
  }

}
