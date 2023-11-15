import { Component } from '@angular/core';
import { ConnectionService, UsuarioLogin } from '../../../services/connection.service';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { MetodosAuxiliaresService } from '../../../services/metodosAuxiliares.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  
  usuarioLogin: UsuarioLogin =  new UsuarioLogin();
  inputType: string = 'password';

  constructor(private connectionService: ConnectionService, private navCtrl: NavController, private autService: AuthService
              , private metodosAuxiliaresS: MetodosAuxiliaresService) 
  { 
    this.usuarioLogin =  new UsuarioLogin(); 
  }
  
  togglePasswordVisibility() 
  {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  login(form: NgForm)
  {      
    if(form.invalid)
    {
      return;
    }           
        
    this.connectionService.loginUsuario(this.usuarioLogin).subscribe( (response: any) => {    

      this.autService.guardarIdEnLocalStorage(response.id);
      this.autService.validarSiEsAdmin(response);

    this.navCtrl.navigateForward('/tab/home');   
      
    },
    (error:any)=>{
      //this.metodosAuxiliaresS.alertaError('Error al autenticar:',error.error.toString());
      this.metodosAuxiliaresS.alertaError('Error al autenticaras:',error.message.toString());
      console.log(error)
    });
  }

}
