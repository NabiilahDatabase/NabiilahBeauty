import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PilihAlamatPage } from './pilih-alamat.page';

const routes: Routes = [
  {
    path: '',
    component: PilihAlamatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PilihAlamatPageRoutingModule {}
