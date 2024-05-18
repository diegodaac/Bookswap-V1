import { Component, OnInit, inject } from '@angular/core';
import { Libro } from 'src/app/models/libros.model';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateBooksComponent } from 'src/app/shared/components/add-update-books/add-update-books.component';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  libros: Libro[] = [];

  loading: boolean = false;

  ngOnInit() {
  }

  user():user{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getLibros();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getLibros();
      event.target.complete();
    }, 1000);
  }

  /* ------------Obtener Lista de libros ------------------ */
getLibros(){
  let path = `globalBooks`;

  this.loading= true;

  let sub = this.firebaseSvc.getCollectionData(path).subscribe({
    next: (res:any) =>{
      console.log(res);
      // Filtrar los libros para excluir los del usuario actual y solo incluir los que tienen estatus 'publico'
      this.libros= res.filter(libro => libro.userId !== this.user().uid && libro.estatus === 'publico');
      this.loading= false;
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

  let userPath = `users/${this.user().uid}/books/${libro.id}`;
  let globalPath = `globalBooks/${libro.id}`;

  const loading = await this.utilsSvc.loading();
  await loading.present();

  let imagePath= await this.firebaseSvc.getFilePath(libro.image);
  await this.firebaseSvc.deleteFile(imagePath);

  // Eliminar el libro de la colección del usuario
  this.firebaseSvc
    .deleteDocument(userPath)
    .then(async res => { 

      // Eliminar el libro de la colección global
      this.firebaseSvc.deleteDocument(globalPath)
        .then(async res => {
          console.log('Libro eliminado de la colección global exitosamente!');
        })
        .catch((error) => {
          console.log('Error al eliminar el libro de la colección global:', error);
        });

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
