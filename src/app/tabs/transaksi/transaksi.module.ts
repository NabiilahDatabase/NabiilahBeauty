import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransaksiPage } from './transaksi.page';

import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TransaksiPage }]),
    NgPipesModule,
  ],
  declarations: [TransaksiPage]
})
export class TransaksiPageModule {}
