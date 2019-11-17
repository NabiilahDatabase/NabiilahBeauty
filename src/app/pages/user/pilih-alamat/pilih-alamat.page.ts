import { PopupService } from './../../../services/popup.service';
import { ModalController } from '@ionic/angular';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { EditAlamatPage } from '../edit-alamat/edit-alamat.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pilih-alamat',
  templateUrl: './pilih-alamat.page.html',
  styleUrls: ['./pilih-alamat.page.scss'],
})
export class PilihAlamatPage implements OnInit {

  listAlamat; task;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
  ) {
    this.task = this.userService.getAlamat().subscribe(res => {
      console.log(res);
      this.listAlamat = res;
    });
  }

  pilih(penerima) {
    this.modalCtrl.dismiss(penerima);
  }
  hapusAlamat(id: string) {
    this.userService.deleteAlamat(id);
  }
  async editAlamat(id: string) {
    const modal = await this.modalCtrl.create({
      component: EditAlamatPage,
      componentProps: { id }
    });
    await modal.present();
  }
  async addAlamat() {
    const modal = await this.modalCtrl.create({
      component: EditAlamatPage,
      componentProps: { id: null }
    });
    await modal.present();
  }

  cari(event) {
    this.task = this.userService.getAlamat(event.target.value, false).subscribe(res => {
      console.log(res);
      this.listAlamat = res;
    });
  }

  ngOnInit() {
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

}
