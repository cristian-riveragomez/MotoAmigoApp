import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-filtro',
  templateUrl: './modal-filtro.component.html',
  styleUrls: ['./modal-filtro.component.scss'],
})
export class ModalFiltroComponent  implements OnInit {
  
  precioMinimoInput: any;
  precioMaximoInput: any;
  accesorio: any;
  repuesto: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  aplicarFiltros() {

    this.modalController.dismiss({
     accesorioCheck: this.accesorio,
     repuestoCheck: this.repuesto,
     precioMinimo: this.precioMinimoInput,
     precioMaximo: this.precioMaximoInput
    });
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

}
