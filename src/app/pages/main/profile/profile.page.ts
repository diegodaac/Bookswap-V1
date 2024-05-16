import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'firebase/auth';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Libro } from '../../../models/libros.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  user():user{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  /*-------------- Tomar o Seleccionar Foto------------ */
async takeImage(){
  let user= this.user();
  let path = `users/${user.uid}`;

  const dataUrl= (await this.utilsSvc.takePicture('Foto de Perfil')).dataUrl;

  const loading = await this.utilsSvc.loading();
  await loading.present();

  let imagePath= `${user.uid}/profile`;
  user.image = await this.firebaseSvc.uploadImage(imagePath,dataUrl);

  this.firebaseSvc
      .updateDocument(path, {image: user.image})
      .then(async res => {
        
        this.utilsSvc.saveInLocalStorage('user',user);

        /* toast */
        this.utilsSvc.presentToast({
          message: 'Foto actualizada exitosamente!',
          duration: 2000,
          color: 'success',
          position: 'middle',
          icon:'checkmark-circle-outline'
        });


      })
      .catch((error) => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon:'alert-circle-outline'
        });

      })
      .finally(() => {
        loading.dismiss();
      });
}
}
