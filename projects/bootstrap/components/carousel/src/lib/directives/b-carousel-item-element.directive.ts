import { Renderer2 } from '@angular/core';
import { BCarouselItem } from '../b-carousel-item';
import { putClass } from '@pmeig/ng-material-core';

export class BCarouselItemElementDirective extends BCarouselItem {
  constructor(private readonly myRef: Element, renderer: Renderer2) {
    super(renderer);
  }

  protected createElement(): Element {
    putClass(this.myRef, this.renderer, ['carousel-item'])
    this.renderer.appendChild(this.parent, this.myRef);
    return this.myRef;
  }

  protected destroyElement(): void {
  }


}
