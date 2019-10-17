import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-akun',
  templateUrl: 'akun.page.html',
  styleUrls: ['akun.page.scss']
})
export class AkunPage {

  constructor(
    private userService: UserService,
    private modal: ModalController,
    // private iab: InAppBrowser,
    ) {
  }

  daftar() {
    // const browser = this.iab.create(`https://nabiilah-member.web.app/pendaftaran/${this.admin.uid}`, '_system');
    // browser.show();
  }

  logOut() {
    // this.userService.logout();
  }

}
