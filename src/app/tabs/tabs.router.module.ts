import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'transaksi',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./transaksi/transaksi.module').then(m => m.TransaksiPageModule)
          }
        ]
      },
      {
        path: 'shop',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./shop/shop.module').then(m => m.ShopPageModule)
          }
        ]
      },
      {
        path: 'akun',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./akun/akun.module').then(m => m.AkunPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/shop',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/shop',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
