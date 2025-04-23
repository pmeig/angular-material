import { AfterViewInit, Directive, ElementRef, Host, Optional, Renderer2 } from '@angular/core';
import { BAlertDirective } from './b-alert.directive';
import { putClass } from '@pmeig/ng-material-core';

@Directive({
  selector: 'h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, header',
})
export class BAlertHeaderDirective implements AfterViewInit {

  constructor(private readonly element: ElementRef<Element>,
              private readonly renderer: Renderer2,
              @Host() @Optional() private readonly host?: BAlertDirective) { }

  ngAfterViewInit(): void {
    if (this.host) {
      putClass(this.element.nativeElement, this.renderer, ['alert-heading'])
    }
  }

}
