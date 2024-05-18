import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages= [
    {title: 'Inicio', url:'/main/home', icon: 'home-outline'},
    {title: 'Perfil', url:'/main/profile', icon: 'person-outline'},
    {title:'Buscar', url:'/main/foro', icon:'search-outline'},
    {title:'Chat', url:'/main/comentarios', icon:'chatbubbles-outline'}
  ]

  router= inject(Router);

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  currentPath: string ='';

  ngOnInit() {
    this.router.events.subscribe((event: any)=>{
      if(event?.url) this.currentPath = event.url;
    })
  }


  user():user{
    return this.utilsSvc.getFromLocalStorage('user');
  }


  /* Cerrar Sesión */
  async signOut() {
    await this.firebaseSvc.signOut();
    this.utilsSvc.removeFromLocalStorage('user'); //Elimina cualquier dato de usuario almacenado
    window.location.reload();
  }
}/* FIN */
