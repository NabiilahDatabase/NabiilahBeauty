import { Component } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-akun',
  templateUrl: 'akun.page.html',
  styleUrls: ['akun.page.scss']
})
export class AkunPage {

  userInfo: User; task;
  onload = true;

  constructor(
    private userService: UserService,
    // private iab: InAppBrowser,
  ) {
    this.task = this.userService.getUserInfo().subscribe(res => {
      this.onload = false;
      this.userInfo = res;
    });
  }

  daftar() {
    // const browser = this.iab.create(`https://nabiilah-member.web.app/pendaftaran/${this.admin.uid}`, '_system');
    // browser.show();
  }

  logOut() {
    this.userService.logout();
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
