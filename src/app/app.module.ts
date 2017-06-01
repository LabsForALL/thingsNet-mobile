import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';
import { LoginPage} from '../pages/login-page/login-page';
import {Network} from "@ionic-native/network";
import {AlertHelper} from "../helpers/alert-helper";
import {HttpModule} from "@angular/http";
import {ControlPage} from "../pages/control-page/control-page";
import {PeerService} from "../services/peer-service/peer.service";
import {PasswordDirective} from "../pages/login-page/validation-hinter";
import {UsernameDirective} from "../pages/login-page/validation-hinter";
import {BluetoothSearchPage} from "../pages/bluetooth-search-page/bluetooth-search-page";
import {BluetoothService} from "../services/bluetooth-service/bluetooth.service";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ControlPage,
    BluetoothSearchPage,
    UsernameDirective,
    PasswordDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ControlPage,
    BluetoothSearchPage,
  ],
  providers: [
    StatusBar,
    BluetoothSerial,
    Network,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PeerService,
    BluetoothService,
    AndroidPermissions,
    AlertHelper
  ]
})
export class AppModule {}

