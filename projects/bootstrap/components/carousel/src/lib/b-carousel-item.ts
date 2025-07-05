import { Renderer2 } from '@angular/core';
import { putClass, removeClass } from '@pmeig/ng-material-core';

const ANIMATION_DIRECTION = {
  next: 'start',
  prev: 'end',
};

interface BCarouselItemCreated {
  element: Element,
  controller: BCarouselItem
}

type CarouselDirection = keyof typeof ANIMATION_DIRECTION;

export abstract class BCarouselItem {
  private isShow = false;
  private element: Element | undefined;

  parent!: Element;

  protected constructor(protected readonly renderer: Renderer2) {
  }

  get active() {
    return this.isShow;
  }

  show(direction?: CarouselDirection): BCarouselItemCreated {
    this.element = this.createElement();
    this.renderer.removeChild(this.renderer.parentNode(this.element), this.element);
    this.renderer.appendChild(this.parent, this.element);
    this.isShow = true;
    putClass(this.element, this.renderer, ['carousel-item']);
    let classAnimation = [];
    if (direction) {
      classAnimation.push(`carousel-item-${direction}`, `carousel-item-${ANIMATION_DIRECTION[direction]}`);
    }
    putClass(this.element, this.renderer, [classAnimation[0]]);
    setTimeout(() => {
      putClass(this.element, this.renderer, classAnimation);
    });
    setTimeout(() => {
      removeClass(this.element, this.renderer, classAnimation);
      putClass(this.element, this.renderer, ['active']);
    }, 600);
    return {
      controller: this,
      element: this.element,
    };
  }

  hide(direction: CarouselDirection) {
    const animation = `carousel-item-${ANIMATION_DIRECTION[direction]}`;
    putClass(this.element, this.renderer, [animation]);
    this.isShow = false;
    setTimeout(() => {
      removeClass(this.element, this.renderer, ['active', animation]);
      this.renderer.removeChild(this.parent, this.element);
      this.destroyElement();
      this.element = undefined;
    }, 600);
  }

  protected abstract createElement(): Element

  protected abstract destroyElement(): void
}
