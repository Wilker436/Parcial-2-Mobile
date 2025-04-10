import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { CoreModule } from './app/core/core.module';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';


// 👇 Importa todos los iconos de ionicons
import * as allIcons from 'ionicons/icons';
import { addIcons } from 'ionicons';

// 👇 Registra todos los iconos disponibles
addIcons(allIcons);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(CoreModule),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
});
