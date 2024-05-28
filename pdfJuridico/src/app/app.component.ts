import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { IoniconsModule } from './common/modules/ionicons.module';
import { LoginPage } from './views/login/login.page';
import { HomePage } from './views/home/home.page';
import { RegisterPage } from './views/register/register.page';
import { UserDetailPage } from './views/user-detail/user-detail.page';
import { VerUsuarioComponent } from './views/ver-usuario/ver-usuario.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IoniconsModule,HomePage,LoginPage,RegisterPage,VerUsuarioComponent,UserDetailPage],
})
export class AppComponent {
  constructor() {}
}
