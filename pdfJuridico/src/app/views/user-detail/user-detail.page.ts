import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilesComponent } from '../files/files.component';
import { FirestoreService } from '../../common/services/firestore.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, FilesComponent],
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

  @ViewChild('certificacionFile') certificacionFile: FilesComponent;
  @ViewChild('planesPagoFile') planesPagoFile: FilesComponent;
  @ViewChild('informacionPersonalFile') informacionPersonalFile: FilesComponent;
  @ViewChild('facturacionFile') facturacionFile: FilesComponent;
  @ViewChild('declaracionJuradaFile') declaracionJuradaFile: FilesComponent;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private firestoreService: FirestoreService
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

  saveUsuario() {
    this.firestoreService.updateDocument(this.usuarioForm.value, 'Usuarios', this.userId).then(() => {
      console.log('Usuario saved', this.usuarioForm.value);
    });
  }

  // saveAfip() {
  //   this.firestoreService.updateDocument(this.afipForm.value, `Usuarios/${this.userId}/AFIP`, this.userId).then(() => {
  //     console.log('AFIP saved', this.afipForm.value);
  //   });
  // }
  // saveAfip() {
  //   const afipDocId = 'nliEzn3Zb3gv71LROyLE';  // Reemplaza con el ID correcto de tu documento
  //   this.firestoreService.updateDocument(this.afipForm.value, `Usuarios/${this.userId}/AFIP`, afipDocId).then(() => {
  //     console.log('AFIP saved', this.afipForm.value);
  //   });
  // }
  async saveAfip() {
    const userIdPath = `Usuarios/${this.userId}`;
    const afipSubcollection = 'AFIP';
  
    // Obtén el ID del documento en la subcolección
    const afipDocId = await this.firestoreService.getDocumentIdInSubcollection(userIdPath, afipSubcollection);
    console.log(afipDocId)
    if (afipDocId) {
      // Si se encontró el documento, procede a actualizarlo
      this.firestoreService.updateDocument(this.afipForm.value, `${userIdPath}/${afipSubcollection}`, afipDocId).then(() => {
        console.log('AFIP saved', this.afipForm.value);
      });
    } else {
      // Maneja el caso en que no se encuentre el documento
      console.error('No document found in the subcollection');
    }
  }

  saveCertificacionIngresos() {
    this.firestoreService.updateDocument(this.certificacionIngresosForm.value, `Usuarios/${this.userId}/CertificacionIngresos`, this.userId).then(() => {
      console.log('Certificación de Ingresos saved', this.certificacionIngresosForm.value);
    });
  }

  savePlanesPago() {
    this.firestoreService.updateDocument(this.planesPagoForm.value, `Usuarios/${this.userId}/PlanesPago`, this.userId).then(() => {
      console.log('Planes de Pago saved', this.planesPagoForm.value);
    });
  }

  saveInformacionPersonal() {
    this.firestoreService.updateDocument(this.informacionPersonalForm.value, `Usuarios/${this.userId}/InformacionPersonal`, this.userId).then(() => {
      console.log('Información Personal saved', this.informacionPersonalForm.value);
    });
  }

  saveFacturacion() {
    this.firestoreService.updateDocument(this.facturacionForm.value, `Usuarios/${this.userId}/Facturacion`, this.userId).then(() => {
      console.log('Facturación saved', this.facturacionForm.value);
    });
  }

  saveDeclaracionJurada() {
    this.firestoreService.updateDocument(this.declaracionJuradaForm.value, `Usuarios/${this.userId}/DeclaracionJurada`, this.userId).then(() => {
      console.log('Declaración Jurada saved', this.declaracionJuradaForm.value);
    });
  }

  handleFileUploadComplete(event: any, form: FormGroup, controlName: string) {
    form.patchValue({
      [controlName]: event
    });
  }
}
