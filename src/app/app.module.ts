import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';
import { HomePage, UsernameDirective, PasswordDirective } from '../pages/home/home';
import {Network} from "@ionic-native/network";
import {AlertHelper} from "../helpers/alert-helper";
import {HttpModule} from "@angular/http";
import {ControlPage} from "../pages/control-page/control-page";
import {PeerService} from "../services/peer-service/peer.service";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    UsernameDirective,
    PasswordDirective,
    ControlPage
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
    HomePage,
    ControlPage
  ],
  providers: [
    StatusBar,
    PeerService,
    AlertHelper,
    Network,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

