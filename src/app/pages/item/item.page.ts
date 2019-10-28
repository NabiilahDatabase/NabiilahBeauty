import { Product } from 'src/app/services/interface.service';
import { PopupService } from './../../services/popup.service';
import { ToolService } from './../../services/tool.service';
import { UserService } from './../../services/user.service';
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
  product: Product; task;
  pilihanWarna = ''; indexWarna;
  jumlah;

  constructor(
    private dataService: DataService,
    private cartService: CartService,
    private userService: UserService,
    private navParam: NavParams,
    public modalCtrl: ModalController,
    private tool: ToolService,
    private popup: PopupService,
    ) {
    this.jumlah = 1;
    this.task = this.dataService.getProduct(this.navParam.get('data')).subscribe(res => {
      this.product = res;
    });
  }

  keep() {
    if (this.userService.user) {
      this.cartService.addCart({
        id: this.navParam.get('data'),
        jumlah: this.jumlah,
        ...this.product
      });
    } else {
      this.tool.saveRoute('/login');
    }
    this.dismiss();
  }
  c(int: number) {
    if ((this.jumlah === 1 && int === -1) || (this.jumlah === this.product.stock && int === 1)) {
    } else {
      this.jumlah += int;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
