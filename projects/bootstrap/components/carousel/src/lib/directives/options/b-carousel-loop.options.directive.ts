import { booleanAttribute, Directive, input } from '@angular/core';
import { BooleanAttribute } from '@pmeig/ng-material-core';

@Directive({
  selector: 'carousel:not([loop=false])'
})
export class BCarouselLoopOptionsDirective {

  shortcut = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute})

  constructor() { }

}
