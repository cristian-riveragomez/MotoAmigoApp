import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class LoadingService {

    loading: any;
  constructor(private loadingController: LoadingController) 
  {
    
  }

  async crearCarga() {
    return await this.loadingController.create({
      message: 'Espere por favor'
    });
  }
}