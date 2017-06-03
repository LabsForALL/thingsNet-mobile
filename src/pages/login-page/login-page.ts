import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {User} from "./user-model";
import { NavController, LoadingController } from 'ionic-angular';
import {Subscription} from "rxjs/Subscription";
import { AlertHelper } from "../../helpers/alert-helper";
import {PeerService} from "../../services/peer-service/peer.service";
import {ControlPage} from "../control-page/control-page";
import {PasswordDirective, UsernameDirective, ValidationHinter} from "./validation-hinter";
import {IPeerServiceListener} from "../../services/peer-service/peer-service.interfaces";


@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage implements AfterViewInit , OnInit, IPeerServiceListener{

  @ViewChild(UsernameDirective) nameDirective;
  @ViewChild(PasswordDirective) passDirective;

  userModel: User;
  userForm : FormGroup;
  userFormData: any;
  vHinter: ValidationHinter;
  formSubscription: Subscription;
  loader: any;

  constructor(private fb: FormBuilder,
              public navCtrl: NavController,
              public alertHelper: AlertHelper,
              public loadingCtrl: LoadingController,
              public peerService: PeerService) { }


  ngOnInit() {

    this.userModel = new User();

    this.userForm = this.fb.group({
      'name': [this.userModel.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(24),
      ]],
      'password': [this.userModel.password,[
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(28),
      ]]
    });

    this.formSubscription = this.userForm.valueChanges.subscribe(data => {
        this.userFormData = data;
        this.vHinter.updateStatus(this.userForm);
      });

    console.log('login-page page init');
  }


  ngAfterViewInit() {
    this.vHinter = new ValidationHinter(this.nameDirective, this.passDirective);
    console.log('login-page page after view init');
  }


  onSubmit() {

    if(!this.vHinter.isPassValid || !this.vHinter.isNameValid){
      console.log("input is invalid !!!");
      return;
    }

    // blocking UI
    this.loader = this.loadingCtrl.create({
      content: 'Connecting ...',
      dismissOnPageChange: true
    });

    this.loader.present();
    this.peerService.tryToConnect(this.userFormData.name, this.userFormData.password);
    this.peerService.setServiceListener(this);
  }


  onPeerServiceOpen(regName: String) {
    this.navCtrl.push(ControlPage);
  }


  onPeerServiceDisconnected() {
    if(this.loader){
      this.loader.dismiss();
      this.loader = false;
    }
  }


  onPeerServiceClosed() {
    if(this.loader){
      this.loader.dismiss();
      this.loader = false;
    }
  }


  onPeerServiceError(errMsg, isFatal: boolean) {
    this.alertHelper.showSimpleAlert('Connection problem', errMsg);
    if(this.loader){
      this.loader.dismiss();
      this.loader = false;
    }
  }

  ionViewWillLeave(){
    this.peerService.removeServiceListener();
  }


  ionViewWillUnload() {
    if(this.formSubscription) this.formSubscription.unsubscribe();
  }

}


