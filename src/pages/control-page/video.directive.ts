import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[appVideo]'
})
export class VideoDirective {

  videoElement: ElementRef;
  render: Renderer2;

  constructor(el: ElementRef, render: Renderer2) {
    this.videoElement = el;
    this.render = render;
  }

  public setVideoStream(stream) {
    const url = window.URL.createObjectURL(stream);
    console.log(stream);
    console.log(url);
    console.log(this.videoElement.nativeElement);
    console.log(this.videoElement);
    this.render.setProperty(this.videoElement.nativeElement,'src',url);
    this.videoElement.nativeElement.play();
  }

}
