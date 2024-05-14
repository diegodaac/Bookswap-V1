import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { user } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore,setDoc, doc, getDoc,addDoc,collection,collectionData,query } from '@angular/fire/firestore'
import { UtilsService } from './utils.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {getStorage, uploadString, ref, getDownloadURL} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore= inject (AngularFirestore);
  utilsSvc = inject( UtilsService);
  storage= inject(AngularFireStorage);


  /*=====================   Acceder ===============*/

  getAuth(){
    return getAuth();
  }
  signIn(user: user) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  /*=====================   Registrar Usuario   ===============*/
  signUp(user: user) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  /*=====================   Actualizar Usuario   ===============*/
  updateUser(displayName:string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  /*=====================  Restablecer Password   ===============*/
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }

  /*=====================  Cerrar Sesión   ===============*/
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth')
  }

  /*===================== Base de Datos ===============*/
  /*---------  Obtener Datos de una Colección -----------*/
  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery),{idField:'id'});
  }


  /*---------  Set Document -----------*/
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  /*---------  Obtener Document -----------*/
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  /*---------  Agregar Document -----------*/
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path), data);
  }

  /*---------  Almacenamiento  -----------*/

  /*--------- Subir Imagen -----------*/
  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(),path))
    })

  }


}
