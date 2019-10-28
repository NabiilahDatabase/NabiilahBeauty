import { ModalController } from '@ionic/angular';
import { User } from './../../services/user.service';
import { EkspedisiService } from './../../services/ekspedisi.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ekspedisi',
  templateUrl: './ekspedisi.page.html',
  styleUrls: ['./ekspedisi.page.scss'],
})
export class EkspedisiPage implements OnInit {

  ongkirList; onload = true;
  ongkirPilihan;

  kecamatanBaki = '5977';
  customer;
  berat;

  constructor(
    private ekspedisi: EkspedisiService,
    private modalCtrl: ModalController,
  ) {
  }

  pilihEkspedisi(eksp) {
    this.ongkirPilihan = {
      kurir: eksp.code,
      service: eksp.service,
      ongkir: eksp.cost,
    };
  }

  pilih() {
    let serv = '';
    switch (this.ongkirPilihan.service) {
      case 'Paket Kilat Khusus': { serv = 'Kilat'; break; }
      case 'Express Next Day Barang': { serv = 'Express'; break; }
      default: { serv = this.ongkirPilihan.service; break; }
    }
    this.dismiss({
      kurir: this.ongkirPilihan.kurir,
      service: serv,
      ongkir: this.ongkirPilihan.ongkir,
    });
  }

  ngOnInit() {
    this.ekspedisi.cekOngkirQL(this.kecamatanBaki, this.customer.kec_id.toString(), this.berat.toString()).subscribe(({data}) => {
      // tslint:disable-next-line: no-string-literal
      this.ongkirList = data['cekOngkir'];
      this.onload = false;
      console.log(this.ongkirList);
    });
  }

  dismiss(data?) {
    this.modalCtrl.dismiss(data);
  }

}
