import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { IonicModule } from '@ionic/angular';
import {MenuComponent} from '../components/menu/menu.component';
import { RouterModule } from '@angular/router';
import { ModalFiltroComponent } from './modal-filtro/modal-filtro.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ModalFiltroEstablecimientosComponent } from './modal-filtro-establecimientos/modal-filtro-establecimientos.component';

@NgModule({
    declarations:[
        HeaderComponent,
        MenuComponent,
        ModalFiltroComponent,
        ModalFiltroEstablecimientosComponent
    ],
    exports: [
        HeaderComponent,
        MenuComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        FormsModule,

    ]
    ,
    providers: [AuthService]
})

export class ComponentsModule{}