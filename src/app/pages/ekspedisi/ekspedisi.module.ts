import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EkspedisiPage } from './ekspedisi.page';

import { NgOrderByPipeModule } from 'angular-pipes';

const routes: Routes = [
  {
    path: '',
    component: EkspedisiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgOrderByPipeModule,
  ],
  declarations: [EkspedisiPage]
})
export class EkspedisiPageModule {}
