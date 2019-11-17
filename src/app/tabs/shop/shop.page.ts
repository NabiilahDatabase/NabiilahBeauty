import { ModalController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from './../../services/interface.service';
import { UserService, User } from 'src/app/services/user.service';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

import { ItemPage } from './../../pages/item/item.page';
import { ToolService } from 'src/app/services/tool.service';
import { SearchPage } from 'src/app/pages/search/search.page';
import { Observable, BehaviorSubject } from 'rxjs';
import { scan, tap, take } from 'rxjs/operators';

interface QueryConfig {
  path: string; //  path to collection
  field: string; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order?
  prepend: boolean; // prepend to source?
}

@Component({
  selector: 'app-shop',
  templateUrl: 'shop.page.html',
  styleUrls: ['shop.page.scss']
})
export class ShopPage {

  onload = true;
  products: Product[]; task;
  userInfo: User; task2;

  // Source data
  private query: QueryConfig;
  data: Observable<any>; private $data = new BehaviorSubject([]);
  private $done = new BehaviorSubject(false);
  private $loading = new BehaviorSubject(false);

  constructor(
    private afs: AngularFirestore,
    private dataService: DataService,
    public userService: UserService,
    private modal: ModalController,
    private tool: ToolService,
  ) {
    this.init('produk', 'lastUpdate', { reverse: true, prepend: false });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (!this.userInfo) {
          this.task2 = this.afs.collection('user').doc<User>(user.phoneNumber).valueChanges().subscribe(res => {
            this.userInfo = res;
            this.userService.setUserData(res);
          });
        }
      } else {
        this.userInfo = null;
        console.log('tidak login');
      }
    });
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.more();
      event.target.complete();
    }, 2000);
  }

  async openSearch(event) {
    const modal = await this.modal.create({
      component: SearchPage,
      componentProps: {
        data: event.target.value
      }
    });
    return await modal.present();
  }
  openCart() {
    this.tool.saveRoute('/cart');
  }
  async showItem(itemid: string) {
    const modal = await this.modal.create({
      component: ItemPage,
      componentProps: {
        data: itemid
      }
    });
    return await modal.present();
  }

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, opts?: any) {
    this.query = {
      path,
      field,
      limit: 8,
      reverse: false,
      prepend: false,
      ...opts
    };
    const first = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });
    this.mapAndUpdate(first);
    // Create the observable array for consumption in components
    this.data = this.$data.asObservable().pipe(
      scan( (acc, val) => this.query.prepend ? val.concat(acc) : acc.concat(val) )
    );
    this.onload = false;
  }
  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    if (this.$done.value || this.$loading.value) { return; }
    // loading
    this.$loading.next(true);
    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges().pipe(
      tap(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data();
          const doc = snap.payload.doc;
          return { ...data, doc };
        });
        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values;
        // update source with new values, done loading
        this.$data.next(values);
        this.$loading.next(false);
        // no more values, mark done
        if (!values.length) {
          this.$done.next(true);
        }
      }),
      take(1)
    )
    .subscribe();
  }
  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor();
    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor);
    });
    this.mapAndUpdate(more);
  }
  // Determines the doc snapshot to paginate query
  private getCursor() {
    const current = this.$data.value;
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc;
    }
    return null;
  }

  onDestroy() {
    this.task.unsubscribe();
  }
}
