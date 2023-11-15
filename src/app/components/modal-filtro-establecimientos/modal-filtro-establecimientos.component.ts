import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-filtro-establecimientos',
  templateUrl: './modal-filtro-establecimientos.component.html',
  styleUrls: ['./modal-filtro-establecimientos.component.scss'],
})
export class ModalFiltroEstablecimientosComponent  implements OnInit {

  gomerias: any;
  talleres: any;
  estaciones: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  cerrarModal() {
    this.modalController.dismiss();
  }
  
  aplicarFiltros() {

    this.modalController.dismiss({
     gomeriasCheck: this.gomerias,
     talleresCheck: this.talleres,
     estacionesCheck: this.estaciones    
    });
  }

}
