import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ToastController, ModalController } from '@ionic/angular';
import { ConnectionService } from "../../../services/connection.service";
import { ProductoPage }  from "../producto/producto.page";
import { NavController } from '@ionic/angular';
import { ModalFiltroComponent } from '../../components/modal-filtro/modal-filtro.component';
import { LoadingService } from '../../../services/loading.service';
import { MetodosAuxiliaresService } from '../../../services/metodosAuxiliares.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.page.html',
  styleUrls: ['./market-place.page.scss'],
})
export class MarketPlacePage  {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  productos:any[] = []; 
  productoPage = ProductoPage;

  constructor(private connectionS: ConnectionService, private navCtrl: NavController, private toastController: ToastController,
              private modalController: ModalController, private loadingService: LoadingService, private metodosAuxiliaresS: MetodosAuxiliaresService,
              private route: ActivatedRoute) 
  {

    this.route.data.subscribe((data:any) => {
      this.obtenerProductosYMostrarlos();    
      this.presentToast();
    });        
  }
  
  async obtenerProductosYMostrarlos()
  {
    const loading = await this.loadingService.crearCarga();
    await loading.present();

    try 
    {
      this.connectionS.getListaProductosTotales().subscribe(async (response:any) =>{
        
        await response;
        this.productos = response;
        this.generarListaImagenesProductos()             
        loading.dismiss(); 
      });
    } 
    catch (error:any) 
    {
      this.metodosAuxiliaresS.alertaError('Error:',error.message.toString());
      loading.dismiss();
    }    
  }

  generarListaImagenesProductos()
  {
    for (let index = 0; index < this.productos.length; index++) {
        
      // this.connectionS.getImagenProductoPorId(Number(this.productos[index].idProducto), 'Producto').subscribe((responseImage:any) =>{
        
      //   this.productos[index].imagenContenido = this.convertirBlobAURL(responseImage); 
      // });

      this.connectionS.getImagenProductoPorId(Number(this.productos[index].idProducto), 'Producto')
      .then(resultado => {
        this.productos[index].imagenContenido = this.convertirBlobAURL(resultado); 
        });
    }
  }
  
  convertirBlobAURL(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    return url;
  }
  
  loadData(event:any) {
    setTimeout(() => {
      event.target.complete();

      if (this.productos.length == 100) {
        event.target.disabled = true;
      }
    }, 500);
  }

  async buscar(event: any) {
    const textoABuscar: string = event.target.value;
    
    const loading = await this.loadingService.crearCarga();
    await loading.present();
    
    if(textoABuscar == '')
    {
      this.connectionS.getListaProductosTotales().subscribe(async (response:any) =>{
        await response;
        this.productos = response;
        this.generarListaImagenesProductos();
        loading.dismiss(); 
      });
    }
    else
    {
      this.connectionS.getBusquedaProductos(textoABuscar).subscribe(async (response:any) => {      
        this.productos = response;
        this.generarListaImagenesProductos();        
      });
    }    
    loading.dismiss(); 
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  openProductDetail(productoId: number) {
    this.navCtrl.navigateForward(`tab/producto/${productoId}/marketPlace`);
  }
  
  doRefresh(event:any)
  {
    setTimeout(() => {
      this.obtenerProductosYMostrarlos()
      event.target.complete();
    }, 1000);
  }

  async clickModal()
  {
    const modal = await this.modalController.create({
      component:ModalFiltroComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
   
    let accesorio: boolean = true;
    let repuesto: boolean = true;
    if(data.accesorioCheck == undefined)
    {
      accesorio =  false;
    }
    if(data.repuestoCheck == undefined)
    {
      repuesto =  false;
    }
    this.connectionS.obtenerProductosPorFiltro(data.precioMinimo, data.precioMaximo, accesorio, repuesto).subscribe((response: any) =>{
      this.productos = response;
      this.generarListaImagenesProductos();
    },
    (error:any) =>
    {
      this.metodosAuxiliaresS.alertaError('Error:',error.message.toString());
      
      this.connectionS.getListaProductosTotales().subscribe( (response:any) =>
      {
        this.productos = response;
        this.generarListaImagenesProductos();         
      });
    });            
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
