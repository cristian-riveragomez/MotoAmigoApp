import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  constructor(private navCtrl: NavController, private autService: AuthService) { }

  ngOnInit() {}
  
  goToHome() {
    this.navCtrl.navigateRoot('/');
  }

  salir()
  {
    this.autService.logout()    
    this.navCtrl.navigateRoot('/login');
  }
}
