import {
  Component, Renderer2, AfterViewInit, ViewChild, Directive, ElementRef, OnInit, HostListener,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {User} from "./user-model";
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import {Subscription} from "rxjs/Subscription";
import {Network} from "@ionic-native/network";
import { AlertHelper } from "../../helpers/alert-helper";
import {PeerService} from "../../services/peer-service/peer.service";
import {ControlPage} from "../control-page/control-page";

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
@Directive({ selector: '[username]' })
export class UsernameDirective{

  isFocused: boolean;

  constructor(private el: ElementRef, private rend: Renderer2) {
    this.isFocused = false;
  }


  @HostListener('focus')
  onFocus() {
    this.isFocused = true;
  }


  @HostListener('focusout')
  onFocusOut() {
    this.isFocused = false;
  }


  public showInvalid() {
    this.rend.setAttribute(this.el.nativeElement,'class','input-invalid');
  }


  public showValid() {
    this.rend.setAttribute(this.el.nativeElement,'class','input-valid');
  }

}


@Directive({ selector: '[password]' })
export class PasswordDirective {

  isFocused: boolean;

  constructor(private el: ElementRef, private rend: Renderer2) {
    this.isFocused = false;
  }


  @HostListener('focus')
  onFocus() {
    this.isFocused = true;

  }


  @HostListener('focusout')
  onFocusOut() {
    this.isFocused = false;
  }


  public showInvalid() {
    this.rend.setAttribute(this.el.nativeElement,'class','input-invalid');
  }


  public showValid() {
    this.rend.setAttribute(this.el.nativeElement,'class','input-valid');
  }

}


export class ValidationHinter {

  isNameValid: any;
  isPassValid: any;

  constructor(private dName: UsernameDirective,private dPass: PasswordDirective) { }

  updateStatus(form: FormGroup) {

    if(form.get('name').status == 'VALID') this.isNameValid = true;
    else this.isNameValid = false;

    if(form.get('password').status == 'VALID') this.isPassValid = true;
    else this.isPassValid = false;


    if(this.dName.isFocused){
      if(this.isNameValid){
        this.dName.showValid();
      }else {
        this.dName.showInvalid();
      }
    }

    if(this.dPass.isFocused){
      if(this.isPassValid){
        this.dPass.showValid();
      }else {
        this.dPass.showInvalid();
      }
    }

  }

}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit , OnInit{

  @ViewChild(UsernameDirective) nameDirective;
  @ViewChild(PasswordDirective) passDirective;

  userModel: User;
  userForm : FormGroup;
  userFormData: any;
  vHinter: ValidationHinter;
  formSubscription: Subscription;

  constructor(private fb: FormBuilder,
              public navCtrl: NavController,
              public navParams: NavParams,
              public network: Network,
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

    this.formSubscription = this.userForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    console.log('home page init');
  }


  ngAfterViewInit() {

    this.vHinter = new ValidationHinter(this.nameDirective, this.passDirective);
    console.log('home page after view init');

  }


  onValueChanged(data?: any) {
    this.userFormData = data;
    this.vHinter.updateStatus(this.userForm);
  }


  onSubmit() {

    if(!this.vHinter.isPassValid || !this.vHinter.isNameValid){
      console.log("input is invalid !!!");
      return;
    }

    if(this.network.type == "none"){
      this.alertHelper.showSimpleAlert('Network connection','Please connect to internet first');
      return;
    }

    // blocking UI
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
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


