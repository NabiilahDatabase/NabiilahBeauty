import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ModalController, Platform, LoadingController, ActionSheetController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

import { WebView } from '@ionic-native/ionic-webview/ngx';
// import { Camera, PictureSourceType, CameraOptions } from '@ionic-native/Camera/ngx';
import { PopupService } from 'src/app/services/popup.service';
import { Invoice } from 'src/app/services/interface.service';
import { TelegramService } from 'src/app/services/telegram.service';
import { HttpEventType } from '@angular/common/http';
import { ToolService } from 'src/app/services/tool.service';

const STORAGE_KEY = 'NabiilahBeauty';

@Component({
  selector: 'app-upload-bukti',
  templateUrl: './upload-bukti.page.html',
  styleUrls: ['./upload-bukti.page.scss'],
})
export class UploadBuktiPage implements OnInit {

  data: Invoice;
  rekBank; task; onload = true;
  bankPilihan;

  @ViewChild('uploadButton', {static: false }) uploadButton;
  file; image; isUploading = false; progressPercent;

  constructor(
    private modal: ModalController,
    private afs: AngularFirestore, private popup: PopupService,
    private telegram: TelegramService, private tool: ToolService,
    private loadingCtrl: LoadingController,
    // private camera: Camera,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
  ) {
    this.task = this.afs.collection('config').doc('rekening').valueChanges().subscribe(res =>  {
      // tslint:disable-next-line: no-string-literal
      this.rekBank = res['bank'];
      this.onload = false;
    });
  }

  ngOnInit() {
  }
  selectFile() {
    this.uploadButton.nativeElement.click();
  }

  async selectImage(event) {
    const mimeType = event.target.files[0].type;
    const reader = new FileReader();
    if (mimeType.match(/image\/*/) == null) {
      this.popup.showAlert('Format Error', 'File yg anda pilih tidak didukung');
    } else {
      if (event.target.files.length > 0) {
        this.file = event.target.files[0];
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          this.image = reader.result;
          document.querySelector('ion-content').scrollToBottom(500);
        };
      } else {
      }
    }

    // const actionSheet = await this.actionSheetController.create({
    //   mode: 'ios',
    //   header: 'Pilih Sumber Gambar',
    //   buttons:
    //     [{
    //       text: 'Ambil Gambar dengan Foto',
    //       icon: 'camera',
    //       handler: () => {
    //         this.takePicture().then(pic => this.image = pic);
    //       }
    //     },
    //     {
    //       text: 'Upload dari Gallery',
    //       icon: 'image',
    //       handler: () => {
    //         this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
    //       }
    //     },
    //     {
    //       text: 'Cancel',
    //       role: 'cancel'
    //     }]
    // });
    // await actionSheet.present();
  }
  async uploadBukti() {
    const loader = await this.loadingCtrl.create({
      message: 'Sedang Mengirim...',
      spinner: 'dots'
    });
    await loader.present();
    this.isUploading = true;
    let pesanan = '';
    this.data.pesanan.forEach((item) => {
      pesanan += `${item.jumlah}x ${item.nama}\n`;
    });
    const template =
      // tslint:disable-next-line: max-line-length
      `INVOICE: *${this.data.id}*\n` +
      `TOTAL: *Rp ${this.data.total / 1000}* (${this.bankPilihan.nama})\n` +
      `NAMA: *${this.data.penerima.nama.toUpperCase()}*\n` +
      `PESANAN:\n${pesanan.trim()}`
    ;
    this.telegram.sendPhoto(this.file, template).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressPercent = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          console.log(event.body.result);
          this.afs.collection('orderan').doc(this.data.id).set({
              status: 'dibayar',
              waktuDibayar: this.tool.getUnixTime(),
              tglDibayar: this.tool.getTime('YYYYMMDD')
            }, { merge: true }).then(
             () => {
               this.popup.showToast('Berhasil upload bukti transfer', 700);
               this.modal.dismiss();
             },
             (error) => {
               this.popup.showAlert('Error Upload', error);
              }
          );
          this.isUploading = false;
          loader.dismiss();
        }
      },
      (err) => {
        this.isUploading = false;
        loader.dismiss();
        console.log(err);
        this.popup.showAlert('Error Upload', JSON.stringify(err.error));
      }
    );
  }
  // async takePicture(sourceType?: PictureSourceType) {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     targetWidth: 900,
  //     targetHeight: 600,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     saveToPhotoAlbum: false,
  //     correctOrientation: true,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     // destinationType: this.camera.DestinationType.FILE_URI,
  //   };
  //   return this.camera.getPicture(options).then(imageUri => {
  //     this.image = imageUri;
  //     this.imgbase64 = 'data:image/jpeg;base64,' + imageUri;
  //     console.log(imageUri);
  //     return this.webview.convertFileSrc(imageUri);
  //   });
  // }

  pilihBank(bank) {
    this.bankPilihan = bank;
  }

  dismiss() {
    this.modal.dismiss();
  }

}
