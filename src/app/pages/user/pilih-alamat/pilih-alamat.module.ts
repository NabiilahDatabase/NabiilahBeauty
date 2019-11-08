import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PilihAlamatPageRoutingModule } from './pilih-alamat-routing.module';

import { PilihAlamatPage } from './pilih-alamat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PilihAlamatPageRoutingModule
  ],
  declarations: [PilihAlamatPage]
})
export class PilihAlamatPageModule {}
