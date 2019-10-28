import { ToolService } from './tool.service';
import { DataService } from 'src/app/services/data.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PopupService } from './popup.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from './interface.service';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  userDoc: AngularFirestoreDocument;
  cartColl: AngularFirestoreCollection;
  userid: string;

  constructor(
    private afs: AngularFirestore,
    private userService: UserService,
    private dataService: DataService,
    private tool: ToolService,
    private popup: PopupService,
    private router: Router,
    private alert: AlertController,
  ) {
    this.userid = this.userService.getUserId();
    this.userDoc = this.afs.collection('user').doc(this.userid);
    this.cartColl = this.afs.collection('user').doc(this.userid).collection('cart');
  }

  getCart(): Observable<Cart[]> {
    return this.afs.collection('user').doc(this.userid).collection<Cart>('cart').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  async addCart(item) {
    const batch = this.afs.firestore.batch();
    const itemRef = this.cartColl.doc<Cart>(item.id).ref;
    const userRef = this.userDoc.ref;
    try {
      const doc = await itemRef.get();
      if (doc.exists) {
        batch.update(itemRef, { jumlah: firebase.firestore.FieldValue.increment(item.jumlah) });
      } else {
        batch.set(itemRef, { jumlah: item.jumlah }, { merge: true });
      }
      batch.update(userRef, { cart: firebase.firestore.FieldValue.increment(item.jumlah) });
      batch.commit().then(() =>
        this.popup.showToast(`Berhasil dimasukkan keranjang`, 800)
      );
    } catch (error) {
      this.popup.showAlert('Terjadi kesalahan:', error);
    }
  }

  async updateCart(item, numb: number) {
    const batch = this.afs.firestore.batch();
    const itemRef = this.cartColl.doc<Cart>(item.id).ref;
    const userRef = this.userDoc.ref;
    try {
      const doc = await itemRef.get();
      if (doc.data().jumlah > 0) {
        console.log(doc.data().jumlah);
        if (doc.data().jumlah === 1 && numb === -1) {
          this.deleteItem(item, true);
        } else {
          batch.update(itemRef, { jumlah: firebase.firestore.FieldValue.increment(numb) });
          batch.update(userRef, { cart: firebase.firestore.FieldValue.increment(numb) });
        }
        batch.commit();
      }
    } catch (error) {
      this.popup.showAlert('Error getting Cart:', error);
    }
  }

  async deleteItem(item, closeCart: boolean) {
    try {
      const batch = this.afs.firestore.batch();
      const itemRef = this.cartColl.doc<Cart>(item.id).ref;
      const userRef = this.userDoc.ref;
      const doc = await itemRef.get();
      if (doc.exists) {
        const alert = await this.alert.create({
          message: `Hapus ${item.nama} dari keranjang?`,
          mode: 'ios',
          buttons: [
              { text: 'Batal', handler: () => alert.dismiss() },
              { text: 'Ya', handler: () => {
                  batch.update(userRef, { cart: firebase.firestore.FieldValue.increment(-doc.data().jumlah) });
                  batch.delete(itemRef);
                  batch.commit().then(
                    () => { if (closeCart) { this.router.navigate(['/tabs']); } }
                  );
                }
              }
          ]
        });
        await alert.present();
      }
    } catch (error) {
      this.popup.showAlert('Error delete item!', error);
    }
  }

  async checkout(barang, customer, ekspedisi, total: number) {
    try {
      const status = 'order';
      const sender = {
        nama: 'NABIILAHSTORE.COM',
        hp: '+62822-4278-3494',
      };
      let berat = 0;
      const pesanan = [];
      barang.forEach((item) => {
        berat += item.subberat;
        pesanan.push({
          id: item.id,
          nama: item.nama,
          jumlah: item.jumlah,
          hargaJual: item.hargaJual
        });
      });
      this.dataService.addOrder({
        id: this.tool.getUnixTime() + this.tool.generateNumber(3) + '-' + this.tool.generateNumber(2),
        penerima_id: customer.uid,
        penerima: {
          nama: customer.nama,
          kec: customer.kec,
          kab: customer.kab,
          prov: customer.prov,
          hp: customer.hp,
        },
        pengirim: {
          nama: sender.nama,
          hp: sender.hp,
        },
        pesanan,
        status,
        berat,
        waktuKeep: this.tool.getUnixTime(),
        ekspedisi,
        total,
      });
    } catch (error) {
      this.popup.showAlert('Error checkout!', error);
    }
  }
}
