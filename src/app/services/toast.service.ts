import { Injectable, inject } from '@angular/core';
import { ToastAlertsAbstractService, ToastData } from '@dataclouder/ngx-core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastAlertService extends ToastAlertsAbstractService {
  private toastController = inject(ToastController);

  private async presentToast(data: ToastData, color: string, duration: number, icon: string) {
    const toast = await this.toastController.create({
      message: `${data.title}: ${data.subtitle}`,
      color: color,
      duration: duration,
      position: 'top',
      icon: icon,
    });
    toast.present();
  }

  public success(data: ToastData) {
    this.presentToast(data, 'success', 3000, 'thumbs-up-outline');
  }

  info(data: ToastData): void {
    this.presentToast(data, 'primary', 3000, 'information-circle-outline');
  }

  warn(data: ToastData): void {
    this.presentToast(data, 'warning', 4500, 'warning-outline');
  }

  error(data: ToastData): void {
    this.presentToast(data, 'danger', 4000, 'alert-circle-outline');
  }
}
