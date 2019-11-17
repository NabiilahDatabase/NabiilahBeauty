import { ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PopupService } from './../../../services/popup.service';
import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase';
import { ToolService } from 'src/app/services/tool.service';
import { VerifikasiPage } from 'src/app/pages/auth/verifikasi/verifikasi.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  onlogin = false;
  
  public recaptchaVerifier: firebase.auth.ApplicationVerifier;

  constructor(
    private userService: UserService,
    private modal: ModalController,
    private formBuilder: FormBuilder,
    private popup: PopupService,
    private router: Router,
    private tool: ToolService,
    private loading: LoadingController,
    private afs: AngularFirestore,
  ) {
    firebase.auth().languageCode = 'id';
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.tool.saveRoute('/tabs');
      } else {
        console.log('belum login');
      }
    });
    this.loginForm = this.formBuilder.group({
      hp: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  newCaptcha() {
    return new firebase.auth.RecaptchaVerifier('recaptcha', {
      size: 'invisible',
      callback: response => {
        console.log(response);
      }
    });
  }
  async login() {
    this.onlogin = true;
    const loading = await this.loading.create({
      mode: 'ios',
      spinner: 'dots',
      message: 'Tunggu...',
      translucent: true,
    });
    await loading.present();
    
    const numb = await this.afs.collection('user').doc('+' + this.loginForm.controls.hp.value).ref.get();
    if (numb.exists) {
      this.recaptchaVerifier = this.newCaptcha();
      firebase.auth().signInWithPhoneNumber('+' + this.loginForm.controls.hp.value, this.recaptchaVerifier)
        .then(
          async confirmationResult => {
            this.onlogin = false;
            const modal = await this.modal.create({
              component: VerifikasiPage,
              componentProps: { form: this.loginForm, confirmationResult, register: false }
            });
            loading.dismiss();
            await modal.present();
          },
          error => {
            this.recaptchaVerifier = this.newCaptcha();
            this.onlogin = false;
            loading.dismiss();
            console.log(error);
            let message = '';
            switch (error.code) {
              case 'auth/captcha-check-failed': { message = 'Captcha tidak valid'; break; }
            }
            this.popup.showAlert('Error!', 'Nomor yang anda masukkan tidak valid!, mohon masukkan nomor yg benar');
            this.tool.saveRoute('/login');
          }
        );
    } else {
      this.recaptchaVerifier = this.newCaptcha();
      this.onlogin = false;
      loading.dismiss();
      this.popup.showAlert('Nomor Error', 'Nomor belum terdaftar, registrasi dulu ya kak');
    }
  }

  register() {
    this.router.navigate(['/register']);
  }

}
