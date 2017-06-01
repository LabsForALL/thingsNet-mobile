import {Directive, ElementRef, HostListener, Renderer2} from "@angular/core";
import {FormGroup} from "@angular/forms";

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
