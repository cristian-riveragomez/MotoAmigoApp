import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Producto, ConnectionService } from '../../../services/connection.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MetodosAuxiliaresService } from '../../../services/metodosAuxiliares.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.page.html',
  styleUrls: ['./crear-producto.page.scss'],
})
export class CrearProductoPage{

  esRepuestoAValidar: boolean = false;
  previsualizacion!: string;
  archivos: any = [];
  producto: Producto;
  imagenData: any;
  options: string[] = ['Caño de escape', 'Asiento inferior', 'Cuadro de chasis', 'Horquilla', 'Soporte de pedalin', 'Otro'];
  esRepuestoRechazado!: boolean;  
  productoId!: string | null;
  selectedOption: string = 'vacio';
  archivosRepuestos: any = [];
  previsualizacionRepuestoNuevo!: string;  
  radioGruopValue!: boolean;
  
  constructor(private sanitizer: DomSanitizer, private connectionService: ConnectionService, private activatedRoute: ActivatedRoute,
               private navCtrl: NavController, private metodosAuxiliaresS: MetodosAuxiliaresService,  private autService: AuthService) 
  {      

    this.activatedRoute.params.subscribe((params:any) => 
    {     
      this.productoId = params.id;                        
    });
    
      

    this.activatedRoute.data.subscribe((data:any) => {  

      this.producto =  new Producto();

      if(this.productoId != 'nuevo')
      {               
        this.connectionService.getProductoPorId(this.productoId!).subscribe( (response: any) => {
          response.precio =  response.precio.toString().trim()
          this.producto = response
  
          this.validacionEstado(response.estado)
      
          // this.connectionService.getImagenProductoPorId(response.idProducto, 'Producto').subscribe((responseImage:any) =>{
          //   this.imagenData = this.convertirBlobAURL(responseImage);
          // });

          this.connectionService.getImagenProductoPorId(response.idProducto, 'Producto')
          .then(resultado => {
            this.imagenData = this.convertirBlobAURL(resultado);
            });
        });            
      }
      else
      {
        this.previsualizacion = '';      
        this.previsualizacionRepuestoNuevo = '';
        this.selectedOption = 'vacio';
        this.archivos = [];
        this.archivosRepuestos = [];

        this.producto =  new Producto();
      }        
    });
  }
  
  capturarArchivo(event:any): any
  {
    const archivoCapturado = event.target.files[0];

    this.extraerABase64(archivoCapturado).then( (imagen: any) =>{
      this.previsualizacion = imagen.base;
    });
    this.archivos.push(archivoCapturado);
  }

  capturarRepuesto(event:any): any
  {
    const archivoCapturado = event.target.files[0];

    this.extraerABase64(archivoCapturado).then( (imagen: any) =>{
      this.previsualizacionRepuestoNuevo = imagen.base;
    });
    this.archivosRepuestos.push(archivoCapturado);
  }

