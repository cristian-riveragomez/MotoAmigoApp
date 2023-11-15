import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstablecimientosPageRoutingModule } from './establecimientos-routing.module';

import { EstablecimientosPage } from './establecimientos.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstablecimientosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EstablecimientosPage]
})
export class EstablecimientosPageModule {}
