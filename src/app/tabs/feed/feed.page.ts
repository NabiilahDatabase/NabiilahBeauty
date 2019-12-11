import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { User, UserService } from 'src/app/services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  status = 'Waw dan waw sekali setiap hari menjadi guru berarti sangat sekali mejadi wonderwoman, ' +
    'karna seperti dicari kepada cikeding ding selalu dibawa ke rumahsakit';
  lengkap = false;
  like = false;

  userInfo; task2;
  onload = false;

  constructor(
    private afs: AngularFirestore,
    private userService: UserService,
    private tool: ToolService,
  ) {
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

  ngOnInit() {
  }

  openCart() {
    this.tool.saveRoute('/cart');
  }

}
