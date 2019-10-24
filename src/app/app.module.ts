import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Pages Modules
import { VerifikasiPageModule } from 'src/app/pages/auth/verifikasi/verifikasi.module';
import { ItemPageModule } from './pages/item/item.module';
import { CartPageModule } from './pages/cart/cart.module';

// AngularFire Modules
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { FunctionsRegionToken } from '@angular/fire/functions';

// Angular Material Module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    VerifikasiPageModule,
    ItemPageModule,
    CartPageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Clipboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: StorageBucket, useValue: 'nabiilah-duit.appspot.com' },
    { provide: FunctionsRegionToken, useValue: 'us-central1' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
