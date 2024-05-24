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
      password: '',
    };
  }

  // async save() {
  //   this.cargando = true;
  //   await this.firestoreService.createDocumentWithAutoId(this.newUser, 'Usuarios');
  //   this.cargando = false;
  //   this.newUser = this.initUser();
  //   this.showForm = false;
  // }

  async save() {
    this.cargando = true;
    const userId = this.newUser.id;
    await this.firestoreService.createUserWithSubcollections(this.newUser, userId);
    this.cargando = false;
    this.newUser = this.initUser();
    this.showForm = false;
  }

  async edit(user: UserI) {
    console.log(user.id)
    this.navCtrl.navigateForward(`/home/${user.id}`);
  }
  

  // async delete(user: UserI) {
  //   this.cargando = true;
  //   await this.firestoreService.deleteDocumentID('Usuarios', user.id);
  //   this.cargando = false;
  // }


async delete(user: UserI) {
  try {
    this.cargando = true;
    console.log(user.id)
    await this.firestoreService.deleteDocumentID('Usuarios', user.id);
    this.cargando = false;
    // this.loadUsers(); 
  } catch (error) {
    this.cargando = false;
    console.error('Error al eliminar usuario:', error);
    
  }
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
