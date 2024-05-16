import { Component, inject } from '@angular/core';
import { ref, uploadBytesResumable, Storage, getDownloadURL } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { IoniconsModule } from 'src/app/common/modules/ionicons.module';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  standalone: true,
  imports: [ 
    FormsModule,
    IoniconsModule,
    IonicModule]
})
export class FilesComponent {
  uploadProgress$!: Observable<number>;
  downloadURL$! : Observable<String>
  selectedFile: File | null = null;
  private storage: Storage = inject(Storage);
  constructor() { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.uploadFile(file);
  }

  async uploadFile(file: File){
    const filePath = `archivos/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadFile = uploadBytesResumable(fileRef, file)

    uploadFile.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) * 100;
      console.log('Pogreso de la carga', progress)
    },
    (error)=>{
      console.log('Error al cargar el archivo:', error)
    }, 
    async() => {
      const url = await getDownloadURL(fileRef)
      console.log('Url del pdf => ', url )
    })
  }
}
