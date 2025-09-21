import { BCarouselDirective } from './directives/b-carousel.directive';
import { NgModule } from '@angular/core';
import { BCarouselItemTemplate } from './directives/b-carousel-item.template';
import { BCarouselLoopOptionsDirective } from './directives/options/b-carousel-loop.options.directive';
import { BCarouselAutoOptionsDirective } from './directives/options/b-carousel-auto.options.directive';

const CAROUSEL_EXPORTS = [BCarouselDirective, BCarouselItemTemplate, BCarouselLoopOptionsDirective, BCarouselAutoOptionsDirective];

@NgModule({
  imports: CAROUSEL_EXPORTS,
  exports: CAROUSEL_EXPORTS,
})
export class CarouselMaterial {
}
