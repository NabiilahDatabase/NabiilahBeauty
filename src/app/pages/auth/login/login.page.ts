import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string; password: string;
  onlogin = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private tool: ToolService,
    private loading: LoadingController,
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.tool.saveRoute('/tabs');
      } else {
        console.log('belum login');
      }
    });
  }

  ngOnInit() {
  }

  async login() {
    this.onlogin = true;
    const loading = await this.loading.create({
      mode: 'ios',
      message: 'Tunggu...',
      translucent: true,
    });
    await loading.present();
    this.userService.loginWithEmail(this.email, this.password).then(
      () => {
        this.onlogin = false;
        loading.dismiss();
      },
      (error) => {
        this.onlogin = false;
        loading.dismiss();
      }
    );
  }

  register() {
    this.router.navigate(['/register']);
  }

}
