import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-books',
  templateUrl: './add-update-books.component.html',
  styleUrls: ['./add-update-books.component.scss'],
})
export class AddUpdateBooksComponent  implements OnInit {

/* ======FORM GROUP======= */
form = new FormGroup({
  uid: new FormControl(''),
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required]),
  name: new FormControl('', [Validators.required, Validators.minLength(3)])
});

firebaseSvc = inject(FirebaseService);
utilsSvc = inject(UtilsService);

ngOnInit() {}

async submit() {
  if (this.form.valid) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc
      .signUp(this.form.value as user)
      .then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name);
        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
        this.setUserInfo(uid);
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
}

async setUserInfo(uid: string) {
  if (this.form.valid) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    
    let path= 'users/${uid}';
    delete this.form.value.password;

    this.firebaseSvc
      .setDocument(path, this.form.value)
      .then(async res => {
        this.utilsSvc.saveInLocalStorage('user', this.form.value);
        this.utilsSvc.routerLink('/main/home');
        this.form.reset();
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
}

}
