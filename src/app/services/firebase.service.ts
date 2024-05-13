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
import { getFirestore,setDoc, doc, getDoc } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore= inject (AngularFirestore);

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

  /*===================== Base de Datos ===============*/
  /*---------  Set Document -----------*/
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  /*---------  Obtener Document -----------*/
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}
