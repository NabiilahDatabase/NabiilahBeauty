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
    private popup: PopupService,
    private router: Router,
    private alert: AlertController,
  ) {
    this.userid = this.userService.getUserId();
    this.userDoc = this.afs.collection('user').doc(this.userid);
    this.cartColl = this.userDoc.collection('cart');
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
        this.popup.showToast(`${item.nama} berhasil dimasukkan keranjang`, 800)
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
      const doc = await this.cartColl.doc<Cart>(item.id).ref.get();
      if (doc.data().jumlah > 0) {
        if (doc.data().jumlah === 1 && numb === -1) {
          this.deleteItem(item, true);
        } else {
          batch.update(itemRef, { jumlah: firebase.firestore.FieldValue.increment(numb) });
        }
        batch.update(userRef, { cart: firebase.firestore.FieldValue.increment(numb) });
        batch.commit();
      }
    } catch (error) {
      this.popup.showAlert('Error getting Cart:', error);
    }
  }

  async deleteItem(item, closeCart: boolean) {
    try {
      const doc = await this.cartColl.doc<Cart>(item.id + '-' + item.indexWarna).ref.get();
      if (doc.exists) {
        const alert = await this.alert.create({
          message: `Hapus ${item.nama} ${item.warna[item.indexWarna]} dari keranjang?`,
          mode: 'ios',
          buttons: [
              { text: 'Batal', handler: () => alert.dismiss() },
              { text: 'Ya', handler: () => {
                  if (closeCart) { doc.ref.delete(); this.router.navigate(['/tabs']); }
                  doc.ref.delete();
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

  async cleanCart(cart: any[]) {
    try {
      cart.forEach(async item => {
        await this.cartColl.doc<Cart>(item.id).delete();
      });
    } catch (error) {
      this.popup.showAlert('Error clean cart!', error);
    }
  }
}
