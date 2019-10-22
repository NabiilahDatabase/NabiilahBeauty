import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopPage } from './shop.page';

import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ShopPage }]),
    NgPipesModule,
  ],
  declarations: [ShopPage]
})
export class ShopPageModule {}
