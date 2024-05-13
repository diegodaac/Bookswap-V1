import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { user } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore,setDoc, doc } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore= inject (AngularFirestore);

  /*=====================   Acceder ===============*/
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


  /*===================== Base de Datos ===============*/
  /*---------  Set Document -----------*/
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data)
  }
}
