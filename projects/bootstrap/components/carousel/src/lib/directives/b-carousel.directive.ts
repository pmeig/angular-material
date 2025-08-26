import { booleanAttribute, ContentChildren, Directive, input, Optional, output, QueryList } from '@angular/core';
import { BTagDirective } from '@pmeig/ngb-core';
import { BCarouselItem } from '../b-carousel-item';
import { BCarouselItemTemplate } from './b-carousel-item.template';
import { BCarouselItemElementDirective } from './b-carousel-item-element.directive';
import {
  BooleanAttribute,
  emptyBooleanAttribute,
  EmptyBooleanAttribute,
  SignalRecord,
  signalRecord,
  timeoutAttribute,
  TimeoutAttribute
} from '@pmeig/ng-material-core';
import { findDirection, SlideDirection } from '../animation.helper';
import { NavigatorService } from '../services/navigator.service';
import { IndicatorService } from '../services/indicator.service';
import { BCarouselLoopOptionsDirective } from './options/b-carousel-loop.options.directive';
import { Timeout } from '@pmeig/ng-core';
import { BCarouselAutoOptionsDirective } from './options/b-carousel-auto.options.directive';


@Directive({
  selector: 'carousel',
  providers: [NavigatorService, IndicatorService],
  standalone: true,
})
export class BCarouselDirective extends BTagDirective {
  id = input<string>('');
  fade = input<boolean, BooleanAttribute>(false, { transform: booleanAttribute });
  loop = input<boolean, BooleanAttribute>(true, { transform: booleanAttribute });
  index = input<number>(0);
  indexChange = output<number>();

  auto = input<Timeout, TimeoutAttribute>(undefined, { transform: timeoutAttribute });
  readonly prev = input<boolean, BooleanAttribute>(true, { transform: booleanAttribute });
  readonly next = input<boolean, BooleanAttribute>(true, { transform: booleanAttribute });
  readonly indicators = input<boolean, EmptyBooleanAttribute>(false, { transform: emptyBooleanAttribute });

  private autoId?: string;

  @ContentChildren(BCarouselItemTemplate) protected templates!: QueryList<BCarouselItemTemplate> | BCarouselItemTemplate[];

  private navigator = signalRecord({
    next: {
      origin: 'default',
      value: true,
    },
    prev: {
      origin: 'default',
      value: true,
    },
    indicators: {
      origin: 'default',
      value: false,
    },
  });
  private innerCarousel: HTMLDivElement = this.createInnerCarousel();
  private currentSlide?: {
    controller: BCarouselItem,
    index: number
    element: Element
    indicator: HTMLButtonElement
  };
  private items: BCarouselItem[] = [];
  private buttons: {
    next: HTMLButtonElement,
    prev: HTMLButtonElement,
    indicators: HTMLDivElement
  };
  private restoreButtons = () => {
  };
  private instantiate = false;

  constructor(navigatorService: NavigatorService,
              private readonly indicatorService: IndicatorService,
              @Optional() private readonly autoOptions?: BCarouselAutoOptionsDirective,
              @Optional() private readonly loopOptions?: BCarouselLoopOptionsDirective) {
    super();

    this.buttons = {
      next: navigatorService.createButton('next', this.id(), _ => this.showItem(this.currentIndex + 1)),
      prev: navigatorService.createButton('prev', this.id(), _ => this.showItem(this.currentIndex - 1)),
      indicators: this.indicatorService.createIndicators(),
    };

    this.effect(this.restorePrev);
    this.effect(this.restoreNext);
    this.effect(this.restoreIndicator);
    this.effect(this.restoreWhenLoopChange);
    this.effect(this.applyAutoSlide);
    this.effect(this.fadeAnimation);
    this.effect(() => this.insertNavigator(this.navigator.prev, this.prev()));
    this.effect(() => this.insertNavigator(this.navigator.next, this.next()));
    this.effect(() => this.insertNavigator(this.navigator.indicators, this.indicators()));
  }


  protected override onInit() {
    super.onInit();
    this.putClass('carousel', 'slide');
  }

  protected override afterViewInit() {
    super.afterViewInit();

    this.templates = this.templates.filter(template => template.carousel === this);
    const removeThem: Element[] = [];
    this.element.childNodes.forEach(child => {
      let item!: BCarouselItem;
      if (child instanceof Element) {
        item = new BCarouselItemElementDirective(child as Element, this.renderer);
        removeThem.push(child);
      } else {
        item = (this.templates as BCarouselItemTemplate[]).shift()!;
      }
      item.parent = this.innerCarousel;
      this.items.push(item);
    });
    removeThem.forEach(item => this.renderer.removeChild(this.element, item));
    this.indicatorService.fillIndicators(this.id(), this.buttons.indicators, this.items, index => this.showItem(index!));
    this.renderer.appendChild(this.element, this.buttons.indicators);
    this.renderer.appendChild(this.element, this.innerCarousel);
    this.renderer.appendChild(this.element, this.buttons.prev);
    this.renderer.appendChild(this.element, this.buttons.next);
    this.instantiate = true;
    this.restoreNext();
    this.restorePrev();
    this.restoreIndicator();
    if (this.index() >= 0 && this.index() < this.items.length) {
      this.showItem(this.index());
    }
  }

