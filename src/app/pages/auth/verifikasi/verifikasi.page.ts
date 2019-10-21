import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-verifikasi',
  templateUrl: './verifikasi.page.html',
  styleUrls: ['./verifikasi.page.scss'],
})
export class VerifikasiPage implements OnInit {

  data;
  @Input() hp: number;

  constructor(
    private modal: ModalController,
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modal.dismiss(this.data);
  }

}
