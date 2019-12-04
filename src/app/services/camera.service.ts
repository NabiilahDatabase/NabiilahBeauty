import { Injectable } from '@angular/core';
import { Camera, PictureSourceType, CameraOptions } from '@ionic-native/Camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(
    private camera: Camera,
    private crop: Crop,
    public platform: Platform,
  ) { }

  async takePicture(sourceType?: PictureSourceType): Promise<any> {
    try {
      const options: CameraOptions = {
        quality: 100,
        targetWidth: 900,
        targetHeight: 600,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.FILE_URI,
      };
      const imageUri = await this.camera.getPicture(options);
      return imageUri;
      // this.imgbase64 = 'data:image/jpeg;base64,' + imageUri;
      // this.webview.convertFileSrc(imageUri);
    } catch (err) {
      throw err;
    }
  }

  async getMediaAndCrop() {
    const options: CameraOptions = {
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: this.camera.MediaType.ALLMEDIA,
      destinationType: this.camera.DestinationType.FILE_URI
    };
    let fileUri = await this.camera.getPicture(options);
    fileUri = 'file://' + fileUri;
    const path = await this.crop.crop(fileUri, { quality: 100, targetWidth: -1, targetHeight: -1 });
    console.log('Cropped Image Path!: ' + path);
    return path;
  }
}
