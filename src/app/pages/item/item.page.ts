import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { NavParams, ModalController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage {

  @Input() data: string;
  product; task;
  pilihanWarna = ''; indexWarna;
  jumlah;

  constructor(
    private dataService: DataService,
    private cartService: CartService,
    private navParam: NavParams,
    public modalCtrl: ModalController,
    ) {
    this.jumlah = 1;
    this.task = this.dataService.getProduct(this.navParam.get('data')).subscribe(res => {
      this.product = res;
    });
  }

  keep() {
    this.cartService.addCart({
      id: this.navParam.get('data'),
      jumlah: this.jumlah,
      ...this.product
    });
    this.dismiss();
  }
  c(int: number) {
    if (this.jumlah > 0) {
      if (this.jumlah === 1 && int === -1) {
        this.jumlah = 1;
      } else {this.jumlah += int; }
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
