import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../common/services/firestore.service'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Importar IonicModule



@Component({
  selector: 'app-ver-usuario',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './ver-usuario.component.html',
  styleUrls: ['./ver-usuario.component.scss'],
})
export class VerUsuarioComponent implements OnInit {
  userId: string;
  // usuario: any; 


usuario: any = {};
  subcollections = ['afip', 'certIngreso', 'declaracionJurada', 'facturacion', 'infoPersonal', 'planPago'];


  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.cargarDatosUsuario();
  }

    async cargarDatosUsuario() {
    try {
      console.log('Usuario ID:', this.userId); // Agrega esta línea para verificar el ID
      const usuarioDoc = await this.firestoreService.getDocumentById('Usuarios', this.userId);
      console.log('Documento del usuario:', usuarioDoc); // Agrega esta línea para verificar el documento

      if (usuarioDoc) {
        this.usuario = usuarioDoc; 

        // Cargar datos de subcolecciones
        for (const subcollection of this.subcollections) {
          const subcollectionData = await this.firestoreService.getSubcollectionDocument(`Usuarios/${this.userId}`, subcollection);
          if (subcollectionData) {
            this.usuario[subcollection] = subcollectionData; 
          }
        }
      } else {
        console.error('No se encontró el usuario');
      }

      this.cdr.detectChanges(); 
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    }
  }
}