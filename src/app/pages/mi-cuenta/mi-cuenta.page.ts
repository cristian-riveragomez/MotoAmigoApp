import { Component } from '@angular/core';
import { ConnectionService, Usuario, Producto } from '../../../services/connection.service';
import { MetodosAuxiliaresService } from '../../../services/metodosAuxiliares.service';
import { NgForm } from '@angular/forms';
import { LoadingService } from '../../../services/loading.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss'],
})
export class MiCuentaPage {

  usuario: Usuario = new Usuario(); 
  productos:Producto[] = []; 
  misProductosDestacados:Producto[] = [];
  inputType: string = 'password';

  constructor(private connectionService: ConnectionService, private metodosAuxiliaresS: MetodosAuxiliaresService,
              private loadingService: LoadingService,  private autService: AuthService, private route: ActivatedRoute) 
  {   
    this.route.data.subscribe((data:any) => {
      this.obtenerDatosDelUsuario();   
    });
    
  }
  

  async obtenerDatosDelUsuario()
  {
    const loading = await this.loadingService.crearCarga();
    await loading.present();
    try
    {
      this.connectionService.getUsuarioPorId(this.autService.GetIdUsuarioLocalStorage()).subscribe((usuarioBd:Usuario) =>{
        this.usuario = usuarioBd;      
      });
  
      this.connectionService.getProductosPorIdUsuario(this.autService.GetIdUsuarioLocalStorage()).subscribe((responseList:Producto[]) => {
        this.productos = responseList;
        for (let index = 0; index < this.productos.length; index++) 
        {         
          this.productos[index].tipoProducto = this.validarTipoProducto(this.productos[index].tipoProducto);       
        }
      });
  
      this.connectionService.getObtenerProductosDestacados(this.autService.GetIdUsuarioLocalStorage()).subscribe((responseList:Producto[]) => {
        this.misProductosDestacados = responseList;
        
        for (let index = 0; index < this.misProductosDestacados.length; index++) 
        {         
          this.misProductosDestacados[index].tipoProducto = this.validarTipoProducto(this.misProductosDestacados[index].tipoProducto);       
        }
      });

      loading.dismiss();
    }
    catch(error:any)
    {
      this.metodosAuxiliaresS.alertaError('Error:',error.message.toString());
      loading.dismiss();
    }
    
  }

  togglePasswordVisibility() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }
  
  validarTipoProducto(tipoProd: string):string
  {
    if(tipoProd === 'R')
    {
      return 'Repuesto';
    }
    else if(tipoProd === 'A')
    {
      return 'Accesorio';
    }
     return '';
  }

  actualizarUsuario(formularioValue: NgForm)
  {      
    if(formularioValue.invalid)
    {
      Object.values(formularioValue.controls).forEach( (controles: any) => {
        controles.markAsTouched();
      });

      return;
    }      
    this.connectionService.postEditarUsuario(this.usuario).subscribe( (resp:any)=> {
        
      this.metodosAuxiliaresS.alertaInformativa('Se actualizo correctamente');
         
      },
      (error:any) =>{
        this.metodosAuxiliaresS.alertaError('Error al editar el usuario', error.message.toString())
      });

  }
  
  async borrarProducto( producto: Producto, i:number )
  {   
    const result = await this.metodosAuxiliaresS.alertaConfirmacion('¿Esta seguro?', 'Esta seguro de borrar al producto: "'+ producto.nombre+'"');
    if (result) 
    {     
      this.connectionService.deleteProducto(producto.idProducto).subscribe( (resp:any)=>
       { 
        this.productos.splice(i, 1);
        this.metodosAuxiliaresS.alertaInformativa('Se elimino el producto correctamente');
       },
       (error:any) =>{
         this.metodosAuxiliaresS.alertaError('Error al borrar el producto', error.message.toString())
       });        
    }  

  }
  
 
}
