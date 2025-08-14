import { booleanAttribute, Directive, input, TemplateRef } from '@angular/core';
import { BAbstractTooltipDirective } from './b-abstract-tooltip.directive';
import { PopoverFactory } from '../tooltip.type';
import { providerTooltipRenderer } from '../tooltip.builder';
import { BooleanAttribute, emptyBooleanAttribute, EmptyBooleanAttribute, getDocument } from '@pmeig/ng-material-core';

@Directive({
  selector: '[pop-over]',
  providers: [
    providerTooltipRenderer
  ]
})
export class Popover extends BAbstractTooltipDirective<PopoverFactory>{

  title = input<string | TemplateRef<any>>(undefined, {alias: 'popover-title'});
  popover = input<string | TemplateRef<any>>(undefined, {alias: 'pop-over'});
  popoverId = input<string>(undefined, {alias: 'popover-id'});
  hover = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute, alias: 'popover-hover'});
  click = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute, alias: 'popover-click'});
  escape = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute, alias: 'popover-escape'});


  private listenerOnMouseEnter = () => {};
  private listenerOnClick = () => {};
  private listenerBodyOnClick = () => {};

  constructor() {
    super('popover');
    this.effect(() => this.factory = this.factory.title(this.title()));
    this.effect(() => this.body.set(this.popover()));
    this.effect(() => this.id.set(this.popoverId()));
    this.effect(() => {
      this.listenerOnMouseEnter();
      if (this.hover()) {
        this.listenerOnMouseEnter = this.renderer.listen(this.element, 'mouseenter', () => this.show());
      }
    });
    this.effect(() => {
      this.listenerBodyOnClick()
      if (this.escape() && this.isShown) {
        this.listenBodyClickOutside();
      }
    })
    this.effect(() => {
      this.listenerOnClick();
      if (this.click()) {
        this.listenerOnClick = this.renderer.listen(this.element, 'click', () => {
          if (this.isShown) {
            this.hide();
          } else {
            this.show();
          }
        });
      }
    });
  }


  protected override show() {
    super.show();
    if (this.escape()) {
      this.listenBodyClickOutside();
    }
  }


  protected override hide(mouseEvent?: MouseEvent) {
    super.hide(mouseEvent);
    this.listenerBodyOnClick();
    this.listenerBodyOnClick = () => {};
  }

  protected override onInit() {
    super.onInit();
    this.factory = this.factory.title(this.title());
  }

  private listenBodyClickOutside() {
    this.listenerBodyOnClick = this.renderer.listen(getDocument(this.element), 'click', (event: MouseEvent) => {
      const target = event.target as Element;
      if(this.outside(this.element, target) && this.outside(this.tooltipElement!, target)) {
        this.hide();
      }
    });
  }

  private outside(element: HTMLElement, target: Element) {
    return element !== target && !element.contains(target);
  }
}
