import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-file',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input type="file" (change)="onFileSelected($event)" />
    <div *ngIf="uploadProgress$ | async as progress">
      Progreso de la carga: {{ progress }}%
    </div>
  `,
  styles: []
})
export class FilesComponent {
  uploadProgress$!: Observable<number>;
  downloadURL$!: Observable<string>;

  @Output() fileUploadComplete = new EventEmitter<string>();

  private storage: Storage = inject(Storage);

  onFileSelected(event: any) {
    const archivoSeleccionado: File = event.target.files[0];
    this.uploadFile(archivoSeleccionado);
  }

  async uploadFile(file: File) {
    const filePath = `archivos/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadFile = uploadBytesResumable(fileRef, file);

    uploadFile.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadProgress$ = new Observable(observer => {
          observer.next(progress);
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
        this.fileUploadComplete.emit(url);
      }
    );
  }
}
