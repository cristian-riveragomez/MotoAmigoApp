import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  constructor(private navCtrl: NavController, private autService: AuthService) { }

  ngOnInit() {}

  salir()
  {
    this.autService.logout()    
    this.navCtrl.navigateRoot('/login');
  }

}
