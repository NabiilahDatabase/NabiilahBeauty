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

  constructor(
    private userService: UserService,
    private router: Router,
    private tool: ToolService,
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

  login() {
    this.userService.loginWithEmail(this.email, this.password);
  }

  register() {
    this.router.navigate(['/register']);
  }

}
