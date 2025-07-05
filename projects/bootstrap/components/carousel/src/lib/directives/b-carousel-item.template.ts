import { Directive, Host, Optional, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { BCarouselItem } from '../b-carousel-item';
import { BCarouselDirective } from './b-carousel.directive';

@Directive({
  selector: 'ng-template',
})
export class BCarouselItemTemplate extends BCarouselItem {


  constructor(private readonly template: TemplateRef<any>,
              private readonly viewContainer: ViewContainerRef,
              renderer: Renderer2,
              @Host() @Optional() public readonly carousel?: BCarouselDirective) {
    super(renderer);
  }

  protected createElement(): Element {
    return this.viewContainer.createEmbeddedView(this.template).rootNodes[0] as Element;
  }

  protected destroyElement(): void {
    this.viewContainer.clear();
  }


}
