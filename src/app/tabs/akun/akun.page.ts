import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { EditProfilePage } from 'src/app/pages/user/edit-profile/edit-profile.page';

@Component({
  selector: 'app-akun',
  templateUrl: 'akun.page.html',
  styleUrls: ['akun.page.scss']
})
export class AkunPage implements OnInit {

  userInfo: User; task;

  constructor(
    public userService: UserService,
    private modal: ModalController,
  ) {
    this.userService.getUserInfo().then(
      (userdata) => this.userInfo = userdata
    );
  }

  ngOnInit() {
  }

  async editProfil() {
    const modal = await this.modal.create({
      component: EditProfilePage,
      componentProps: {
        userInfo: this.userInfo
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