  private showItem(index: number, moveDirection?: SlideDirection) {
    if (this.currentSlide) {
      const direction = moveDirection ?? findDirection(this.loop() && !!this.loopOptions?.shortcut(), this.currentIndex, index, this.items.length);
      if (direction) {
        if (this.loop()) {
          const indexMax = this.items.length - 1;
          if (index < 0) {
            index = indexMax;
          } else if (index > indexMax) {
            index = 0;
          }
        }
        const oldSlide = this.currentSlide.controller;
        const oldIndicator = this.currentSlide.indicator;
        this.currentSlide = {
          ...this.items[index]!.show(direction),
          indicator: this.buttons.indicators.children.item(index)! as HTMLButtonElement,
          index,
        };
        oldSlide.hide(direction);
        this.indicatorService.switchIndicator(oldIndicator, this.currentSlide.indicator);
      }
    } else {
      this.currentSlide = {
        ...this.items[index]!.show(),
        indicator: this.buttons.indicators.children.item(index)! as HTMLButtonElement,
        index,
      };
      this.indicatorService.activeIndicator(this.currentSlide.indicator);
    }
    this.removeButtonWhenNoLoop(index);
  }

  private get currentIndex() {
    return this.currentSlide!.index;
  }

  private restorePrev() {
    this.restoreElement(this.navigator.prev.value(), this.buttons.prev, this.buttons.next);
  }

  private restoreNext() {
    this.restoreElement(this.navigator.next.value(), this.buttons.next);
  }

  private restoreElement(restore: boolean, element: Element, nextSibling?: Element | null) {
    if (this.instantiate) {
      const isPresent = this.element.contains(element);
      if (restore) {
        if (!isPresent) {
          try {
            this.renderer.insertBefore(this.element, element, nextSibling);
          } catch (error) {
            this.renderer.appendChild(this.element, element);
          }
        }
      } else if (isPresent) {
        this.renderer.removeChild(this.element, element);
      }
    }

  }

  private removeButtonWhenNoLoop(index: number) {
    const buttonConfig = this.findButtonToRemove(index);
    this.restoreButtons();
    if (buttonConfig) {
      const parent = this.renderer.parentNode(buttonConfig.button);
      this.renderer.removeChild(parent, buttonConfig.button);
      this.restoreButtons = () => {
        this.renderer.insertBefore(parent, buttonConfig.button, buttonConfig.nextSibling);
        this.restoreButtons = () => {
        };
      };
    }
  }

  private findButtonToRemove(index: number) {
    if (!this.loop()) {
      if (0 === index) {
        return { button: this.buttons.prev, nextSibling: this.buttons.next };
      }
      if (this.items.length - 1 === index) {
        return { button: this.buttons.next, nextSibling: null };
      }
    }
    return null;
  }

  private restoreIndicator() {
    this.restoreElement(this.navigator.indicators.value(), this.buttons.indicators, this.element.firstElementChild);
  }


  private createInnerCarousel() {
    const div = this.renderer.createElement('div') as HTMLDivElement;
    this.putClass(div, 'carousel-inner');
    return div;
  }

  private fadeAnimation() {
    let action = this.removeClass;
    if (this.fade()) {
      action = this.putClass;
    }
    action.bind(this)('carousel-fade');
  }

  private insertNavigator(item: SignalRecord<{ origin: string; value: boolean }>, value: BooleanAttribute) {
    item.value.set(booleanAttribute(value));
    item.origin.set('input');
  }

  private applyAutoSlide() {
    const timeout = this.auto();
    if (timeout) {
      if (!this.autoId) {
        this.removeNavigator();
        this.autoId = this.addInterval(() => {
          const direction = this.autoOptions?.direction()!;
          this.showItem(this.currentIndex + (direction === 'next' ? 1 : -1), direction);
        }, timeout).id;
      }
    } else {
      this.restoreNavigator();
      this.clearInterval(this.autoId);
      this.autoId = undefined;
    }
  }

  private removeNavigator(navigator?: SignalRecord<{ origin: string; value: boolean }>) {
    if (!navigator) {
      [this.navigator.prev, this.navigator.next, this.navigator.indicators].forEach(item => this.removeNavigator(item));
    } else if (navigator.origin() === 'default') {
      navigator.value.set(false);
    }
  }

  private restoreNavigator(key?: keyof typeof this.navigator, navigator?: SignalRecord<{
    origin: string;
    value: boolean
  }>) {
    if (!navigator) {
      Object.entries(this.navigator).forEach(([key, value]) => this.restoreNavigator(key as keyof typeof this.navigator, value));
    } else if (navigator.origin() === 'default') {
      navigator.value.set(['prev', 'next'].includes(key!));
    }
  }

  private restoreWhenLoopChange() {
    this.loop();
    if (this.instantiate) {
      this.removeButtonWhenNoLoop(this.currentIndex);
    }
  }
}
