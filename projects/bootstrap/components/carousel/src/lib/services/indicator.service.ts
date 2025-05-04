import { Injectable, Renderer2 } from '@angular/core';
import { putAttribute, putClass, removeAttribute, removeClass } from '@pmeig/ng-material-core';
import { BCarouselItem } from '../b-carousel-item';
import { AnimationExecutor } from '../animation.helper';


const ARIA_LABEL_INDICATOR_PREFIX = 'Slide'

@Injectable()
export class IndicatorService {
  constructor(private readonly renderer: Renderer2) {
  }


  createIndicators() {
    const indicator = this.renderer.createElement('div') as HTMLDivElement;
    putClass(indicator, this.renderer, ['carousel-indicators']);
    return indicator;
  }

  fillIndicators(id: string, indicators: HTMLDivElement, items: BCarouselItem[], switchSlide: AnimationExecutor) {
    items.forEach((_, index) => {
      const button = this.createIndicator(id, index);
      this.renderer.listen(button, 'click', () => {
        switchSlide(index);
      });
      this.renderer.appendChild(indicators, button);
    });
  }

  switchIndicator(indicator: HTMLButtonElement, newIndicator: HTMLButtonElement) {
    this.activeIndicator(newIndicator)
    removeClass(indicator, this.renderer, ['active']);
    removeAttribute(indicator, this.renderer, ['aria-current']);
  }

  activeIndicator(indicator: HTMLButtonElement) {
    putClass(indicator, this.renderer, ['active']);
    putAttribute(indicator, this.renderer, 'aria-current', 'true');
  }

  private createIndicator(id: string, index: number) {
    const button = this.renderer.createElement('button') as HTMLButtonElement;
    putAttribute(button, this.renderer, 'id', `${id}-indicator-${index}`);
    putAttribute(button, this.renderer, 'aria-label', `${ARIA_LABEL_INDICATOR_PREFIX} ${index}`);
    putAttribute(button, this.renderer, 'type', 'button');
    putAttribute(button, this.renderer, 'data-bs-target', ' ')
    return button
  }
}
