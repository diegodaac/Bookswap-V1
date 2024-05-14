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
  addUpdateBook(){
    this.utilsSvc.presentModal({
      component: AddUpdateBooksComponent,
      cssClass: 'add-update-modal'
    })
  }

}
