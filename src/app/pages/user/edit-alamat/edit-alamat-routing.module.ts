import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAlamatPage } from './edit-alamat.page';

const routes: Routes = [
  {
    path: '',
    component: EditAlamatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAlamatPageRoutingModule {}
