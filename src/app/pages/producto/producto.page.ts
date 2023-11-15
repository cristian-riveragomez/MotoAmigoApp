import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectionService, Producto, Mail } from "../../../services/connection.service";
import { MetodosAuxiliaresService } from '../../../services/metodosAuxiliares.service';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService } from '../../../services/loading.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage{
  producto:Producto =  new Producto();
  tipoProducto: string;
  imagenData: any;
  productoDestacado!: boolean;
  esProductoDenunciado!: boolean;  
  textoArea!: string;
  parametroTipoProducto!:string;
  usuarioIdLogin!: number;

  constructor(private activatedRoute: ActivatedRoute, private connectionS: ConnectionService, 
              private metodosAuxiliaresS: MetodosAuxiliaresService, private navCtrl: NavController,
              public alertController: AlertController, private autService: AuthService) 
  {

    this.activatedRoute.params.subscribe((params:any) => {
      let productoId:string;
      
      this.parametroTipoProducto = params.tipo;
      productoId = params.productoId;
      
      this.usuarioIdLogin = Number(this.autService.GetIdUsuarioLocalStorage());

      this.connectionS.getProductoPorId(productoId).subscribe((response:any) =>{          
          this.producto = response;

          this.validarTipoProducto(response.tipoProducto);
          
          // this.connectionS.getImagenProductoPorId(response.idProducto, 'Producto').subscribe((responseImage:any) =>{
          //   this.imagenData = this.convertirBlobAURL(responseImage);
          // });

          this.connectionS.getImagenProductoPorId(response.idProducto, 'Producto')
          .then(resultado => {
            this.imagenData = this.convertirBlobAURL(resultado);
            });

          this.connectionS.validarProductoDestacado(this.autService.GetIdUsuarioLocalStorage(), productoId).subscribe( (response: any)=>
          {
            this.productoDestacado = response;
          });
          
          this.connectionS.validarProductoDenunciado(this.autService.GetIdUsuarioLocalStorage(), productoId).subscribe( (response: any)=>
          {
            this.esProductoDenunciado = response;
          });
      });
    });        
  }

  validarTipoProducto(tipoProd: string)
  {
    if(tipoProd === 'R')
    {
      this.tipoProducto = 'Repuesto'
    }
    else if(tipoProd === 'A')
    {
      this.tipoProducto = 'Accesorio'
    }
  }
  
  convertirBlobAURL(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    return url;
  }

  destacarProducto()
  {    

    if(this.productoDestacado)
    {
      this.connectionS.InsertarProductoDestacado(this.autService.GetIdUsuarioLocalStorage(), this.producto.idProducto).subscribe((response:any) => {
         this.metodosAuxiliaresS.alertaInformativa('Se destaco correctamente');
       });     
    }
    else
    {
       this.connectionS.borrarProductoDestacado(this.autService.GetIdUsuarioLocalStorage(), this.producto.idProducto).subscribe((response:any) => {
        this.metodosAuxiliaresS.alertaInformativa('Ya no pertenece a sus destacados');
    
      });     
    }    
  }

  async denunciarProducto(idProducto:string)
  {    
    const result = await this.metodosAuxiliaresS.alertaConfirmacion('Denunciar producto', '¿Esta seguro de denunciar el producto?')
      
      if(result)
      {        
        this.connectionS.denunciarProducto(idProducto, this.autService.GetIdUsuarioLocalStorage()).subscribe( (response:any)=>{    
        });    
        this.navCtrl.navigateForward('/tab/market-place');         
      }              
  }

  async alertaPopup(titulo: string, subtitulo:string) {
    return new Promise<boolean>(async (resolve) => {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      inputs: [
        {
          name: 'texto',
          type: 'textarea',          
        }        
      ],
      buttons: [
        {
           text: 'Enviar mensaje',
           handler: (data) => {
               this.textoArea = data.texto;
               resolve(true)
           }
        },
        {
            text: 'Cancelar',
            cssClass: 'secondary',
            handler: () => {
              resolve(false)
            }
        }
      ]
    });

    await alert.present();
    });
  }

  async contactarProducto()
  {
    const result = await this.alertaPopup('Contactar con el dueño', 'Escriba un mensaje de contacto');
    
    if(result)
    {
      let mailContacto =  new Mail();
      mailContacto.titulo = 'Contacto por producto';
      mailContacto.enviado = false;
      mailContacto.cuerpo = this.textoArea;      
      mailContacto.idUsuarioReceptor = this.producto.idUsuario.toString();  

      this.connectionS.envioDeMail(mailContacto).subscribe((response: any) =>
      {            
       this.metodosAuxiliaresS.alertaInformativa('Se envio el mail correctamente');
      },
      (error:any) =>
      {
         this.metodosAuxiliaresS.alertaError('Error al enviar el mail de contacto', error.message.toString())
      }); 
    }
  }
  
  redireccionarPantalla()
  {      
    if(this.parametroTipoProducto === 'cuenta')
    {
      this.navCtrl.navigateForward('tab/mi-cuenta');
      return
    }
    else if(this.parametroTipoProducto === 'marketPlace')
    {
      this.navCtrl.navigateForward('tab/market-place');
      return
    } 
  }

}
