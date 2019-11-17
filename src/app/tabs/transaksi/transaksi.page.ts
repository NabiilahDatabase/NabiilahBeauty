import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PopupService } from 'src/app/services/popup.service';

import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';
import { Invoice } from 'src/app/services/interface.service';

import { UploadBuktiPage } from 'src/app/pages/upload-bukti/upload-bukti.page';

@Component({
  selector: 'app-transaksi',
  templateUrl: 'transaksi.page.html',
  styleUrls: ['transaksi.page.scss']
})
export class TransaksiPage {

  keeps; task;
  subtotal;

  onLoad = true;

  filterPil = 'order';
  modeCari = false;
  searchResult; task2;

  constructor(
    private dataService: DataService,
    private clipboard: Clipboard,
    private popup: PopupService,
    private alertController: AlertController,
    private tool: ToolService,
    private modal: ModalController,
    public userService: UserService,
  ) {
    this.task = this.dataService.getKeeps('order').subscribe(res => {
      this.onLoad = false;
      this.keeps = res;
      // console.log(res);
    });
  }

  filter(pilihan: string) {
    this.modeCari = false;
    this.filterPil = pilihan;
    if (pilihan !== 'barang') {
      this.task.unsubscribe();
      this.task = this.dataService.getKeeps(pilihan).subscribe(res => {
        this.keeps = res;
      });
    }
  }

  async cancel(invoice: Invoice) {
    const alert = await this.alertController.create({
      header: 'Hapus Checkout!',
      mode: 'ios',
      message: `Yakin mau hapus pesanan ini?`,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Yakin',
          handler: () => {
            this.dataService.cancelOrder(invoice);
          }
        }
      ]
    });
    await alert.present();
  }

  async bayar(invoice: Invoice) {
    const modal = await this.modal.create({
      component: UploadBuktiPage,
      componentProps: {
        data: invoice
      }
    });
    return await modal.present();
  }

  openCart() {
    this.tool.saveRoute('/cart');
  }

  /*
  async menu(data) {
    const popover = await this.popoverController.create({
      component: InvoiceMenuComponent,
      event: data,
      translucent: true,
      mode: 'ios'
    });
    return await popover.present();
  }
  */

  onDestroy() {
    this.task.unsubscribe();
  }

}
