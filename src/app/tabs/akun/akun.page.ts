import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { EditProfilePage } from 'src/app/pages/user/edit-profile/edit-profile.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-akun',
  templateUrl: 'akun.page.html',
  styleUrls: ['akun.page.scss']
})
export class AkunPage implements OnInit {

  userInfo: Observable<User>;
  userData: User; task;

  constructor(
    public userService: UserService,
    private modal: ModalController,
  ) {
    this.userInfo = this.userService.getUserInfo();
    this.task = this.userInfo.subscribe(res => this.userData = res);
    console.log(this.userData);
  }

  ngOnInit() {
  }

  async editProfil() {
    const modal = await this.modal.create({
      component: EditProfilePage,
      componentProps: {
        userInfo: this.userData
      }
    });
    await modal.present();
  }

  logOut() {
    this.userService.logout();
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
