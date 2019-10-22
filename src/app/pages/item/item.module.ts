import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ItemPage } from './item.page';

import { NgPipesModule } from 'ngx-pipes';

const routes: Routes = [
  {
    path: '',
    component: ItemPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgPipesModule,
  ],
  declarations: [ItemPage]
})
export class ItemPageModule {}
