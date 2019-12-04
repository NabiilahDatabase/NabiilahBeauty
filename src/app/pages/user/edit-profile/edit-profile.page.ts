import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User, UserService } from 'src/app/services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PopupService } from 'src/app/services/popup.service';
import { EkspedisiService } from 'src/app/services/ekspedisi.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  image; file;
  progressPercent;
  @ViewChild('fileButton', {static: false }) fileButton;

  nama: string;
  email: string; hp: number; prefix = false;
  password: string;
  expand = false;
  kec: string; kab: string; prov: string;

  onupdate = false;
  editKec = false;

  dataKecamatan = [];
  kecPilihan;

  userInfo;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modal: ModalController,
    public tool: ToolService,
    private navParam: NavParams,
    private loading: LoadingController,
    private userService: UserService,
    private afStorage: AngularFireStorage,
    private ekspedisi: EkspedisiService,
    private popup: PopupService,
  ) {
    this.userInfo = this.navParam.get('userInfo');
    this.form = formBuilder.group({
      nama: [this.userInfo.nama, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')])],
      email: [{value: this.userInfo.email, disabled: true}, Validators.compose([Validators.maxLength(30), Validators.email])],
      hp: [{value: this.userInfo.hp, disabled: true}]
    });
  }

  ngOnInit() {}

  click() { this.fileButton.nativeElement.click(); }
  onFileSelect(event) {
    const user = this.userInfo.hp;
    this.progressPercent = null;
    const mimeType = event.target.files[0].type;
    this.file = event.target.files[0];
    const reader = new FileReader();
    if (mimeType.match(/image\/*/) == null) {
      this.popup.showToast('File tidak didukung', 2000);
    } else {
      if (event.target.files.length > 0) {
        reader.readAsDataURL(this.file);
        reader.onload = () => { this.image = reader.result; };
        // this.image = event.target.files[0];
        // const filePath = `user/${user}/userpic.jpg`;
        // const fileRef = this.afStorage.ref(filePath);
        // const task = this.afStorage.upload(filePath, this.image);
        // task.percentageChanges().subscribe(progress => this.progressPercent = Math.floor(progress));
        // task.snapshotChanges().pipe(
        //   finalize(() => {
        //     fileRef.getDownloadURL().subscribe(url => {
        //       this.image.push(url);
        //       this.task = this.tService.sendPhoto(this.file, '').subscribe();
        //     });
        //     this.progressPercent = null;
        //   })
        // ).subscribe();
      } else {
        this.popup.showToast('Pilih Foto Dulu ya', 2000);
      }
    }
  }

  // cari(teks: string) {
  //   if (teks.length > 1) {
  //     this.dataKecamatan = this.ekspedisi.cariKecamatan(teks).sort().slice(0, 10);
  //   } else { this.dataKecamatan = []; }
  // }
  // pilihKecamatan(data) {
  //   this.expand = false;
  //   this.form.controls.kec.setValue(data.subdistrict_name);
  //   this.form.controls.kab.setValue(data.city);
  //   this.form.controls.prov.setValue(data.province);
  //   this.form.controls.kec_id.setValue(data.subdistrict_id);
  //   this.form.controls.kab_id.setValue(data.city_id);
  //   this.form.controls.prov_id.setValue(data.province_id);
  //   this.kecPilihan = data;
  //   console.log(this.form.value);
  //   this.editKec = false;
  // }

  async update() {
    this.onupdate = true;
    const loading = await this.loading.create({
      mode: 'ios',
      message: 'Update Profil...',
      translucent: true,
    });
    await loading.present();
    this.userService.updateUserInfo(this.form.value).then(
      () => {
        loading.dismiss();
        this.popup.showToast('Akun Berhasil diperbarui', 1000);
        this.modal.dismiss();
      },
      (error) => {
        loading.dismiss();
        this.onupdate = false;
        this.popup.showToast(error, 2000);
      }
    );
  }

  dismiss() {
    this.modal.dismiss();
  }
}
