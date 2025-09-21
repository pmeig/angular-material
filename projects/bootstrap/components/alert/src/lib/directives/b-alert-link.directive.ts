import { AfterViewInit, Directive, ElementRef, Host, Optional, Renderer2 } from '@angular/core';
import { BAlertDirective } from './b-alert.directive';
import { putClass } from '@pmeig/ng-material-core';

@Directive({
  selector: 'a, [link]',
})
export class BAlertLinkDirective implements AfterViewInit {

  constructor(public readonly link: ElementRef<Element>,
              private readonly renderer: Renderer2,
              @Host() @Optional() private readonly alert: BAlertDirective) {
  }

  ngAfterViewInit(): void {
    if (this.alert) {
      putClass(this.link.nativeElement, this.renderer, ['alert-link']);
    }
  }
}
