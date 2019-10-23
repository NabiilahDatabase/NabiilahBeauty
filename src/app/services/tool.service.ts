import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(
    private zone: NgZone,
    private router: Router,
    private clipboard: Clipboard,
    private popup: PopupService
  ) { }

  copyText(text: string, toastMessage?: string) {
    this.clipboard.copy(text);
    if (toastMessage) {
      this.popup.showToast(toastMessage, 1000);
    }
  }
  pasteText(addText?: string): string {
    let text;
    this.clipboard.paste().then(t => text = t);
    return text + addText;
  }

  titleCase(str) {
    if (str) {
      str = str.toLowerCase();
      str = str.split(' ');
      for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
      }
      return str.join(' ');
    }
  }
  getUnixTime() {
    return Math.round(new Date().getTime() / 1000);
  }
  generateNumber(x: number)  {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let n; const r = [];
    for (n = 1; n <= x; n++) {
       const i = Math.floor((Math.random() * (9 - n)) + 1);
       r.push(a[i]);
       a[i] = a[9 - n];
    }
    let uid = '';
    for (let j = 0; j < x; j++) {
       uid += r[j] + '';
    }
    return uid;
  }

  async saveRoute(link: string) {
    this.zone.run(async () => {
      await this.router.navigate([link]);
    });
  }

  bacaTeks(teks: string, key: string, batas: string) {
    teks = teks.toLowerCase();
    const awal = teks.indexOf(key);
    let akhir = 0;
    if (batas === '$') {
      akhir = teks.length;
    } else { akhir = teks.indexOf(batas, awal); }
    const isi = awal + key.length;
    let hasil = '';
    if (awal > -1) {
      hasil = teks.slice(isi, akhir).trim();
      const verifikasi = hasil.match( /hp|prov/g );
      if (!verifikasi || key === 'alamat:') {
        return hasil;
      } else { return ''; }
    } else { return ''; }
  }

  formatHp(no) {
    if (no) {
      let fn = no.replace(/[^0-9+]/g, '');
      if (fn.length < 14 || fn.charAt(0) === '+') {
        if (fn.charAt(0) !== '+') {
          fn = '+62' + fn.substring(1);
        }
        return fn;
      } else { return null; }
    }
  }
}
