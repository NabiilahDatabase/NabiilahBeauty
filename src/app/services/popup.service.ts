import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
    ) {}

  async showToast(message: any, dur: number) {
    const toast = await this.toastController.create({
        message,
        position: 'top',
        duration: dur
    });
    await toast.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
