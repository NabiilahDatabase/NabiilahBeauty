import { AlertController } from '@ionic/angular';
import { ToolService } from './tool.service';
import { PopupService } from './popup.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

export interface User {
  uid: string;
  email: string;
  hp: string;
  password: string;
  nama: string;
  alamat: string;
  kec: string; kab: string; prov: string;
  kec_id: number; kab_id: number; prov_id: number;
  keep: number; cancel: number; success: number;
  cart: number;
  joinDate: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: User;
  public userObservable: Observable<User>; task;

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
          this.setUser(user.phoneNumber);
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
              console.log('can active:', user);
              this.setUser(user.phoneNumber);
              if (!this.user) {
                this.task = this.afs.collection('user').doc<User>(user.phoneNumber).valueChanges().subscribe(res => {
                  this.user = res;
                  console.log('subscribe userdata can activte', res);
                });
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

  setUser(hp: string) {
    this.userObservable = this.afs.collection('user').doc<User>(hp).valueChanges();
    // console.log('setUser', this.user);
  }
  setUserData(user: User) {
    this.user = user;
  }
  getUserId() {
    console.log('getUserId: ', firebase.auth().currentUser);
    return firebase.auth().currentUser.phoneNumber;
  }
  getUserInfo() {
    console.log('getUserInfo');
    return this.userObservable;
  }
  async updateUserInfo(partialdata) {
    this.afs.collection('user').doc(this.getUserId()).update(partialdata);
  }

  getAlamat() {

  }

  async registerUser(data: User) {
    try {
      // const userdata = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
      // console.log('register as ', data.email, ' & ', data.password);
      firebase.auth().currentUser.updateEmail(data.email).then(() => console.log('updateEmail'));
      firebase.auth().currentUser.updateProfile({displayName: data.nama}).then(() => console.log('updateName'));
      // firebase.auth().currentUser.updatePassword(data.password).then(() => console.log('updatePassword'));
      this.afs.collection('user').doc(data.hp).set({
        uid: data.uid,
        email: data.email,
        hp: data.hp,
        nama: data.nama,
        alamat: data.alamat,
        kec: data.kec, kab: data.kab, prov: data.prov,
        kec_id: data.kec_id, kab_id: data.kab_id, prov_id: data.prov_id,
        keep: 0, cancel: 0, success: 0, cart: 0,
        joinDate: data.joinDate
      }).then(() => {
        this.setUser(data.hp);
        this.task = this.userObservable.subscribe(res => {
          this.user = res;
          console.log('subscribe userdata');
        });
        this.afs.collection('user').doc(data.hp).collection('alamat').doc(data.joinDate.toString()).set({
          nama: data.nama,
          hp: data.hp,
          alamat: data.alamat,
          kec: data.kec, kab: data.kab, prov: data.prov,
          kec_id: data.kec_id, kab_id: data.kab_id, prov_id: data.prov_id,
          primary: true,
        });
        this.popup.showToast('Berhasil terdaftar!', 700);
      });
    } catch (error) {
      this.popup.showAlert('Registrasi Error!', error);
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      console.log('login as ', email, ' & ', password);
      const userdata = await firebase.auth().signInWithEmailAndPassword(email, password);
      if (userdata) {
        console.log('login');
        this.popup.showToast('Berhasil masuk sebagai ' + userdata.user.email, 700);
        this.setUser(userdata.user.uid);
        this.task = this.userObservable.subscribe(res => {
          this.user = res;
          console.log('subscribe userdata');
        });
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
          cssClass: 'beauty',
          handler: () => {}
        }, {
          text: 'Ya',
          handler: () => {
            firebase.auth().signOut();
            this.user = null;
            this.userObservable = null;
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
