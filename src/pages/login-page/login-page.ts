import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {User} from "./user-model";
import { NavController, LoadingController } from 'ionic-angular';
import {Subscription} from "rxjs/Subscription";
import { AlertHelper } from "../../helpers/alert-helper";
import {PeerService} from "../../services/peer-service/peer.service";
import {ControlPage} from "../control-page/control-page";
import {PasswordDirective, UsernameDirective, ValidationHinter} from "./validation-hinter";


@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage implements AfterViewInit , OnInit{

  @ViewChild(UsernameDirective) nameDirective;
  @ViewChild(PasswordDirective) passDirective;

  userModel: User;
  userForm : FormGroup;
  userFormData: any;
  vHinter: ValidationHinter;
  formSubscription: Subscription;

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
    let loader = this.loadingCtrl.create({
      content: 'Connecting ...',
      dismissOnPageChange: true
    });

    loader.present();

    this.peerService.connect(this.userFormData.name, this.userFormData.password).then(

      () => this.navCtrl.push(ControlPage),

      (err) => {
        loader.dismiss();
        this.alertHelper.showSimpleAlert('Connection problem', err)
      }
    );

  }


  ionViewWillUnload() {
    if(this.formSubscription) this.formSubscription.unsubscribe();
  }

}


