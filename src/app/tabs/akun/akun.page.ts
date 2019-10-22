import { Component } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';

@Component({
  selector: 'app-akun',
  templateUrl: 'akun.page.html',
  styleUrls: ['akun.page.scss']
})
export class AkunPage {

  userInfo: User; task;

  constructor(
    public userService: UserService,
  ) {
    this.userInfo = this.userService.getUserInfo();
  }

  logOut() {
    this.userService.logout();
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
