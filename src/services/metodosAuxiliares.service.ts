import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class MetodosAuxiliaresService {

  constructor(public alertController: AlertController) 
  {
    
  }

  async alertaInformativa(mensaje: string)
  {
    const alert = await this.alertController.create({
     message: mensaje   
    });
    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 1000); 
  }
  
  async alertaError(titulo:string, mensaje: string)
  {
    const alert = await this.alertController.create({
     header: titulo,
     message: mensaje   
    });
    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 2000); 
  }

  async alertaConfirmacion(titulo:string, texto: string) {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: titulo,
        message: texto,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              resolve(true);
            },
          },
          {
            text: 'Cancelar',
            cssClass: 'secondary',
            handler: () => {             
              resolve(false);
            },
          },
        ],
      });
  
      await alert.present();
    });
  }  

}