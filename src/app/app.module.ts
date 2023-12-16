import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConnectionService } from "../services/connection.service";
import { HttpClientModule } from "@angular/common/http";
import { ComponentsModule } from './components/components.module';


import { MetodosAuxiliaresService } from '../services/metodosAuxiliares.service';
import { FormsModule } from '@angular/forms';
import { SocialLoginModule, FacebookLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [AppComponent],
  
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, ComponentsModule, FormsModule, SocialLoginModule ],
  
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, ConnectionService, MetodosAuxiliaresService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [{
          id:FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('704893378128301')
        }]
      } as SocialAuthServiceConfig
    }
  ],
  
  bootstrap: [AppComponent],
})
export class AppModule {}
