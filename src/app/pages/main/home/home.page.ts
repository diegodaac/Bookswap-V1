import { Component, OnInit, inject } from '@angular/core';
import { Libro } from 'src/app/models/libros.model';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateBooksComponent } from 'src/app/shared/components/add-update-books/add-update-books.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  libros: Libro[] = [];

  ngOnInit() {
  }

  user():user{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getLibros();
  }

  /* ------------Obtener Lista de libros ------------------ */
  getLibros(){
    let path = `users/${this.user().uid}/books`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res:any) =>{
        console.log(res);
        this.libros= res;
        sub.unsubscribe();
      }
    })

  }
  

  /* ======= Agregar o Actualizar Libro =======*/
  async addUpdateBook(libro?: Libro){
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateBooksComponent,
      cssClass: 'add-update-modal',
      componentProps: { libro}
    })

    if(success) this.getLibros();
  }

  /*------ Confirmación de Borrar Libro  ---------- */
  async confirmDeleteBook(libro: Libro) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Libro',
      message: '¿Deseas eliminar este libro?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteLibro(libro);
          }
        }
      ]
    });
  }

 /*--------- Borrar Libro -------- */
async deleteLibro(libro: Libro) {

  let path = `users/${this.user().uid}/books/${libro.id}`;

  const loading = await this.utilsSvc.loading();
  await loading.present();

  let imagePath= await this.firebaseSvc.getFilePath(libro.image);
  await this.firebaseSvc.deleteFile(imagePath);


  this.firebaseSvc
    .deleteDocument(path)
    .then(async res => { 

      this.libros = this.libros.filter(l => l.id !== libro.id);
      /* toast */
      this.utilsSvc.presentToast({
        message: 'Libro eliminado exitosamente!',
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
}/* FIN */
