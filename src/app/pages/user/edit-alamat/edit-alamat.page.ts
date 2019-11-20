import { NavParams, ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EkspedisiService } from 'src/app/services/ekspedisi.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-alamat',
  templateUrl: './edit-alamat.page.html',
  styleUrls: ['./edit-alamat.page.scss'],
})
export class EditAlamatPage implements OnInit {

  @Input() data;

  prefix = false;
  editKec = false;
  expand = false;

  dataForm: FormGroup; task;
  dataKecamatan = [];
  kecPilihan;

  constructor(
    private ekspedisi: EkspedisiService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) {
    const penerima = this.navParams.get('data');
    console.log();
    if (penerima) {
      this.dataForm = this.formBuilder.group({
        nama: [penerima.nama, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        hp: [penerima.hp, Validators.required],
        alamat: [penerima.alamat, Validators.required],
        kec: [penerima.kec, Validators.required],
        kab: [penerima.kab, Validators.required],
        prov: [penerima.prov, Validators.required],
        kec_id: [penerima.kec_id, Validators.required],
        kab_id: [penerima.kab_id, Validators.required],
        prov_id: [penerima.prov_id, Validators.required],
        primary: [penerima.primary, Validators.required],
      });
    } else {
      this.editKec = true;
      this.dataForm = this.formBuilder.group({
        nama: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        hp: ['+62', Validators.minLength(12)],
        alamat: ['', Validators.required],
        kec: ['', Validators.required],
        kab: ['', Validators.required],
        prov: ['', Validators.required],
        kec_id: ['', Validators.required],
        kab_id: ['', Validators.required],
        prov_id: ['', Validators.required],
        primary: [false],
      });
    }
  }

  cari(teks: string) {
    if (teks.length > 1) {
      this.dataKecamatan = this.ekspedisi.cariKecamatan(teks).sort().slice(0, 10);
    } else { this.dataKecamatan = []; }
  }
  pilihKecamatan(data) {
    this.expand = false;
    this.dataForm.controls.kec.setValue(data.subdistrict_name);
    this.dataForm.controls.kab.setValue(data.city);
    this.dataForm.controls.prov.setValue(data.province);
    this.dataForm.controls.kec_id.setValue(data.subdistrict_id);
    this.dataForm.controls.kab_id.setValue(data.city_id);
    this.dataForm.controls.prov_id.setValue(data.province_id);
    this.kecPilihan = data;
    console.log(this.dataForm.invalid);
    console.log(this.dataForm.getRawValue());
  }
  hapusAlamat() {
    this.userService.deleteAlamat(this.data.id);
  }

  dismiss(data?) {
    if (data) {
      if (this.data) {
        this.userService.updateAlamat(this.data.id, this.dataForm.getRawValue());
      } else {
        this.userService.addAlamat(this.dataForm.getRawValue());
      }
      this.modalCtrl.dismiss();
    } else {
      this.modalCtrl.dismiss();
    }
  }

  ngOnInit() {
  }

}
