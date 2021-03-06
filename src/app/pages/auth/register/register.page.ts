import { PopupService } from './../../../services/popup.service';
import { EkspedisiService } from './../../../services/ekspedisi.service';
import { ToolService } from './../../../services/tool.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

import { VerifikasiPage } from 'src/app/pages/auth/verifikasi/verifikasi.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  nama: string;
  email: string; hp: number; prefix = false;
  password: string;
  expand = false;
  kec: string; kab: string; prov: string;

  registerForm: FormGroup;
  onreg = false;

  dataKecamatan = [];
  kecPilihan;

  public recaptchaVerifier: firebase.auth.ApplicationVerifier;

  constructor(
    private afs: AngularFirestore,
    private userService: UserService,
    private modal: ModalController,
    public tool: ToolService,
    private ekspedisi: EkspedisiService,
    private formBuilder: FormBuilder,
    private popup: PopupService,
    private loading: LoadingController,
  ) {
    firebase.auth().languageCode = 'id';
    this.registerForm = this.formBuilder.group({
      nama: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(30), Validators.email, Validators.required])],
      hp: ['+62', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      upassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      alamat: ['', Validators.required],
      kec: ['', Validators.required],
      kab: ['', Validators.required],
      prov: ['', Validators.required],
      kec_id: ['', Validators.required],
      kab_id: ['', Validators.required],
      prov_id: ['', Validators.required],
    });
  }

  newCaptcha() {
    return new firebase.auth.RecaptchaVerifier('recaptcha', {
      size: 'invisible',
      callback: response => {
        console.log(response);
      }
    });
  }

  async register(phoneNumber: string) {
    // setTimeout(function(){}, 3000);
    this.onreg = true;
    const loading = await this.loading.create({
      mode: 'ios',
      spinner: 'dots',
      message: 'Proses registrasi...',
      translucent: true,
    });
    await loading.present();
    // Verifikasi nomor
    const numb = await this.afs.collection('user').doc(phoneNumber).ref.get();
    console.log('register as: ', phoneNumber);
    if (!numb.exists) {
      this.recaptchaVerifier = this.newCaptcha();
      firebase.auth().signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
        .then(
          async confirmationResult => {
            this.onreg = false;
            const modal = await this.modal.create({
              component: VerifikasiPage,
              componentProps: { form: this.registerForm, confirmationResult, register: true }
            });
            loading.dismiss();
            await modal.present();
          },
          error => {
            this.recaptchaVerifier = this.newCaptcha();
            this.onreg = false;
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
      this.onreg = false;
      loading.dismiss();
      this.popup.showAlert('Nomor Error', 'Nomor yg anda masukkan sudah terdaftar di sistem kami, harap login untuk melanjutkan');
    }
  }

  cari(teks: string) {
    if (teks.length > 1) {
      this.dataKecamatan = this.ekspedisi.cariKecamatan(teks).sort().slice(0, 10);
    } else { this.dataKecamatan = []; }
  }
  pilihKecamatan(data) {
    this.expand = false;
    const alamat = this.registerForm.controls.alamat.value;
    this.registerForm.controls.kec.setValue(data.subdistrict_name);
    this.registerForm.controls.kab.setValue(data.city);
    this.registerForm.controls.prov.setValue(data.province);
    this.registerForm.controls.kec_id.setValue(data.subdistrict_id);
    this.registerForm.controls.kab_id.setValue(data.city_id);
    this.registerForm.controls.prov_id.setValue(data.province_id);
    this.kecPilihan = {...data, alamat};
    // console.log(data);
  }

}
