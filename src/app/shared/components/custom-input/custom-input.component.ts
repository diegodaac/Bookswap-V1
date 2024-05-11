import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() Clave!:string; /* ERROR CARACTER ESPECIAL */
  @Input() autocomplete!: string;
  @Input() icon!: string;

  isPassword!: boolean;
  hide: boolean = true;



  constructor() { }

  ngOnInit() {

    if (this.type == 'password') this.isPassword= true; 
  }

  showOrHidePassword(){
    this.hide = !this.hide;


    if (this.hide) this.type = 'password';
    else this.type = 'text'
  }

}
