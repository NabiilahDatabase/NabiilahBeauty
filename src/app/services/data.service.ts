import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { PopupService } from './popup.service';
import { ToolService } from './tool.service';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

import { Product, Cart } from './interface.service';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  productsCollections: AngularFirestoreCollection<Product>;
  products;

  constructor(
    public afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private tool: ToolService,
    private popup: PopupService,
    private userService: UserService,
  ) {
    this.productsCollections = this.afs.collection('produk');
  }

  getProducts(): Observable<Product[]> {
    return this.productsCollections.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
  getProduct(pid: string) {
    return this.productsCollections.doc<Product>(pid).valueChanges();
  }

  async addOrder(data) {
    const tahun = new Date().getFullYear().toString();
    const bulan = ('0' + (new Date().getMonth() + 1)).slice(-2);
    const hari = ('0' + (new Date().getDate())).slice(-2);

    console.log('dataOrdr:', data);
    const loader = await this.loadingCtrl.create({
      message: 'Masukkan Orderan...',
      spinner: 'dots'
    });
    await loader.present();
    try {
      const produkRef: firebase.firestore.DocumentReference[] = [];
      const olahdataBulananProdukRef: firebase.firestore.DocumentReference[] = [];
      const olahdataHarianProdukRef: firebase.firestore.DocumentReference[] = [];
      const produkJumlah = [];
      const hargaBeli = [], hargaJual = [], idBarang = [], jumlah = [], nama = [];
      let jum = 0;
      const customerRef = this.afs.collection('user').doc(data.penerima_id).ref;
      const orderanRef = this.afs.collection('orderan').doc(data.id).ref;

      data.pesanan.forEach(item => {
        jum += item.jumlah;
        produkRef.push(this.afs.collection('produk').doc(item.id).ref);
        olahdataBulananProdukRef.push(this.afs.collection('olahdata').doc('produk').collection(tahun + '-' + bulan).doc(item.id).ref);
        olahdataHarianProdukRef.push(this.afs.collection('olahdata').doc('produk')
          .collection(tahun + '-' + bulan).doc('harian').collection(hari).doc(item.id).ref);

        produkJumlah.push(item.jumlah);
        hargaBeli.push(item.hargaBeli), hargaJual.push(item.hargaJual),
          idBarang.push(item.id), jumlah.push(item.jumlah), nama.push(item.nama);
      });

      const batch = this.afs.firestore.batch();
        // Update Product DB
      produkRef.forEach(async (produk, index) => {
          batch.set(produk, {
            keep: firebase.firestore.FieldValue.increment(+produkJumlah[index]),
            stock: firebase.firestore.FieldValue.increment(-produkJumlah[index]),
          }, { merge: true });
          console.log('berhasil update stock');
        });
        // Update Olahdata Produk Bulanan
      olahdataBulananProdukRef.forEach(async (produk, i) => {
        batch.set(produk, {
          keep: firebase.firestore.FieldValue.increment(+produkJumlah[i]),
        }, { merge: true });
        console.log('berhasil update bulanan');
      });
        // Update Olahdata Produk Harian
      olahdataHarianProdukRef.forEach(async (produk, i) => {
        batch.set(produk, {
          keep: firebase.firestore.FieldValue.increment(+produkJumlah[i]),
        }, { merge: true });
        console.log('berhasil update harian');
      });
        // Update Customer DB
      batch.set(customerRef, {
        keep: firebase.firestore.FieldValue.increment(+jum),
        cart: 0
      }, { merge: true });
      console.log('berhasil update customer');
        // Add Order data
      batch.set(orderanRef, data);

      batch.commit().then(val => console.log(val), error => console.log('Error Commit: ' + error));

/*
      this.afs.firestore.runTransaction(async transaction => {
        // Update Product DB
        produkRef.forEach(async (produk, index) => {
          const produkDoc = await transaction.get(produk);
          if (!produkDoc.exists) {
            throw new Error('BRG ID does not exist!');
          }
          const newKeepWarna = produkDoc.data().keepWarna;
          const newStock = produkDoc.data().jumStock;
          newKeepWarna[produkWarna[index]] = newKeepWarna[produkWarna[index]] + produkJumlah[index];
          newStock[produkWarna[index]] = newStock[produkWarna[index]] - produkJumlah[index];
          transaction.update(produk, {
            keep: produkDoc.data().keep + produkJumlah[index],
            keepWarna: newKeepWarna,
            jumStock: newStock,
          });
          console.log('berhasil update stock');
        });
        // Add Keep DB
        keepRef.forEach(async (keep, i) => {
          transaction.set(keep, {
            barcode: barcode[i],
            cs: data.cs,
            hargaBeli: hargaBeli[i],
            hargaJual: hargaJual[i],
            idBarang: idBarang[i],
            indexWarna: indexWarna[i],
            jumlah: jumlah[i],
            kodeProses: 'X',
            nama: nama[i],
            penerima: penerima[i],
            status: 'keep',
            toko: toko[i],
            type: type[i],
            waktuKeep: data.waktuKeep,
            warna: warna[i],
          });
        });
        // Update Customer DB
        const customerDoc = await transaction.get(customerRef);
        if (!customerDoc.exists) {throw new Error('CS ID does not exist!'); }
        const newKeepCustomer = customerDoc.data().keep + jum;
        transaction.update(customerRef, {
            keep: newKeepCustomer,
          });
        console.log('berhasil update customer');
        // Update Dropshiper DB
        const dropshiperDoc = await transaction.get(dropshiperRef);
        if (!dropshiperDoc.exists) {throw new Error('DRP ID does not exist!'); }
        let deposit = 0;
        if (data.ninggal > 0) { deposit = data.ninggal; }
        const newKeepDropshiper = dropshiperDoc.data().keep + jum;
        transaction.update(dropshiperRef, {
            keep: newKeepDropshiper,
            deposit,
          });
        console.log('berhasil update dropshiper');
        // Update Admin DB
        const adminDoc = await transaction.get(adminRef);
        if (!adminDoc.exists) {throw new Error('CS ID does not exist!'); }
        const newKeepAdmin = adminDoc.data().keep + jum;
        transaction.update(adminRef, {
            keep: newKeepAdmin,
          });
        console.log('berhasil update cs');
        // Add Order data
        transaction.set(orderanRef, data);
      }).catch(error => {
        this.popup.showAlert('Error Stock!', error);
      });
*/
      loader.dismiss();
      this.popup.showToast('Berhasil masukkan orderan', 1000);
      this.cleanCart(data.pesanan, data.penerima_id);
      this.popup.showToast('Checkout berhasil!', 2000);
      this.tool.saveRoute('/tabs');
    } catch (error) {
      loader.dismiss();
      console.log('Error Order!', error);
    }
  }

  async cleanCart(cart: any[], uid) {
    try {
      cart.forEach(async item => {
        await this.afs.collection('user').doc(uid).collection('cart').doc<Cart>(item.id).delete();
      });
    } catch (error) {
      this.popup.showAlert('Error clean cart!', error);
    }
  }

}
