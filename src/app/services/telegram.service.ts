import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  // Bot Account Config
  token = '911611548:AAH9-n185EQrNOKdyGDlTs8dURGYoHlgAOo'; // NabiilahBeautyBot
  method = '/sendPhoto';
  GROUP_CLOSING_ID = '@NBClosing';
  SERVER_URL = 'https://api.telegram.org/bot' + this.token + this.method;
  uploadForm: FormGroup;

  constructor(
    private httpClient: HttpClient
  ) { }

  sendPhoto(photoFile, caption?: string | null) {
    const formData = new FormData();
    formData.append('chat_id', this.GROUP_CLOSING_ID);
    formData.append('photo', photoFile);
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');
    return this.httpClient.post<any>(this.SERVER_URL, formData, {reportProgress: true, observe: 'events'});
  }
}
