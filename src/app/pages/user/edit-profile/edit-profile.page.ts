import { ModalController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  nama: string;
  email: string; hp: number; prefix = false;
  password: string;
  expand = false;
  kec: string; kab: string; prov: string;

  onreg = false;

  dataKecamatan = [];
  kecPilihan;

  userInfo: User;
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modal: ModalController,
    public tool: ToolService,
  ) {
    this.registerForm = formBuilder.group({
      nama: [this.userInfo.nama, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')])],
      email: [this.userInfo.email, Validators.compose([Validators.maxLength(30), Validators.email])],
      hp: [this.userInfo.hp],
      password: ['', Validators.minLength(6)],
      upassword: ['', Validators.minLength(6)],
      alamat: [''],
      kec: [this.userInfo.kec],
      kab: [this.userInfo.kab],
      prov: [this.userInfo.prov],
      kec_id: [this.userInfo.kec_id],
      kab_id: [this.userInfo.kab_id],
      prov_id: [this.userInfo.prov_id],
    });
  }

  ngOnInit() {
  }

  cari(input: string) {
  }
  pilihKecamatan(data) {}
  update() {}

  dismiss() {
    this.modal.dismiss();
  }
}
