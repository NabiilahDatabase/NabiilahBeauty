import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAlamatPageRoutingModule } from './edit-alamat-routing.module';

import { EditAlamatPage } from './edit-alamat.page';
import { MaterialModule } from 'src/app/modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAlamatPageRoutingModule,
    MaterialModule,
  ],
  declarations: [EditAlamatPage]
})
export class EditAlamatPageModule {}
