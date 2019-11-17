import { PopupService } from './../../../services/popup.service';
import { ToolService } from './../../../services/tool.service';
import { UserService } from 'src/app/services/user.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-verifikasi',
  templateUrl: './verifikasi.page.html',
  styleUrls: ['./verifikasi.page.scss'],
})
export class VerifikasiPage {

  kode;
  @Input() register: boolean;
  @Input() form: FormGroup;
  @Input() confirmationResult: firebase.auth.ConfirmationResult;

  constructor(
    private modal: ModalController,
    private userService: UserService,
    private tool: ToolService,
    private loading: LoadingController,
    private popup: PopupService,
  ) { }

  async confirm(code) {
    const loading = await this.loading.create({
      mode: 'ios',
      spinner: 'dots',
      message: 'Verifikasi...',
      translucent: true,
    });
    await loading.present();
    // console.log(this.form.value);
    // const credential = firebase.auth.PhoneAuthProvider.credential(this.confirmationResult.verificationId, code);
    // firebase.auth().signInWithCredential(credential)
    this.confirmationResult.confirm(code)
    .then(
      (udata) => {
        if (this.register) {
          // console.log('User cred: ', udata);
          this.userService.registerUser({
            uid: udata.user.uid,
            nama: this.form.controls.nama.value.toString().toUpperCase().trim(),
            email: this.form.controls.email.value,
            hp: '+' + this.form.controls.hp.value,
            password: this.form.controls.password.value,
            alamat: this.form.controls.alamat.value,
            kec: this.form.controls.kec.value.toString(),
            kab: this.form.controls.kab.value.toString(),
            prov: this.form.controls.prov.value.toString(),
            keep: 0, cancel: 0, success: 0, cart: 0,
            kec_id: this.form.controls.kec_id.value,
            kab_id: this.form.controls.kab_id.value,
            prov_id: this.form.controls.prov_id.value,
            joinDate: this.tool.getUnixTime()
          }).then(() => {
            loading.dismiss();
            this.modal.dismiss();
            this.tool.saveRoute('/tabs');
            }
          );
        } else {
          this.userService.loginWithOTP('+' + this.form.controls.hp.value);
          loading.dismiss();
          this.modal.dismiss();
          this.tool.saveRoute('/tabs');
        }
    },
    (error) => {
      loading.dismiss();
      this.popup.showAlert('Kode Salah!', 'Harap masukkan kode verifikasi sesuai dengan yg diterima melalui SMS');
    });
    // this.confirmationResult.confirm(code).then();
  }

  dismiss() {
    this.modal.dismiss();
  }

}
