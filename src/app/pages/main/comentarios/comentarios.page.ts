import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { user } from 'src/app/models/user.model';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  comentarios = [];
  nuevoComentario = '';
  currentUser: user;

  @ViewChild('chatMessagesContainer', { static: false }) private chatMessagesContainer: ElementRef;

  ngOnInit() {
    this.currentUser = this.utilsSvc.getFromLocalStorage('user');
    this.cargarComentarios();
  }

  cargarComentarios() {
    this.firebaseSvc.getCollectionData('comentarios', ref => ref.orderBy('fechaCreacion', 'asc')).subscribe(res => {
      this.comentarios = res;
      this.scrollToBottom();
    });
  }

  enviarComentario() {
    if (this.nuevoComentario.trim() === '') {
      return;
    }
  
    let comentario = {
      usuario: this.currentUser.name,
      mensaje: this.nuevoComentario,
      fechaCreacion: new Date()
    };
  
    this.firebaseSvc.addDocument('comentarios', comentario).then(() => {
      this.nuevoComentario = '';
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatMessagesContainer) {
        this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
