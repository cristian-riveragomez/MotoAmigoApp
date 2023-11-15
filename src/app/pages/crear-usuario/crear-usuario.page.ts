import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionService, Usuario } from '../../../services/connection.service';
import { NavController } from '@ionic/angular';
import { MetodosAuxiliaresService } from '../../../services/metodosAuxiliares.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage {

  usuario: Usuario =  new Usuario();
  constructor(private connectionService: ConnectionService, private navCtrl: NavController, private metodosAuxiliaresS: MetodosAuxiliaresService) 
  { 
  }
  
  guardarUsuario(formularioValue: NgForm)
  {
    if (formularioValue.invalid) {
      Object.values(formularioValue.controls).forEach((controles: any) => {
        controles.markAsTouched();
      });
      return;
    }   

    const formImagen =  new FormData();
   
    this.usuario.esAdmin = false;

    formImagen.append('Nombre', this.usuario.nombre);
    formImagen.append('Apellido', this.usuario.apellido);               
    formImagen.append('NombreUsuario', this.usuario.nombreUsuario.toString());               
    formImagen.append('Contrasena', this.usuario.contrasena);                                         
    formImagen.append('Email', this.usuario.email);    
    formImagen.append('EsAdmin', this.usuario.esAdmin.toString() );                                               

    this.connectionService.postInsertarUsuario(formImagen).subscribe((response:any) =>{
      
      this.metodosAuxiliaresS.alertaInformativa('Se creo correctamente el usuario');
        setTimeout(() => {          
          this.navCtrl.navigateForward('/login'); 
        }, 1700);           
    },
    (error:any) =>{
      if(error.error.toString() === 'Error: usuario duplicado. El nombre de usuario o email ya estan registrado en el sistema')
      {
        this.metodosAuxiliaresS.alertaError('Error:', error.error.toString());
      }
      else
      {
        this.metodosAuxiliaresS.alertaError('Error:', 'Error al crear el usuario');
      }      
    });
  }

}
