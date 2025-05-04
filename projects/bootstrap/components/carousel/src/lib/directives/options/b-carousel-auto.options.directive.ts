import { Directive, input } from '@angular/core';
import { SlideDirection } from '../../animation.helper';

@Directive({
  selector: 'carousel[auto]'
})
export class BCarouselAutoOptionsDirective {

  direction = input<SlideDirection>('next')

  constructor() { }

}
