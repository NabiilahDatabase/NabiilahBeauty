import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CekOngkirPageRoutingModule } from './cek-ongkir-routing.module';

import { CekOngkirPage } from './cek-ongkir.page';

import { MaterialModule } from 'src/app/modules/material.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgOrderByPipeModule } from 'angular-pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CekOngkirPageRoutingModule,
    MaterialModule,
    AccordionModule.forRoot(),
    NgOrderByPipeModule,
  ],
  declarations: [CekOngkirPage]
})
export class CekOngkirPageModule {}
