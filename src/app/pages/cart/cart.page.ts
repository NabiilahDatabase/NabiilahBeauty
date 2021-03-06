import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Observable, combineLatest } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

import { ModalController } from '@ionic/angular';
import { UserService, User } from 'src/app/services/user.service';

// import { CustomerlistPage } from '../customerlist/customerlist.page';
// import { DropshiperlistPage } from 'src/app/pages/dropshiperlist/dropshiperlist.page';
import { EkspedisiPage } from 'src/app/pages/ekspedisi/ekspedisi.page';
import { ToolService } from 'src/app/services/tool.service';
import { Cart, Product, Alamat } from 'src/app/services/interface.service';
import { PilihAlamatPage } from 'src/app/pages/user/pilih-alamat/pilih-alamat.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cart: any[];
  cartDetails: Cart[];
  userInfo: Observable<User>;
  customerData; task3;
  dropshiperData;

  adaSender = false;
  senderName;
  senderNumber = '+';
  defaultSender = {
    nama: 'NABIILAHSTORE.COM',
    hp: '+62822-4278-3494',
  };
  ekspedisi;

  adaDiskon = false;
  diskon = 0;
  adaPotongan = false;
  potongan = 0;
  $diskon = 0;
  deposit = 0;
  hutang = 0;

  jumlahBarang = 0;
  kodeUnik: number;
  total = 0;
  beratPaket = 0;

  onload = true;

  valid;
  task; task2;

  constructor(
    private dataService: DataService,
    public cartService: CartService,
    public modal: ModalController,
    public userService: UserService,
    private tool: ToolService,
    ) {
      this.valid = (value: any, index: number, array: any[]): boolean => {
        return value === true;
      };
      this.task3 = this.userService.getAlamat(this.userService.user.alamat_utama, true).subscribe((res: Alamat) => {
        console.log(res);
        this.customerData = res;
      });
    }

  ngOnInit() {
    this.getCart();
  }
  onDestroy() {
    this.task.unsubscribe();
    this.task2.unsubscribe();
  }

  getCart() {
    this.task = this.cartService.getCart().subscribe(res => {
      const product: Observable<Product>[] = [];
      this.cartDetails = res;
      if (res) {
        res.map(item => {
          product.push(this.dataService.getProduct(item.id));
        });
        this.task2 = combineLatest(product).subscribe(produk => {
          if (produk) {
            this.cart = produk.map((items, i) => {
              const id = this.cartDetails[i].id;
              const jumlah = this.cartDetails[i].jumlah;
              const subtotal = items.hargaJual * jumlah;
              const subberat = items.berat * jumlah;
              const valid = items.stock !== 0 && items.stock >= jumlah;
              return {id, jumlah, subtotal, valid, subberat, ...items};
            });
            this.onload = false;
            this.hitung();
          }
        });
      } else {
        this.cart = null;
      }
    });
  }

  async editCustomer() {
    const modal = await this.modal.create({
      component: PilihAlamatPage,
      // componentProps: { userInfo: this.customerData }
    });
    modal.onDidDismiss()
      .then((prop) => {
        if (prop.data) {
          console.log(prop.data);
          this.customerData = prop.data;
          this.ekspedisi = null;
          this.hitung();
        }
    });
    await modal.present();
  }

  editBarang(item, num) {
    this.cartService.updateCart(item, num);
    this.ekspedisi = null;
    this.hitung();
  }
  hapusBarang(item) {
    this.cartService.deleteItem(item, true).then(() => {
      this.ekspedisi = null;
      this.hitung();
    });
  }

  async editEkspedisi(customer) {
    let berat = 0;
    this.cart.forEach((item) => {
      berat += item.subberat;
    });
    const modal = await this.modal.create({
      component: EkspedisiPage,
      componentProps: {
        customer, berat
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data) {
          this.ekspedisi = data.data;
          this.hitung();
        }
    });
    return await modal.present();
  }

  hitung() {
    this.jumlahBarang = 0;
    this.total = 0;
    this.beratPaket = 0;
    // this.$diskon = 0;
    // this.adaPotongan = false;
    // this.potongan = 0;

    this.cart.forEach((item) => {
      this.jumlahBarang += item.jumlah;
      this.total += item.subtotal;
      this.beratPaket += item.subberat;
      // if (this.jumlahBarang >= 6) {
      //   this.adaPotongan = true;
      //   this.potongan = 5000 * this.jumlahBarang;
      //   if (this.jumlahBarang >= 12) {
      //     this.potongan = 10000 * this.jumlahBarang;
      //     if (this.jumlahBarang >= 24) {
      //       this.potongan = 15000 * this.jumlahBarang;
      //     }
      //   }
      // }
    });
    if (this.ekspedisi) {
      // if (this.adaDiskon) {
      //   this.$diskon = this.diskon;
      // } else {
      //   this.$diskon = this.potongan;
      // }
      this.kodeUnik = Number(this.tool.generateNumber(3));
      this.total = this.total + this.ekspedisi.ongkir + this.kodeUnik;
    }
  }

  checkout() {
    let sender = { nama: '', hp: ''};
    if (!this.senderName) {
      sender = this.defaultSender;
    } else {
      sender.nama = this.senderName.toUpperCase();
      sender.hp = '+' + this.senderNumber;
    }
    const cart = this.cart.map(item => {
      const status = 'keep';
      const waktuKeep = this.tool.getUnixTime();
      const diprint = false;
      return {...item, status, waktuKeep, diprint,
      };
    });
    this.cartService.checkout(
      cart, sender, this.customerData, this.ekspedisi, this.total
    );
    // console.log('Barang: ', cart);
    // console.log('Customer: ', this.customerData);
    // console.log('Sender: ', sender);
    // console.log('Expedition: ', this.ekspedisi);
  }

}
