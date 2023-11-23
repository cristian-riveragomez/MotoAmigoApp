import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../../services/connection.service';
import { LoadingService } from '../../../services/loading.service';
import { ToastController } from '@ionic/angular';
import { MetodosAuxiliaresService } from '../../../services/metodosAuxiliares.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-clima',
  templateUrl: './clima.page.html',
  styleUrls: ['./clima.page.scss'],
})
export class ClimaPage implements OnInit {

  latitud!:string;
  longitud!: string;  
  fechaString!: string;
  pathIconoActual!: string;
  mostrarContenido: boolean = false;
  datosActualues: DatosClimaActuales =  new DatosClimaActuales();


  constructor(private connectionS: ConnectionService, private loadingService: LoadingService, private toastController: ToastController
              ,private metodosAuxiliaresS: MetodosAuxiliaresService, private route: ActivatedRoute)
  {        
  }

  ngOnInit() 
  {
    this.route.data.subscribe((data:any) => {
      this.obtenerUbicacionYMostrarDatos();   
      this.presentToast() 
    });    
  }

  async obtenerUbicacionYMostrarDatos() {    
      
    const loading = await this.loadingService.crearCarga();
    await loading.present();

    try 
    {        

      //obtener por navegador
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitud = position.coords.latitude.toString();
        this.longitud = position.coords.longitude.toString();
        this.mostrarDatosActuales(this.latitud, this.longitud);
        loading.dismiss(); 
      });
    } 
    catch (error:any) 
    {
      this.metodosAuxiliaresS.alertaError('Error:', error.message.toString())
      loading.dismiss();
    }
  }
  
  mostrarDatosActuales(lat:string, lng:string)
  {      
    this.connectionS.getDatosClimaActuales(lat, lng).subscribe((response:any) => {
    
      this.datosActualues =  new DatosClimaActuales();
      this.datosActualues = response;

      this.obtenerIconoActual(this.datosActualues.icono);      
    },
    (error:any) =>{
      this.metodosAuxiliaresS.alertaError('Error:', 'Error al obtener los datos')
    });

    this.ObtenerFechaYHoraActual();
  }

  ObtenerFechaYHoraActual()
  {
    let fecha =  new Date;
    let minutos = fecha.getMinutes().toString();
    
    if(minutos.length === 1)
    {
      minutos = '0' + minutos;
    }

    this.fechaString = this.ObtenerDiaAString(fecha.getDay()) + ', ' + fecha.getHours() + ':' +  minutos;
  }

  obtenerIconoActual(icono: string)
  {
    this.pathIconoActual = '../../../assets/icon/' + icono + '@4x.png';                 
  }
  
  doRefresh(event:any)
  {
    setTimeout(() => {
      this.RefrescarDatos();
      event.target.complete();
    }, 1000);
  }
    
  async RefrescarDatos()
  {
    const loading = await this.loadingService.crearCarga();
    await loading.present();

    await this.mostrarDatosActuales(this.latitud, this.longitud);
    
    loading.dismiss(); 
  }

  ObtenerDiaAString(diaNumeral:number)
  {
    let diaString='';

    switch(diaNumeral)
    {
      case 0:
      diaString="Domingo";
      break;
      case 1:
      diaString="Lunes";
      break;
      case 2:
      diaString="Martes";
      break;
      case 3:
      diaString="Miercoles";
      break;
      case 4:
      diaString="Jueves";
      break;
      case 5:
      diaString="Viernes";
      break;
      case 6:
      diaString="Sabado";
      break;
    }
    
    return diaString;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Pulse para arriba para actualizar',
      position: 'top',
      duration: 1000
    });
    toast.present();
  }

}


export class DatosClimaActuales {
  temperatura: number;
  sensacionTermica: number;
  humedad: number;
  descripcionClima: string;
  icono: string;
}