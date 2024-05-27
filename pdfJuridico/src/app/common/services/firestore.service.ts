import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  docData,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  DocumentData,
  WithFieldValue,
  UpdateData,
  addDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

// Convertidor genérico para Firestore
const converter = <T>() => ({
  toFirestore: (data: WithFieldValue<T>) => data,
  fromFirestore: (snapshot: any) => snapshot.data() as T
});

const docWithConverter = <T>(firestore: Firestore, path: string) =>
  doc(firestore, path).withConverter(converter<T>());

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore);

  constructor() { }

  getDocument<T>(enlace: string): Promise<DocumentData> {
    const document = docWithConverter<T>(this.firestore, enlace);
    return getDoc(document);
  }

  getDocumentChanges<T>(enlace: string): Observable<T> {
    const document = docWithConverter<T>(this.firestore, enlace);
    return docData(document) as Observable<T>;
  }

  getCollectionChanges<T>(path: string): Observable<T[]> {
    const itemCollection = collection(this.firestore, path).withConverter(converter<T>());
    return collectionData(itemCollection, { idField: 'id' }) as Observable<T[]>; // Usar 'id' como idField
  }
  createDocument<T>(data: T, enlace: string): Promise<void> {
    const document = docWithConverter<T>(this.firestore, enlace);
    return setDoc(document, data);
  }

  async createDocumentWithAutoId<T>(data: T, enlace: string): Promise<void> {
    const itemCollection = collection(this.firestore, enlace);
    const newDocRef = doc(itemCollection).withConverter(converter<T>());
    await setDoc(newDocRef, data);
  }

  async updateDocument<T>(data: UpdateData<T>, enlace: string, idDoc: string): Promise<void> {
    const document = docWithConverter<T>(this.firestore, `${enlace}/${idDoc}`);
    return updateDoc(document, data);
  }

  deleteDocumentID(enlace: string, idDoc: string): Promise<void> {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return deleteDoc(document);
  }

  deleteDocFromRef(ref: DocumentReference): Promise<void> {
    return deleteDoc(ref);
  }

  createIdDoc(): string {
    return uuidv4();
  }

  async getAuthUser() {
    return { uid: '05OTLvPNICH5Gs9ZsW0k' };
  }

 async createSubcollectionDocument<T>(
    parentCollection: string, // Colección padre (por ejemplo, 'usuarios')
    parentId: string,        // ID del documento padre (por ejemplo, ID del usuario)
    subcollection: string,   // Nombre de la subcolección (por ejemplo, 'certificaciones')
    data: T,
    file?: File
  ): Promise<DocumentReference> {
    const parentDocRef = doc(this.firestore, `${parentCollection}/${parentId}`);
    const subcollectionRef = collection(parentDocRef, subcollection).withConverter(converter<T>());

   if (file) {
  const pdfUrl = await this.uploadPDF(`pdfs/${file.name}`, file);
  (data as any)['pdfUrl'] = pdfUrl; // Aserción de tipo: data es tratado como any
}
    
    return addDoc(subcollectionRef, data);
  }



// Obtener documentos de una subcolección de un usuario
  getSubcollectionDocuments<T>(
    parentCollection: string,
    parentId: string,
    subcollection: string
  ): Observable<T[]> {
    const subcollectionRef = collection(doc(this.firestore, `${parentCollection}/${parentId}`), subcollection).withConverter(converter<T>());
    return collectionData(subcollectionRef, { idField: 'id' }) as Observable<T[]>; // Usar 'id' como idField
  }

  // Actualizar un documento en una subcolección
  async updateSubcollectionDocument<T>(
    parentCollection: string,
    parentId: string,
    subcollection: string,
    documentId: string,
    data: UpdateData<T>,
    file?: File // Opcional: archivo PDF si se va a actualizar
  ): Promise<void> {
    const document = doc(this.firestore, `${parentCollection}/${parentId}/${subcollection}/${documentId}`).withConverter(converter<T>());

     if (file) {
  const pdfUrl = await this.uploadPDF(`pdfs/${file.name}`, file);
  (data as any)['pdfUrl'] = pdfUrl; // Aserción de tipo: data es tratado como any
}
    
    return updateDoc(document, data);
  }

  // Eliminar un documento en una subcolección
  async deleteSubcollectionDocument(
    parentCollection: string,
    parentId: string,
    subcollection: string,
    documentId: string
  ): Promise<void> {
    const document = doc(this.firestore, `${parentCollection}/${parentId}/${subcollection}/${documentId}`);
    return deleteDoc(document);
  }

  // Subir un archivo PDF a Firebase Storage
  async uploadPDF(filePath: string, file: File): Promise<string> {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    await task;
    return await fileRef.getDownloadURL().toPromise();
  }
}



}
