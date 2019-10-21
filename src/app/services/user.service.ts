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
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: firebase.User;

  constructor(
    private afs: AngularFirestore,
    private popup: PopupService,
    private zone: NgZone,
    private router: Router,
    private alertController: AlertController,
  ) {
  }

  getUserInfo() {
    return this.afs.collection('user').doc<User>(this.user.uid).valueChanges();
  }

  async registerUser(data: User) {
    try {
      const userdata = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
      await this.afs.collection('user').doc(userdata.user.uid).set({
        uid: userdata.user.uid,
        email: userdata.user.email,
        hp: data.hp,
        nama: data.nama,
        kec: data.kec, kab: data.kab, prov: data.prov,
        keep: 0, cancel: 0, success: 0,
      });
      this.setUser(userdata.user);
      this.popup.showToast('Berhasil terdaftar!', 700);
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
            this.zone.run(async () => {
              await this.router.navigate(['/login']);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  setUser(user: firebase.User) {
    this.user = user;
  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
              resolve(true); // user sudah login
              this.setUser(user);
            } else {
              resolve(false); // user belum login
              this.zone.run(async () => {
                await this.router.navigate(['/login']);
              });
            }
        });
    });
  }

}
