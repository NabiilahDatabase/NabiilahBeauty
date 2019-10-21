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
      message: 'Verifikasi...',
      translucent: true,
    });
    await loading.present();
    this.confirmationResult.confirm(code).then(
      (success) => {
        this.userService.registerUser({
          nama: this.registerForm.controls.nama.value.toString().toLowerCase(),
          email: this.registerForm.controls.email.value,
          hp: this.registerForm.controls.hp.value,
          password: this.registerForm.controls.password.value,
          kec: this.registerForm.controls.kec.value.toString(),
          kab: this.registerForm.controls.kab.value.toString(),
          prov: this.registerForm.controls.prov.value.toString(),
          keep: 0, cancel: 0, success: 0,
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

}
