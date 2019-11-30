import { UserService } from './services/user.service';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'login', loadChildren: './pages/auth/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/auth/register/register.module#RegisterPageModule' },
  { path: 'verifikasi', loadChildren: './pages/auth/verifikasi/verifikasi.module#VerifikasiPageModule' },
  { path: 'item', loadChildren: './pages/item/item.module#ItemPageModule' },
  { path: 'cart', loadChildren: './pages/cart/cart.module#CartPageModule' },
  { path: 'search', loadChildren: './pages/search/search.module#SearchPageModule' },
  { path: 'ekspedisi', loadChildren: './pages/ekspedisi/ekspedisi.module#EkspedisiPageModule' },
  { path: 'edit-profile', loadChildren: './pages/user/edit-profile/edit-profile.module#EditProfilePageModule' },  { path: 'upload-bukti', loadChildren: './pages/upload-bukti/upload-bukti.module#UploadBuktiPageModule' },
  {
    path: 'pilih-alamat',
    loadChildren: () => import('./pages/user/pilih-alamat/pilih-alamat.module').then( m => m.PilihAlamatPageModule)
  },
  {
    path: 'edit-alamat',
    loadChildren: () => import('./pages/user/edit-alamat/edit-alamat.module').then( m => m.EditAlamatPageModule)
  },
  {
    path: 'feed',
    loadChildren: () => import('./tabs/feed/feed.module').then( m => m.FeedPageModule)
  },
  {
    path: 'cek-ongkir',
    loadChildren: () => import('./pages/cek-ongkir/cek-ongkir.module').then( m => m.CekOngkirPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
