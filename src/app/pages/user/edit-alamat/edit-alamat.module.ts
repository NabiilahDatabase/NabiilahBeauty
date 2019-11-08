import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAlamatPageRoutingModule } from './edit-alamat-routing.module';

import { EditAlamatPage } from './edit-alamat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAlamatPageRoutingModule
  ],
  declarations: [EditAlamatPage]
})
export class EditAlamatPageModule {}
