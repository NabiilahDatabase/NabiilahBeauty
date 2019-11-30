import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CekOngkirPage } from './cek-ongkir.page';

const routes: Routes = [
  {
    path: '',
    component: CekOngkirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CekOngkirPageRoutingModule {}
