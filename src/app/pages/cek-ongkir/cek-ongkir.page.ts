import { Component, OnInit } from '@angular/core';
import { EkspedisiService } from 'src/app/services/ekspedisi.service';

@Component({
  selector: 'app-cek-ongkir',
  templateUrl: './cek-ongkir.page.html',
  styleUrls: ['./cek-ongkir.page.scss'],
})
export class CekOngkirPage implements OnInit {

  expand = false;
  dataKecamatan = [];
  kecPilihan; kec;
  berat;

  kecamatanBaki = '5977';
  ongkirList; onload = false;

  constructor(
    private ekspedisi: EkspedisiService
  ) { }

  ngOnInit() {
  }

  cari(teks: string) {
    if (teks.length > 1) {
      this.dataKecamatan = this.ekspedisi.cariKecamatan(teks).sort().slice(0, 10);
    } else { this.dataKecamatan = []; }
  }
  pilihKecamatan(data) {
    this.expand = false;
    this.kecPilihan = data;
    console.log(data);
  }

  cekOngkir() {
    this.onload = true;
    this.ekspedisi.cekOngkirQL(this.kecamatanBaki, this.kecPilihan.subdistrict_id.toString(), this.berat.toString()).subscribe(({data}) => {
      // tslint:disable-next-line: no-string-literal
      this.ongkirList = data['cekOngkir'];
      this.onload = false;
      console.log(this.ongkirList);
    });
  }

}
