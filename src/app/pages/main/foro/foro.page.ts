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

  constructor() { }

  ngOnInit() {
  }

}
