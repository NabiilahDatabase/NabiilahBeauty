import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from './../../services/interface.service';
import { UserService, User } from 'src/app/services/user.service';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

import { ItemPage } from './../../pages/item/item.page';

@Component({
  selector: 'app-shop',
  templateUrl: 'shop.page.html',
  styleUrls: ['shop.page.scss']
})
export class ShopPage {

  onload = true;

  products: Product[]; task;
  userInfo: User; task2;

  constructor(
    private afs: AngularFirestore,
    private dataService: DataService,
    public userService: UserService,
    private modal: ModalController,
  ) {
    this.task = this.dataService.getProducts().subscribe(res => {
      this.onload = false;
      this.products = res;
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (!this.userInfo) {
          this.task2 = this.afs.collection('user').doc<User>(user.uid).valueChanges().subscribe(res => {
            this.userInfo = res;
          });
        }
      } else {
        this.userInfo = null;
        console.log('tidak login');
      }
    });
  }

  openSearch() {
    console.log('hoso');
  }
  openCart() {
    console.log('open cart');
  }

  async showItem(itemid: string) {
    const modal = await this.modal.create({
      component: ItemPage,
      componentProps: {
        data: itemid
      }
    });
    return await modal.present();
  }

  onDestroy() {
    this.task.unsubscribe();
  }
}
