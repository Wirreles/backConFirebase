import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  userId: string;
  activeSection: string | null = 'usuario';

  usuarioForm: FormGroup;
  afipForm: FormGroup;
  certificacionIngresosForm: FormGroup;
  planesPagoForm: FormGroup;
  informacionPersonalForm: FormGroup;
  facturacionForm: FormGroup;
  declaracionJuradaForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress$: Observable<number>;
  downloadURL$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private storage: Storage // Añade esta línea para el servicio de almacenamiento
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');

    this.usuarioForm = this.fb.group({
      dni: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.afipForm = this.fb.group({
      cuit: ['', Validators.required],
      claveFiscal: ['', Validators.required],
    });

    this.certificacionIngresosForm = this.fb.group({
      anio: ['', Validators.required],
      pdf: ['', Validators.required],
    });

    this.planesPagoForm = this.fb.group({
      pdf: ['', Validators.required],
    });

    this.informacionPersonalForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      otrosDetalles: [''],
      pdf: ['', Validators.required],
    });

    this.facturacionForm = this.fb.group({
      cliente: ['', Validators.required],
      facturas: ['', Validators.required],
      pdf: ['', Validators.required],
    });

    this.declaracionJuradaForm = this.fb.group({
      pdf: ['', Validators.required],
    });

    this.loadUserData();
  }

  loadUserData() {
    this.firestoreService.getDocumentChanges<any>(`Usuarios/${this.userId}`).subscribe((userData: any) => {
      if (userData) {
        this.usuarioForm.patchValue({
          dni: userData.dni,
          password: userData.password,
        });

        this.afipForm.patchValue({
          cuit: userData.afip?.cuit,
          claveFiscal: userData.afip?.claveFiscal,
        });

        this.certificacionIngresosForm.patchValue({
          anio: userData.certificacionIngresos?.anio,
          pdf: userData.certificacionIngresos?.pdf,
        });

        this.planesPagoForm.patchValue({
          pdf: userData.planesPago?.pdf,
        });

        this.informacionPersonalForm.patchValue({
          nombre: userData.informacionPersonal?.nombre,
          apellido: userData.informacionPersonal?.apellido,
          direccion: userData.informacionPersonal?.direccion,
          otrosDetalles: userData.informacionPersonal?.otrosDetalles,
          pdf: userData.informacionPersonal?.pdf,
        });

        this.facturacionForm.patchValue({
          cliente: userData.facturacion?.cliente,
          facturas: userData.facturacion?.facturas,
          pdf: userData.facturacion?.pdf,
        });

        this.declaracionJuradaForm.patchValue({
          pdf: userData.declaracionJurada?.pdf,
        });
      }
    });
  }

  async uploadFile(event: any, form: FormGroup, controlName: string) {
    const archivoSeleccionado: File = event.target.files[0];
    const filePath = `archivos/${archivoSeleccionado.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadFile = uploadBytesResumable(fileRef, archivoSeleccionado);

    uploadFile.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadProgress$ = new Observable(observer => {
          observer.next(progress);
          observer.complete();
        });
        console.log('Progreso de la carga:', progress);
      },
      (error) => {
        console.error('Error al cargar el archivo:', error);
      },
      async () => {
        console.log("El archivo se subió exitosamente!");
        const url = await getDownloadURL(fileRef);
        console.log("URL del archivo: ", url);
        form.patchValue({
          [controlName]: url
        });
      }
    );
  }

  saveUsuario() {
    this.firestoreService.updateDocument(this.usuarioForm.value, 'Usuarios', this.userId).then(() => {
      console.log('Usuario saved', this.usuarioForm.value);
    });
  }

  async saveAfip() {
    const userIdPath = `Usuarios/${this.userId}`;
    const afipSubcollection = 'AFIP';

    const afipDocId = await this.firestoreService.getDocumentIdInSubcollection(userIdPath, afipSubcollection);
    console.log(afipDocId)
    if (afipDocId) {
      this.firestoreService.updateDocument(this.afipForm.value, `${userIdPath}/${afipSubcollection}`, afipDocId).then(() => {
        console.log('AFIP saved', this.afipForm.value);
      });
    } else {
      console.error('No document found in the subcollection');
    }
  }

  async saveCertificacionIngresos() {
    const userIdPath = `Usuarios/${this.userId}`;
    const subcollection = 'certIngreso';

    const docId = await this.firestoreService.getDocumentIdInSubcollection(userIdPath, subcollection);
    console.log(docId)
    if (docId) {
      this.firestoreService.updateDocument(this.certificacionIngresosForm.value, `${userIdPath}/${subcollection}`, docId).then(() => {
        console.log('Certificación de Ingresos saved', this.certificacionIngresosForm.value);
      });
    } else {
      console.error('No document found in the subcollection');
    }
  }


  async savePlanesPago() {
    const userIdPath = `Usuarios/${this.userId}`;
    const subcollection = 'planPago';

    const docId = await this.firestoreService.getDocumentIdInSubcollection(userIdPath, subcollection);
    console.log(docId)
    if (docId) {
      this.firestoreService.updateDocument(this.planesPagoForm.value, `${userIdPath}/${subcollection}`, docId).then(() => {
        console.log('Planes de Pago saved', this.planesPagoForm.value);
      });
    } else {
      console.error('No document found in the subcollection');
    }
  }

  async saveInformacionPersonal() {
    const userIdPath = `Usuarios/${this.userId}`;
    const subcollection = 'infoPersonal';

    const docId = await this.firestoreService.getDocumentIdInSubcollection(userIdPath, subcollection);
    console.log(docId)
    if (docId) {
      this.firestoreService.updateDocument(this.informacionPersonalForm.value, `${userIdPath}/${subcollection}`, docId).then(() => {
        console.log('Información Personal saved', this.informacionPersonalForm.value);
      });
    } else {
      console.error('No document found in the subcollection');
    }
  }

  async saveFacturacion() {
    const userIdPath = `Usuarios/${this.userId}`;
    const subcollection = 'facturacion';

    const docId = await this.firestoreService.getDocumentIdInSubcollection(userIdPath, subcollection);
    console.log(docId)
    if (docId) {
      this.firestoreService.updateDocument(this.facturacionForm.value, `${userIdPath}/${subcollection}`, docId).then(() => {
        console.log('Facturación saved', this.facturacionForm.value);
      });
    } else {
      console.error('No document found in the subcollection');
    }
  }

  async saveDeclaracionJurada() {
    const userIdPath = `Usuarios/${this.userId}`;
    const subcollection = 'declaracionJurada';

    const docId = await this.firestoreService.getDocumentIdInSubcollection(userIdPath, subcollection);
    console.log(docId)
    if (docId) {
      this.firestoreService.updateDocument(this.declaracionJuradaForm.value, `${userIdPath}/${subcollection}`, docId).then(() => {
        console.log('Declaración Jurada saved', this.declaracionJuradaForm.value);
      });
    } else {
      console.error('No document found in the subcollection');
    }
  }
}
