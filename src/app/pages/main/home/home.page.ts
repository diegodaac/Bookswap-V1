import { Component, OnInit, inject } from '@angular/core';
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

  ngOnInit() {
  }
  
  /* ======= Cerrar Sesion =======*/
  signOut(){
    this.firebaseSvc.signOut();
  }

  /* ======= Agregar o Actualizar Libro =======*/
  addUpdateBook(){
    this.utilsSvc.presentModal({
      component: AddUpdateBooksComponent,
      cssClass: 'add-update-modal'
    })
  }

}
