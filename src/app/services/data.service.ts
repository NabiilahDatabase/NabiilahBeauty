import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { PopupService } from './popup.service';
import { ToolService } from './tool.service';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

import { Product } from './interface.service';
import { Observable } from 'rxjs';

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

}
