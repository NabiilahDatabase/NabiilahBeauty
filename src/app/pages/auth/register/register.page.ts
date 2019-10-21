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
    this.registerForm = formBuilder.group({
      nama: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(30), Validators.email, Validators.required])],
      hp: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      upassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      kec: ['', Validators.required],
      kab: ['', Validators.required],
      prov: ['', Validators.required],
    });
  }

  ionViewWillEnter() {
    this.newCaptcha();
    this.registerForm.reset();
  }
  newCaptcha() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
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
      message: 'Proses registrasi...',
      translucent: true,
    });
    await loading.present();
    this.newCaptcha();
    firebase.auth().signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
      .then(async confirmationResult => {
        const modal = await this.modal.create({ component: VerifikasiPage, componentProps: {hp: this.registerForm.controls.hp.value} });
        loading.dismiss();
        await modal.present();
        const confirmationCode = await modal.onWillDismiss();
        // console.log(confirmationCode.data);
        if (confirmationCode) {
          await loading.present();
          confirmationResult.confirm(confirmationCode.data).then(
            (success) => {
              this.userService.registerUser({
                nama: this.registerForm.controls.nama.value.toString().toLowerCase(),
                email: this.registerForm.controls.email.value,
                hp: this.registerForm.controls.hp.value,
                password: this.registerForm.controls.password.value,
                kec: this.registerForm.controls.kec.value.toString(),
                kab: this.registerForm.controls.kab.value.toString(),
                prov: this.registerForm.controls.prov.value.toString(),
              }).then(() => {
                loading.dismiss();
                this.onreg = false;
                this.tool.saveRoute('/tabs');
                }
              );
            }
          ).catch(
            (error) => {
              // User couldn't sign in (bad verification code?)
              loading.dismiss();
              this.onreg = false;
              this.popup.showAlert('Salah', 'Kode verifikasi salah, coba kembali!');
              this.recaptchaVerifier.verify();
            }
          );
        }
      },
        (error) => {
          loading.dismiss();
          this.onreg = false;
          this.popup.showAlert('Error', error);
          this.tool.saveRoute('/register');
        }
    );
  }

  cari(teks: string) {
    if (teks.length > 1) {
      this.dataKecamatan = this.ekspedisi.cariKecamatan(teks).sort().slice(0, 10);
    } else { this.dataKecamatan = []; }
  }
  pilihKecamatan(data) {
    this.expand = false;
    this.registerForm.controls.kec.setValue(data.subdistrict_name);
    this.registerForm.controls.kab.setValue(data.city);
    this.registerForm.controls.prov.setValue(data.subdistrict_name);
    this.kecPilihan = data;
    // console.log(data);
  }

}
