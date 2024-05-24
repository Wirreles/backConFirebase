import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonSpinner, IonButtons, IonButton, IonIcon, IonImg } from '@ionic/angular/standalone';
import { UserI } from '../../common/models/users.models';
import { FirestoreService } from '../../common/services/firestore.service';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonImg, IonList, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput,
    IonIcon, IonButton, IonButtons, IonSpinner, IonInput, IonCard, 
    FormsModule,
    IoniconsModule
  ],
})
export class HomePage {

  users: UserI[] = [];

  newUser: UserI;
  cargando: boolean = false;

  user: UserI


  constructor(private firestoreService: FirestoreService) {
    this.loadusers();
    this.initUser();
    this.getuser();
  }

  loadusers() {
    this.firestoreService.getCollectionChanges<UserI>('Usuarios').subscribe( data => {
      if (data) {
        this.users = data
      }

    })

  }

  initUser() {
    this.newUser = {
      nombre: null,
      edad: null,
      id: this.firestoreService.createIdDoc(),
    }
  }

  async save() {
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newUser, 'Usuarios', this.newUser.id)
    this.cargando = false;
  }

  edit(user: UserI) {
    console.log('edit -> ', user);
    this.newUser = user;
  }

  // async delete(user: UserI) {
  //   this.cargando = true;
  //   await this.firestoreService.deleteDocumentID('Usuarios', user.id);
  //   this.cargando = false;
  // }


async delete(user: UserI) {
  try {
    this.cargando = true;
    await this.firestoreService.deleteDocumentID('Usuarios', user.id);
    this.cargando = false;
    // this.loadUsers(); 
  } catch (error) {
    this.cargando = false;
    console.error('Error al eliminar usuario:', error);
    
  }
}




  async getuser() {
    const uid = 'GpIwz1fhT1QkKu9Uc8pJ';
    // this.firestoreService.getDocumentChanges<UserI>('Usuarios/' + uid).subscribe( data => {
    //   console.log('getuser -> ', data);
    //   if (data) {
    //     this.user = data
    //   }
    // })

    const res = await this.firestoreService.getDocument<UserI>('Usuarios/' + uid);
    this.user = res.data()
  }


}
