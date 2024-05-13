import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateBooksComponent } from './components/add-update-books/add-update-books.component';



@NgModule({
  declarations: [
    HeaderComponent, 
    CustomInputComponent, 
    LogoComponent,
    AddUpdateBooksComponent
  ],
  exports: [
    HeaderComponent, 
    CustomInputComponent, 
    LogoComponent,
    ReactiveFormsModule,
    AddUpdateBooksComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
