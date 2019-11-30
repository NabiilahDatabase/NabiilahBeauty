import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  csLink;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
  ) {
    this.csLink = this.afs.collection('config').doc('kontak-cs').valueChanges();
  }

  route(tab: string) {
    this.router.navigate([`tabs/${tab}`]);
  }
}
