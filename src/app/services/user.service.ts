import { AlertController } from '@ionic/angular';
import { ToolService } from './tool.service';
import { PopupService } from './popup.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import * as firebase from 'firebase';

export interface User {
  email: string;
  hp: number;
  password: string;
  nama: string;
  kec: string;
  kab: string;
  prov: string;
  keep: number; cancel: number; success: number;
  cart: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: User; task;

  constructor(
    private afs: AngularFirestore,
    private popup: PopupService,
    private zone: NgZone,
    private router: Router,
    private alertController: AlertController,
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (!this.user) {
          this.setUser(user.uid);
        }
      } else {
        console.log('belum login');
      }
    });
  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
              resolve(true); // user sudah login
              if (!this.user) {
                this.setUser(user.uid);
              }
            } else {
              resolve(false); // user belum login
              this.zone.run(async () => {
                await this.router.navigate(['/login']);
              });
            }
        });
    });
  }

  setUser(userid: string) {
    console.log(this.user);
    this.task = this.afs.collection('user').doc<User>(userid).valueChanges().subscribe(res => {
      this.user = res;
    });
    console.log('setUser');
  }
  getUserId() {
    return firebase.auth().currentUser.uid;
  }
  getUserInfo() {
    console.log('getuserinfo');
    return this.user;
  }

  async registerUser(data: User) {
    try {
      const userdata = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
      this.afs.collection('user').doc(userdata.user.uid).set({
        uid: userdata.user.uid,
        email: userdata.user.email,
        hp: data.hp,
        nama: data.nama,
        kec: data.kec, kab: data.kab, prov: data.prov,
        keep: 0, cancel: 0, success: 0, cart: 0,
      }).then(() => {
        this.setUser(userdata.user.uid);
        this.popup.showToast('Berhasil terdaftar!', 700);
      });
    } catch (error) {
      this.popup.showAlert('Registrasi Error!', error);
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      const userdata = await firebase.auth().signInWithEmailAndPassword(email, password);
      if (userdata) {
        console.log('login');
        this.popup.showToast('Berhasil masuk sebagai ' + userdata.user.email, 700);
        this.setUser(userdata.user.uid);
        this.zone.run(async () => {
          await this.router.navigate(['/tabs']);
        });
      }
    } catch (error) {
      this.popup.showAlert('Error!', error);
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      message: 'Yakin ingin <strong>Log Out</strong> akun anda?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'primary',
          handler: () => {}
        }, {
          text: 'Ya',
          handler: () => {
            firebase.auth().signOut();
            this.user = null;
            this.zone.run(async () => {
              await this.router.navigate(['/login']);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
