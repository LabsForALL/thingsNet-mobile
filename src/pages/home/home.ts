import {Component, Renderer2, AfterViewInit, ViewChild, Directive, ElementRef, OnInit, HostListener} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {User} from "./user-model";

@Directive({ selector: '[username]' })
export class UsernameDirective {

  status: any;
  isFocused: boolean;

  constructor(private el: ElementRef, private rend: Renderer2) {
    this.status = '';
    this.isFocused = false;
  }


  @HostListener('focus')
  onFocus() {
    this.isFocused = true;
    this.updateElement();
  }


  @HostListener('focusout')
  onFocusOut() {
    this.rend.setAttribute(this.el.nativeElement,'class','input-default');
    this.isFocused = false;
  }


  public setInvalid() {
    this.rend.setAttribute(this.el.nativeElement,'class','input-invalid');
  }


  public setValid() {
    this.rend.setAttribute(this.el.nativeElement,'class','input-valid');
  }


  public setStatus(status: any) {
    this.status = status;
    this.updateElement();
  }


  private updateElement() {

    if(!this.isFocused) return;

    if(this.status == 'VALID'){
      this.setValid();
    }else {
      this.setInvalid();
    }
  }

}


@Directive({ selector: '[password]' })
export class PasswordDirective {

  status: any;
  isFocused: boolean;

  constructor(private el: ElementRef, private rend: Renderer2) {
    this.status = ''
    this.isFocused = false;
  }


  @HostListener('focus')
  onFocus() {
    this.isFocused = true;
    this.updateElement();
  }


  @HostListener('focusout')
  onFocusOut() {
    this.rend.setAttribute(this.el.nativeElement,'class','input-default');
    this.isFocused = false;
  }


  public setInvalid() {
    this.rend.setAttribute(this.el.nativeElement,'class','input-invalid');
  }


  public setValid() {
    this.rend.setAttribute(this.el.nativeElement,'class','input-valid');
  }


  public setStatus(status: any) {
    this.status = status;
    this.updateElement();
  }


  private updateElement() {

    if(!this.isFocused) return;

    if(this.status == 'VALID'){
      this.setValid();
    }else {
      this.setInvalid();
    }
  }

}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit, OnInit {

  @ViewChild(UsernameDirective) nameDirective;
  @ViewChild(PasswordDirective) passDirective;

  userModel: User;
  userForm : FormGroup;


  constructor(private fb: FormBuilder){
    this.userModel = new User();
  }


  ngOnInit() {
    this.buildUserForm();
  }

  ngAfterViewInit() {
  }


  buildUserForm(): void {

    this.userForm = this.fb.group({
      'name': [this.userModel.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(24),
      ]],
      'password': [this.userModel.password,[
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(24),
      ]]
    });

    this.userForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

  }


  onValueChanged(data?: any) {

    console.log(data);
    const nameElement = this.userForm.get('name');
    const passwordElement = this.userForm.get('password');

    this.nameDirective.setStatus(nameElement.status);
    this.passDirective.setStatus(passwordElement.status);


  }

  onSubmit() {
    //TODO checkout
    //this.userForm = this.userForm.value;
    console.log("asdasipdkoas");
  }


}


