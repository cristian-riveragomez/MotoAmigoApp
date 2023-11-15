import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalFiltroEstablecimientosComponent } from '../../components/modal-filtro-establecimientos/modal-filtro-establecimientos.component';
declare var google: any;

@Component({
  selector: 'app-establecimientos',
  templateUrl: './establecimientos.page.html',
  styleUrls: ['./establecimientos.page.scss'],
})
export class EstablecimientosPage implements OnInit {

  map = null;
  
  public latitude!: number;
  public longitude!: number;
  public zoom: number = 14;

  infoWindow = new google.maps.InfoWindow();

  listaEstablecimientos: EstablecimientoClass[] = [];
  miUbicacion: EstablecimientoClass;

  establecimientoGomerias: string = 'gomerias';
  establecimientoEstacionesServicio: string = 'estaciones de servicio';
  establecimientoTalleres: string = 'taller mecanico de motos';

  marcadores: any[] =[];

  constructor(private ngZone: NgZone,  private modalController: ModalController) {} 

  ngOnInit()
  {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;   
      
      this.loadMap()
    });
  }
  
  loadMap()
  {
    const mapEle: HTMLElement | null = document.getElementById('map');

    if (mapEle) 
    {      
      this.map = new google.maps.Map(mapEle, 
      {
        center: new google.maps.LatLng(this.latitude, this.longitude),
        zoom: this.zoom
      });

      google.maps.event.addListenerOnce(this.map, 'idle', () => {        
        mapEle.classList.add('show-map');
        
        this.agregarMarcadorMiUbicacion()
        this.obtenerListaDeEstablecimientos([ this.establecimientoGomerias, this.establecimientoEstacionesServicio, this.establecimientoTalleres]);
      });
    }
  } 

  agregarMarcadorMiUbicacion()
  {
    const mar= new google.maps.Marker({
      position: {
        lat: this.latitude,
        lng: this.longitude
      },
      map: this.map,
      title: 'Mi Ubicacion',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    
    this.marcadores.push(mar);

    mar.addListener('click', () => {
      this.ngZone.run(() => {
        this.infoWindow.setContent(
          `<div style="color:black;"><h3>Mi Ubicacion</h3>                                   
            </div>`
        );
        this.infoWindow.open(this.map, mar);
      });
    });  
    return mar;  
  }
  
  addMarker(nuevoEstablecimiento: EstablecimientoClass)
  {
    const mar= new google.maps.Marker({
      position: {
        lat: nuevoEstablecimiento.latitud,
        lng: nuevoEstablecimiento.longitud
      },
      map: this.map,
      title: nuevoEstablecimiento.tipo
    });
    
    this.marcadores.push(mar);

    mar.addListener('click', () => {
      this.ngZone.run(() => {
        this.infoWindow.setContent(
          `<div style="color:black;"><b>${nuevoEstablecimiento.nombre} </b>
                                    <br>${nuevoEstablecimiento.direccion}
                                    <br>${nuevoEstablecimiento.calificacion} ☆ (${nuevoEstablecimiento.calificacionesTotaltes})
            </div>`
        );
        this.infoWindow.open(this.map, mar);
      });
    });  
    return mar;  
  }

  obtenerListaDeEstablecimientos(listaTipoEstablecimientoUsado: string[])
  {
    listaTipoEstablecimientoUsado.forEach((tipoEstablecimiento) => 
    {
      const placesService = new google.maps.places.PlacesService(
      document.createElement('div'));

       const request = {
         location: new google.maps.LatLng(this.latitude, this.longitude),
         radius: 2000,
         keyword: tipoEstablecimiento,
       };
       
      placesService.nearbySearch(request, (results: any, status: any) => 
      {
        if ( status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) 
        {
          for (let index = 0; index < results.length; index++) 
          {
            const place = results[index];

            if (place.geometry && place.name && place.vicinity && place.icon && place.geometry.location) 
            {
              let nuevoEstablecimiento = new EstablecimientoClass(
                place.name,
                place.vicinity,
                place.geometry.location.lat(),
                place.geometry.location.lng(),
                tipoEstablecimiento,
                undefined,
                place.rating,
                place.user_ratings_total
              );

              this.addMarker(nuevoEstablecimiento)         
            }
          }
        }            
      });
    });
  }

  async onClick()
  {
    const modal = await this.modalController.create({
      component:ModalFiltroEstablecimientosComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
     
    let gomerias: boolean = true;
    let talleres: boolean = true;
    let estaciones: boolean = true;

    if(data.gomeriasCheck == undefined)
    {
      gomerias =  false;
    }
    if(data.talleresCheck == undefined) 
    {
      talleres =  false;
    }
    if(data.estacionesCheck == undefined)
    {
      estaciones =  false;
    }
    
    this.marcadores.forEach(marcador => {
      if(marcador.getTitle() != 'Mi Ubicacion')
      {
        marcador.setVisible(false);
      }
    });
    

    if ((estaciones && gomerias && talleres) || (!estaciones && !gomerias && !talleres))
    {
      this.marcadores.forEach((marker) => {
        marker.setVisible(true);
      });
    }
    else 
    {
      if(estaciones && !gomerias && !talleres)
      {
        this.mostrarMarcadoresPorTipo(this.establecimientoEstacionesServicio)
      }
      if(talleres && !gomerias && !estaciones)
      {
        this.mostrarMarcadoresPorTipo(this.establecimientoTalleres)
      }
      if(gomerias && !talleres && !estaciones)
      {
        this.mostrarMarcadoresPorTipo(this.establecimientoGomerias)
      }


      if(gomerias && talleres && !estaciones)
      {
        this.mostrarMarcadoresPorTipo(this.establecimientoGomerias)
        this.mostrarMarcadoresPorTipo(this.establecimientoTalleres)
      }
      if(gomerias && !talleres && estaciones)
      {
        this.mostrarMarcadoresPorTipo(this.establecimientoGomerias)
        this.mostrarMarcadoresPorTipo(this.establecimientoEstacionesServicio)
      }
      if(talleres && !gomerias && estaciones)
      {
        this.mostrarMarcadoresPorTipo(this.establecimientoTalleres)
        this.mostrarMarcadoresPorTipo(this.establecimientoEstacionesServicio)
      }     
    }     
  }

  mostrarMarcadoresPorTipo(tipo: string) 
  {
    this.marcadores.forEach((marker) => {
      if (marker.getTitle() === tipo) 
      {
        marker.setVisible(true);
      }
    });
  }

}

export class EstablecimientoClass {
  constructor(
    public nombre: string,
    public direccion: string,
    public latitud: number,
    public longitud: number,
    public tipo?: string,
    public icono?: string,
    public calificacion?: number,
    public calificacionesTotaltes?: number
  ) {}
}