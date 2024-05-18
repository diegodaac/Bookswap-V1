import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'foro',
        loadChildren: () => import('./foro/foro.module').then( m => m.ForoPageModule)
      },
      {
        path: 'terms',
        loadChildren: () => import('./terms/terms.module').then( m => m.TermsPageModule)
      },
      {
        path: 'comentarios',
        loadChildren: () => import('./comentarios/comentarios.module').then( m => m.ComentariosPageModule)
      }
    ]
  },  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule)
  },


  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
