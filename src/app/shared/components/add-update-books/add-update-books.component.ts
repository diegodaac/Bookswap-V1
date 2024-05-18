import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'firebase/auth';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Libro } from '../../../models/libros.model';

@Component({
  selector: 'app-add-update-books',
  templateUrl: './add-update-books.component.html',
  styleUrls: ['./add-update-books.component.scss'],
})
export class AddUpdateBooksComponent  implements OnInit {

  @Input() libro: Libro; 

/* ======FORM GROUP======= */
form = new FormGroup({
  id: new FormControl(''),
  isbn: new FormControl('', [Validators.required, Validators.minLength(13)]),
  image: new FormControl('', [Validators.required]),
  name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  author: new FormControl('', [Validators.required, Validators.minLength(3)]),
  editorial: new FormControl('', [Validators.required, Validators.minLength(3)]),
  bookCondition: new FormControl('', [Validators.required, Validators.minLength(4)]),
  estatus: new FormControl('', [Validators.required])
});

firebaseSvc = inject(FirebaseService);
utilsSvc = inject(UtilsService);

get user(): user {
  return this.utilsSvc.getFromLocalStorage('user');
}



ngOnInit() {
  if(this.libro) this.form.setValue(this.libro);

}


/*-------------- Tomar o Seleccionar Foto------------ */
async takeImage(){
  const dataUrl= (await this.utilsSvc.takePicture('Imagen de Libro')).dataUrl;
  this.form.controls.image.setValue(dataUrl);
}

submit(){
  if (this.form.valid){
    if(this.libro) this.updateLibro(this.libro);
    else this.crearLibro();
  }
}

/*--------- Crear Libro-------- */
async crearLibro() {
  let userPath = `users/${this.user.uid}/books`;
  let globalPath = `globalBooks`;

  const loading = await this.utilsSvc.loading();
  await loading.present();

  /*------- Upload Imagen y Obtener URL------ */
  let dataUrl = this.form.value.image;
  let imagePath= `${this.user.uid}/${Date.now()}`;
  let imageUrl= await this.firebaseSvc.uploadImage(imagePath,dataUrl);
  this.form.controls.image.setValue(imageUrl);

  delete this.form.value.id;

  // Crear el libro en la colección del usuario
  let docRef = await this.firebaseSvc.addDocument(userPath, this.form.value);

  // Agregar el ID del documento a los datos del libro
  let libroWithId = { ...this.form.value, id: docRef.id };

  // Crear el libro en la colección global con el mismo ID
  this.firebaseSvc.setDocument(`${globalPath}/${docRef.id}`, libroWithId)
    .then(async res => {
      console.log('Libro agregado a la colección global exitosamente!');
    })
    .catch((error) => {
      console.log('Error al agregar el libro a la colección global:', error);
    });

  this.utilsSvc.dismissModal({success: true});
  
  /* toast */
  this.utilsSvc.presentToast({
    message: 'Libro agregado exitosamente!',
    duration: 2000,
    color: 'success',
    position: 'middle',
    icon:'checkmark-circle-outline'
  });

  loading.dismiss();
}

/*--------- Actualizar Libro -------- */
async updateLibro(libro: Libro) {

  let userPath = `users/${this.user.uid}/books/${libro.id}`;
  let globalPath = `globalBooks/${libro.id}`;

  const loading = await this.utilsSvc.loading();
  await loading.present();

  /*-------Si cambia imagen se sube nueva  y obtiene  URL------ */
  if(this.form.value.image !== libro.image){
    let dataUrl = this.form.value.image;
    let imagePath= await this.firebaseSvc.getFilePath(libro.image);
    let imageUrl= await this.firebaseSvc.uploadImage(imagePath,dataUrl);
    this.form.controls.image.setValue(imageUrl);
    
  }
  

  delete this.form.value.id;

  // Actualizar el libro en la colección del usuario
  this.firebaseSvc.updateDocument(userPath, this.form.value)
    .then(async res => {
      
      // Actualizar el libro en la colección global
      this.firebaseSvc.updateDocument(globalPath, this.form.value)
        .then(async res => {
          console.log('Libro actualizado en la colección global exitosamente!');
        })
        .catch((error) => {
          console.log('Error al actualizar el libro en la colección global:', error);
        });

      this.utilsSvc.dismissModal({success: true});
      
      /* toast */
      this.utilsSvc.presentToast({
        message: 'Libro actualizado exitosamente!',
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

} /* FIN */
