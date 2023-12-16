import { Component } from '@angular/core';
import { ConnectionService, UsuarioLogin } from '../../../services/connection.service';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { MetodosAuxiliaresService } from '../../../services/metodosAuxiliares.service';
import { LoadingService } from '../../../services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { SocialAuthService, FacebookLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  
  usuarioLogin: UsuarioLogin =  new UsuarioLogin();
  inputType: string = 'password';
  submitted: boolean = false;

  constructor(private connectionService: ConnectionService, private navCtrl: NavController, 
              private autService: AuthService, private metodosAuxiliaresS: MetodosAuxiliaresService, 
              private loadingService: LoadingService, activatedRoute: ActivatedRoute, private authService: SocialAuthService) 
  { 


    activatedRoute.data.subscribe((data:any) => {  
      this.submitted = false;
      this.usuarioLogin =  new UsuarioLogin();   
    });
  }
  
  togglePasswordVisibility() 
  {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  async login(form: NgForm)
  {      
    this.submitted = true;

    if(form.invalid)
    {
      return;
    }           
    const loading = await this.loadingService.crearCarga();
    await loading.present();
    this.connectionService.loginUsuario(this.usuarioLogin).subscribe( (response: any) => 
    {    
      
      this.autService.guardarIdEnLocalStorage(response.id);
      this.autService.validarSiEsAdmin(response);
      
      loading.dismiss(); 
      this.navCtrl.navigateForward('/tab/home');         
    },
    (error:any)=>{
      loading.dismiss(); 
      this.metodosAuxiliaresS.alertaError('Error al autenticar:',error.error.toString());
    });
  }


  signInWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((user: any) => {

      })
      .catch((error: any) => {

        console.log(error.error);
      });
  }

}
