import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { finalize, share, map } from 'rxjs/operators';
// import { HTTP } from '@ionic-native/http/ngx';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export interface Ongkir {
  code: string;
  name: string;
  service: string;
  description: string;
  cost: number;
}

@Injectable({
  providedIn: 'root'
})
export class EkspedisiService {

  api = 'http://ethereal-hub-250008.appspot.com/api';
  key = '?key=987286a844f6ef239329061fa837f43e';
  ekspedisi = 'jne%3Apos%3Atiki%3Awahana%3Ajnt%3Aindah%3Alion';
  headers: HttpHeaders;

  dataKecamatan; task;
  dataOngkir; task2;

  cekOngkirMutation = gql`
  mutation cekOngkir(
    $origin: String!,
    $originType: String!,
    $destination: String!,
    $destinationType: String!,
    $weight: String!,
    $courier: String!
    ) {
    cekOngkir(data: {
      origin: $origin,
      originType: $originType,
      destination: $destination,
      destinationType: $destinationType,
      weight: $weight,
      courier: $courier }
      ) {
        code
        name
        service
        description
        cost
        etd
      }
    }
  `;

  constructor(
    private http: HttpClient,
    private apollo: Apollo,
    // private httpNative: HTTP
  ) {
    this.task = this.http.get('assets/rajaongkir.kec.json').subscribe(res => {
      this.dataKecamatan = res;
    });
  }

  getData(district: string) {
    const headers = new HttpHeaders()
      .append('key', '987286a844f6ef239329061fa837f43e');
    return this.http.get(this.api + '/' + district, {headers}).pipe(share());
    /*
    .subscribe(data => {
      // tslint:disable-next-line: no-string-literal
      this.data = data['rajaongkir'];
      console.log(data);
    }, err => {
      console.log('JS Call error: ', err);
    });
    */
  }
  cekOngkir(asalID: number, tujuanID: number, berat: number) {
    if (asalID && tujuanID && berat) {
      const headers = new HttpHeaders()
      // .append('key', '987286a844f6ef239329061fa837f43e');
      .append('Content-Type', 'application/x-www-form-urlencoded');
      // tslint:disable-next-line: max-line-length
      const data = `origin=${asalID.toString()}&originType=subdistrict&destination=${tujuanID.toString()}&destinationType=subdistrict&weight=${berat}&courier=${this.ekspedisi}`;
      return this.http.post(this.api + '/cost', data, {headers}).pipe(share());
    }
  }

  cekOngkirNative(asalID: number, tujuanID: number, berat: number) {
    if (asalID && tujuanID && berat) {
      const headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
      // tslint:disable-next-line: max-line-length
      const data = `origin=${asalID.toString()}&originType=subdistrict&destination=${tujuanID.toString()}&destinationType=subdistrict&weight=${berat}&courier=${this.ekspedisi}`;
      const dataO = {
        origin: asalID.toString(),
        originType: 'subdistrict',
        destination: tujuanID.toString(),
        destinationType: 'subdistrict',
        weight: berat,
        courier: this.ekspedisi
      };
      const dataOparse = JSON.stringify(dataO);
      // this.httpNative.setDataSerializer('urlencoded');
      // this.httpNative.setHeader('*', 'key', '987286a844f6ef239329061fa837f43e');
      // return this.httpNative.sendRequest(this.api + '/cost', {
      //  method: 'post',
      //  data: {data},
      //  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //  timeout: 5000
      // });
      // return this.httpNative.post(this.api + '/cost', dataO, {});
    }
  }
  cekOngkirQL(asalID: string, tujuanID: string, beratPaket: string) {
    return this.apollo.mutate({
      mutation: this.cekOngkirMutation,
      variables: {
        origin: asalID,
        originType: 'subdistrict',
        destination: tujuanID,
        destinationType: 'subdistrict',
        weight: beratPaket,
        courier: 'jne:wahana:pos:tiki:jnt:indah:lion'
      }
    });
  }

  cariKecamatan(searchTerm: string) {
    if (!this.dataKecamatan) {return []; }
    return this.dataKecamatan.filter(item => {
      return item.subdistrict_name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
}
