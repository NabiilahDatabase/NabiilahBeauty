import { PopupService } from './../../../services/popup.service';
import { ToolService } from './../../../services/tool.service';
import { UserService } from 'src/app/services/user.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-verifikasi',
  templateUrl: './verifikasi.page.html',
  styleUrls: ['./verifikasi.page.scss'],
})
export class VerifikasiPage {

  kode;
  @Input() registerForm: FormGroup;
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
      spinner: 'lines',
      message: 'Verifikasi...',
      translucent: true,
    });
    await loading.present();
    console.log(this.registerForm.value);
    this.confirmationResult.confirm(code).then(
      (success) => {
        this.userService.registerUser({
          uid: null,
          nama: this.registerForm.controls.nama.value.toString().toUpperCase().trim(),
          email: this.registerForm.controls.email.value,
          hp: this.registerForm.controls.hp.value,
          password: this.registerForm.controls.password.value,
          alamat: this.registerForm.controls.alamat.value,
          kec: this.registerForm.controls.kec.value.toString(),
          kab: this.registerForm.controls.kab.value.toString(),
          prov: this.registerForm.controls.prov.value.toString(),
          keep: 0, cancel: 0, success: 0, cart: 0,
          kec_id: this.registerForm.controls.kec_id.value,
          kab_id: this.registerForm.controls.kab_id.value,
          prov_id: this.registerForm.controls.prov_id.value,
          joinDate: this.tool.getUnixTime()
        }).then(() => {
          loading.dismiss();
          this.modal.dismiss();
          this.tool.saveRoute('/tabs');
          }
        );
      },
      (error) => {
        loading.dismiss();
        this.popup.showAlert('Kode Salah!', 'Harap masukkan kode verifikasi sesuai dengan yg diterima melalui SMS');
      }
    );
  }

  dismiss() {
    this.modal.dismiss();
  }

}
