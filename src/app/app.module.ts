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

@NgModule({
  declarations: [AppComponent],
  
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, ComponentsModule, FormsModule ],
  
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, ConnectionService, MetodosAuxiliaresService ],
  
  bootstrap: [AppComponent],
})
export class AppModule {}
