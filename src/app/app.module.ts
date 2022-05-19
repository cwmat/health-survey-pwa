import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from './_shared/modules/shared.module';
import { SplashComponent } from './views/splash/splash.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {AuthInterceptor} from './auth.interceptor';

const testProviders: any[] = [];
const prodProviders: any[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    MainComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    StoreModule.forRoot({}, {}),
    SharedModule
  ],
  providers: [
    ...environment.useTestApi ? testProviders : prodProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
