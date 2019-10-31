import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController, Platform, LoadingController, ActionSheetController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, PictureSourceType, CameraOptions } from '@ionic-native/Camera/ngx';
import { PopupService } from 'src/app/services/popup.service';
import { finalize } from 'rxjs/operators';

const STORAGE_KEY = 'NabiilahBeauty';

@Component({
  selector: 'app-upload-bukti',
  templateUrl: './upload-bukti.page.html',
  styleUrls: ['./upload-bukti.page.scss'],
})
export class UploadBuktiPage implements OnInit {

  data;
  rekBank; task; onload = true;
  bankPilihan;

  images = [];

  constructor(
    private modal: ModalController,
    private afs: AngularFirestore, private popup: PopupService,
    private camera: Camera, private file: File, private http: HttpClient, private webview: WebView,
    private storage: Storage, private platform: Platform, private loading: LoadingController,
    private ref: ChangeDetectorRef, private filePath: FilePath, private actionSheetController: ActionSheetController,
  ) {
    this.task = this.afs.collection('config').doc('rekening').valueChanges().subscribe(res =>  {
      // tslint:disable-next-line: no-string-literal
      this.rekBank = res['bank'];
      this.onload = false;
    });
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.loadStoredImages();
    });
  }
  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        const arr = JSON.parse(images);
        this.images = [];
        for (const img of arr) {
          const filePath = this.file.dataDirectory + img;
          const resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath });
        }
      }
    });
  }
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      const converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      header: 'Pilih Sumber Gambar',
      buttons:
        [{
          text: 'Ambil Gambar dengan Foto',
          icon: 'camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Upload dari Gallery',
          icon: 'image',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }]
    });
    await actionSheet.present();
  }
  takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(imagePath => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });
  }
  createFileName() {
    const d = new Date(), n = d.getTime(), newFileName = n + '.jpg';
    return newFileName;
  }
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
        this.updateStoredImages(newFileName);
    }, error => {
        this.popup.showAlert('Error Save', 'Error while storing file.');
    });
  }
  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      const arr = JSON.parse(images);
      if (!arr) {
        const newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }
      const filePath = this.file.dataDirectory + name;
      const resPath = this.pathForImage(filePath);
      const newEntry = {
        name,
        path: resPath,
        filePath
      };
      this.images = [newEntry, ...this.images];
      this.ref.detectChanges(); // trigger change detection cycle
    });
  }
  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);
    this.storage.get(STORAGE_KEY).then(images => {
      const arr = JSON.parse(images);
      const filtered = arr.filter(name => name !== imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));
      const correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);
      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        this.popup.showToast('File Dihapus', 700);
      });
    });
  }
  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => { (entry as FileEntry).file(file => this.readFile(file)); })
      .catch(err => { this.popup.showToast('Error while reading file.', 1000); });
  }
  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], { type: file.type });
      formData.append('file', imgBlob, file.name);
      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }
  async uploadImageData(formData: FormData) {
    const loading = await this.loading.create({
      message: 'Uploading image...',
    });
    await loading.present();
    this.http.post('http://localhost:8888/upload.php', formData)
      .pipe( finalize(() => { loading.dismiss(); }) )
      .subscribe(res => {
        // tslint:disable-next-line: no-string-literal
        if (res['success']) { this.popup.showToast('File upload complete.', 700);
        } else { this.popup.showToast('File upload failed.', 700); }
      });
  }

  pilihBank(bank) {
    this.bankPilihan = bank;
  }

  dismiss() {
    this.modal.dismiss();
  }

}