  extraerABase64 = async($event: any) => new Promise( (resolve, reject) =>{
    try
    {
      const unsafeImage =  window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImage);
      const reader = new FileReader();

      reader.readAsDataURL($event);
      reader.onload = () =>{
        resolve({
          base:reader.result
        });
      };
    }
    catch(e)
    {
      return;
    }
  });

    
  validacionEstado(estado:string)
  {   
    if(estado === 'RECHAZADO')
    {
      this.esRepuestoRechazado = true;
    }
  }
  
  convertirBlobAURL(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    return url;
  }

  
  validacionRepuesto(show: boolean)
  { 
    if(show)
    {
      this.producto.tipoProducto = 'R';
    }
    else
    {
      this.producto.tipoProducto = 'A';
    }
    
    this.esRepuestoAValidar = show;   
  }
  
  guardarProducto(formularioValue: NgForm) 
  {    
    if (formularioValue.invalid) {
      Object.values(formularioValue.controls).forEach((controles: any) => {
        controles.markAsTouched();
      });

      return;
    }       

    // let peticion!: Observable<any>;  
    
    if(this.productoId == 'nuevo')
    {  
      if(this.producto.tipoProducto === "R" && this.selectedOption === "vacio")
      {
        this.metodosAuxiliaresS.alertaError('Error:', 'Debe seleccionar el tipo de repuesto');
        return;
      }

      if(this.producto.tipoProducto === "R" && this.selectedOption != "Otro" && this.archivosRepuestos.length === 0)
      {
        this.metodosAuxiliaresS.alertaError('Error:', 'Debe cargar una imagen del repuesto donde fue grabada');
        return;
      }

      if(this.archivos.length === 0)
      {
        this.metodosAuxiliaresS.alertaError('Error:', 'Debe cargar una imagen del producto');
        return;
      }

      const formImagen =  new FormData();
      
      this.archivos.forEach((archivo: any) => {        
        formImagen.append('Nombre', this.producto.nombre);
        formImagen.append('Detalle', this.producto.detalle);               
        formImagen.append('Precio', this.producto.precio.toString());               
        formImagen.append('Marca', this.producto.marca);               
        formImagen.append('Modelo', this.producto.modelo); 
        formImagen.append('IdUsuario', this.autService.GetIdUsuarioLocalStorage());                                         
        formImagen.append('imagen', archivo); 
        
        if(this.producto.tipoProducto === "A")
        {
          formImagen.append('TipoProducto', 'A');        
        }

        if(this.producto.tipoProducto === "R")
        {
          formImagen.append('TipoProducto', 'R');        

          if(this.selectedOption != "Otro" && this.selectedOption != "vacio")
          {
            formImagen.append('Estado', 'PENDIENTE');
        
            this.archivosRepuestos.forEach((archivoRepuesto: any) =>{
              formImagen.append('imagenRepuesto', archivoRepuesto);
            });
        
            formImagen.append('tipoRepuesto', this.selectedOption);
          }
          else
          {
            formImagen.append('Estado', 'HABILITADO');                  
          }
        }
        else
        {
          formImagen.append('Estado', 'HABILITADO');                  
        } 
      });
this.connectionService.postCrearProducto(formImagen).subscribe((response:any) =>{     
      this.metodosAuxiliaresS.alertaInformativa( this.producto.nombre + ' Se genero correctamente');
      this.navCtrl.navigateForward('/tab/mi-cuenta');  
      },
      (error:any) =>{
  
        this.metodosAuxiliaresS.alertaError('Error al crear el producto', error.message.toString());
      });
    }
    else
    {    
      const formProductoActualizado =  new FormData();
      
      formProductoActualizado.append('IdProducto', this.producto.idProducto.toString());
      formProductoActualizado.append('Nombre', this.producto.nombre);
      formProductoActualizado.append('Detalle', this.producto.detalle);               
      formProductoActualizado.append('Precio', this.producto.precio.toString());               
      formProductoActualizado.append('Marca', this.producto.marca);               
      formProductoActualizado.append('Modelo', this.producto.modelo);          
      formProductoActualizado.append('IdUsuario', this.autService.GetIdUsuarioLocalStorage());                                                        

      if(this.esRepuestoRechazado)
      {
        this.archivosRepuestos.forEach((archivoRepuesto: any) =>{  
        formProductoActualizado.append('imagenRepuesto', archivoRepuesto);
        });      
        formProductoActualizado.append('Estado', 'PENDIENTE');
      }            
      
      this.connectionService.putEditarProducto(formProductoActualizado).subscribe((response:any) =>{      
        this.metodosAuxiliaresS.alertaInformativa( this.producto.nombre + ' Se edito correctamente');

        setTimeout(() => {
          this.navCtrl.navigateForward('/tab/mi-cuenta');  
        }, 1700);          
      },
      (error:any) =>{
  
        this.metodosAuxiliaresS.alertaError('Error al editar el producto', error.message.toString());
      });    
    }         
  }
}
