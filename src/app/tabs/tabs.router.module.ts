import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { UserService } from '../services/user.service';

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
              import('./transaksi/transaksi.module').then(m => m.TransaksiPageModule), canActivate: [UserService]
          }
        ]
      },
      {
        path: 'feed',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./feed/feed.module').then(m => m.FeedPageModule), canActivate: [UserService]
          }
        ]
      },
      {
        path: 'shop',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./shop/shop.module').then(m => m.ShopPageModule), canActivate: [UserService]
          }
        ]
      },
      {
        path: 'ongkir',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/cek-ongkir/cek-ongkir.module').then(m => m.CekOngkirPageModule), canActivate: [UserService]
          }
        ]
      },
      {
        path: 'akun',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./akun/akun.module').then(m => m.AkunPageModule), canActivate: [UserService]
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
