import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';

@Component({
  selector: 'app-akun',
  templateUrl: 'akun.page.html',
  styleUrls: ['akun.page.scss']
})
export class AkunPage implements OnInit {

  userInfo: User; task;

  constructor(
    public userService: UserService,
  ) {
    this.userService.getUserInfo().then(
      (userdata) => this.userInfo = userdata
    );
  }

  ngOnInit() {
  }

  logOut() {
    this.userService.logout();
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
