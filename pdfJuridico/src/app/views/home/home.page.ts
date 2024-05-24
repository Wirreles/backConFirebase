import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { FirestoreService } from '../../common/services/firestore.service';
import { UserI } from '../../common/models/users.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  users: UserI[] = [];
  newUser: UserI = this.initUser();
  cargando: boolean = false;
  user: UserI | undefined;
  showForm: boolean = false;

  constructor(private firestoreService: FirestoreService, private navCtrl: NavController) {}

  ngOnInit() {
    this.loadUsers();
    this.getUser();
  }

  loadUsers() {
    this.firestoreService.getCollectionChanges<UserI>('Usuarios').subscribe(data => {
      if (data) {
        this.users = data;
      }
    });
  }

  initUser(): UserI {
    return {
      id: this.firestoreService.createIdDoc(), 
      nombre: '',
      apellido: '',
      direccion: '',
      dni: '',
      edad: 0,
      cuit: '',
      claveFiscal: '',
    };
  }

  async save() {
    this.cargando = true;
    await this.firestoreService.createDocumentWithAutoId(this.newUser, 'Usuarios');
    this.cargando = false;
    this.newUser = this.initUser();
    this.showForm = false;
  }

  async edit() {
    // Obtiene el usuario autenticado
    const authUser = await this.firestoreService.getAuthUser();
    if (authUser) {
      // Obtiene el UID del usuario autenticado
      const uid = authUser.uid;
      // Navega a la URL con el ID del usuario
      this.navCtrl.navigateForward(`/home/${uid}`);
    } else {
      // Manejo de error si no hay usuario autenticado
      console.error('No authenticated user found');
    }
  }
  

  async delete(user: UserI) {
    const authUser = await this.firestoreService.getAuthUser();
    // Obtiene el UID del usuario autenticado
    const uid = authUser.uid;  
    this.cargando = true;
    await this.firestoreService.deleteDocumentID('Usuarios', uid);
    this.cargando = false;
  }

  async getUser() {
    const authUser = await this.firestoreService.getAuthUser();
    if (authUser) {
      const uid = authUser.uid;
      const res = await this.firestoreService.getDocument<UserI>('Usuarios/' + uid);
      this.user = res['data']();
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  navigateToPage(page: string) {
    // Implementa la lógica de navegación aquí
  }

  goBack() {
    window.history.back();
  }
}
