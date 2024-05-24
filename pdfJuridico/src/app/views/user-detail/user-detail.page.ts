import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilesComponent } from '../files/files.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    private firestore: AngularFirestore
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
    this.firestore.collection('Usuarios').doc(this.userId).valueChanges().subscribe((userData: any) => {
      if (userData) {
        this.usuarioForm.patchValue({
          dni: userData.dni,
          password: userData.password,
        });

        this.afipForm.patchValue({
          cuit: userData.cuit,
          claveFiscal: userData.claveFiscal,
        });

        this.certificacionIngresosForm.patchValue({
          anio: userData.anio,
          pdf: userData.certificacionIngresosPdf,
        });

        this.planesPagoForm.patchValue({
          pdf: userData.planesPagoPdf,
        });

        this.informacionPersonalForm.patchValue({
          nombre: userData.nombre,
          apellido: userData.apellido,
          direccion: userData.direccion,
          otrosDetalles: userData.otrosDetalles,
          pdf: userData.informacionPersonalPdf,
        });

        this.facturacionForm.patchValue({
          cliente: userData.cliente,
          facturas: userData.facturas,
          pdf: userData.facturacionPdf,
        });

        this.declaracionJuradaForm.patchValue({
          pdf: userData.declaracionJuradaPdf,
        });
      }
    });
  }

  saveUsuario() {
    console.log('Usuario saved', this.usuarioForm.value);
  }

  saveAfip() {
    console.log('AFIP saved', this.afipForm.value);
  }

  saveCertificacionIngresos() {
    console.log('Certificación de Ingresos saved', this.certificacionIngresosForm.value);
  }

  savePlanesPago() {
    console.log('Planes de Pago saved', this.planesPagoForm.value);
  }

  saveInformacionPersonal() {
    console.log('Información Personal saved', this.informacionPersonalForm.value);
  }

  saveFacturacion() {
    console.log('Facturación saved', this.facturacionForm.value);
  }

  saveDeclaracionJurada() {
    console.log('Declaración Jurada saved', this.declaracionJuradaForm.value);
  }

  handleFileUploadComplete(event: string, form: FormGroup, controlName: string) {
    form.patchValue({ [controlName]: event });
  }
}
