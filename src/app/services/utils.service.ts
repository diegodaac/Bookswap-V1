import { Injectable, InjectionToken, inject } from '@angular/core';
import {
  LoadingController,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);

  /* =============LOADER =====================*/
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  /* =============LOADER =====================*/
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
}
