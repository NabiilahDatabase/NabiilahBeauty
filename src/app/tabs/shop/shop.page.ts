import { Component } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: 'shop.page.html',
  styleUrls: ['shop.page.scss']
})
export class ShopPage {

  constructor() {}

  openSearch() {
    console.log('hoso');
  }
  openCart() {
    console.log('open cart');
  }
}
