import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EkspedisiService } from 'src/app/services/ekspedisi.service';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'apollo-link';
import { Alamat } from 'src/app/services/interface.service';

@Component({
  selector: 'app-edit-alamat',
  templateUrl: './edit-alamat.page.html',
  styleUrls: ['./edit-alamat.page.scss'],
})
export class EditAlamatPage implements OnInit {

  id;

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
  ) {
    this.dataForm = this.formBuilder.group({
      nama: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      hp: ['', Validators.required],
      alamat: ['', Validators.required],
      kec: ['', Validators.required],
      kab: ['', Validators.required],
      prov: ['', Validators.required],
      kec_id: ['', Validators.required],
      kab_id: ['', Validators.required],
      prov_id: ['', Validators.required],
      primary: ['', Validators.required],
    });
    if (this.id) {
      this.task = this.userService.getAlamat(this.id, true).subscribe((res: Alamat) => {
        console.log(res);
        this.dataForm.patchValue({ ...res });
        this.kecPilihan.subdistrict_name = res.kec;
        this.kecPilihan.city = res.kab;
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
    this.kecPilihan = { ...data };
    // console.log(data);
  }

  ngOnInit() {
  }

}
