import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'firebase/auth';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-books',
  templateUrl: './add-update-books.component.html',
  styleUrls: ['./add-update-books.component.scss'],
})
export class AddUpdateBooksComponent  implements OnInit {

/* ======FORM GROUP======= */
form = new FormGroup({
  id: new FormControl(''),
  isbn: new FormControl('', [Validators.required, Validators.minLength(13)]),
  image: new FormControl('', [Validators.required]),
  name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  author: new FormControl('', [Validators.required, Validators.minLength(3)]),
  editorial: new FormControl('', [Validators.required, Validators.minLength(3)]),
  bookCondition: new FormControl('', [Validators.required, Validators.minLength(4)])
});

firebaseSvc = inject(FirebaseService);
utilsSvc = inject(UtilsService);

user= {} as user;


ngOnInit() {
  this.user = this.utilsSvc.getFromLocalStorage('user');
}


/*-------------- Tomar o Seleccionar Foto------------ */
async takeImage(){
  const dataUrl= (await this.utilsSvc.takePicture('Imagen de Libro')).dataUrl;
  this.form.controls.image.setValue(dataUrl);
}

async submit() {
  if (this.form.valid) {

    let path = `users/${this.user.uid}/books`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    /*------- Upload Imagen y Obtener URL------ */
    let dataUrl = this.form.value.image;
    let imagePath= `${this.user.uid}/${Date.now()}`;
    let imageUrl= await this.firebaseSvc.uploadImage(imagePath,dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    this.firebaseSvc
      .addDocument(path, this.form.value)
      .then(async res => {
        
        this.utilsSvc.dismissModal({success: true});
        
        /* toast */
        this.utilsSvc.presentToast({
          message: 'Libro agregado exitosamente!',
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
}
