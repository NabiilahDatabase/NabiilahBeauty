import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Product } from 'src/app/services/interface.service';
import { ItemPage } from '../item/item.page';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @Input() data: string;
  searchResult: Product[]; task;

  constructor(
    private itemModal: ModalController,
    private modal: ModalController,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.task = this.dataService.searchProduct(this.data).subscribe(res => {
      this.searchResult = res;
      console.log(res);
    });
  }

  cari(event) {
    this.task = this.dataService.searchProduct(event.target.value.trim()).subscribe(res => {
      this.searchResult = res;
      console.log(res);
    });
  }
  async showItem(id: string) {
    const modal = await this.itemModal.create({
      component: ItemPage,
      componentProps: {
        data: id
      }
    });
    await modal.present();
  }

  dismiss() {
    this.modal.dismiss();
  }
  onDestroy() {
    this.task.unsubscribe();
  }
}
