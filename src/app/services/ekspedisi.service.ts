import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EkspedisiService {

  dataKecamatan; task;

  constructor(
    private http: HttpClient,
  ) {
    this.task = this.http.get('assets/rajaongkir.kec.json').subscribe(res => {
      this.dataKecamatan = res;
    });
  }

  cariKecamatan(searchTerm: string) {
    if (!this.dataKecamatan) {return []; }
    return this.dataKecamatan.filter(item => {
      return item.subdistrict_name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

}
