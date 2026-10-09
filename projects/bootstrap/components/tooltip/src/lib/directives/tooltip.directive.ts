import { Directive, HostListener, input, TemplateRef } from '@angular/core';
import { providerTooltipRenderer } from '../tooltip.builder';
import { TooltipFactory } from '../tooltip.type';
import { emptyBooleanAttribute, EmptyBooleanAttribute } from '@pmeig/ng-material-core';
import { BAbstractTooltipDirective } from './b-abstract-tooltip.directive';

@Directive({
  selector: '[tooltip]',
  providers: [
    providerTooltipRenderer
  ]
})
export class TooltipMaterial extends BAbstractTooltipDirective<TooltipFactory> {
  tooltipId = input<string>(undefined, {alias: 'tooltip-id'});
  tooltip = input<string | TemplateRef<any>>();
  hover = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute, alias: 'tooltip-hover'});

  constructor() {
    super('tooltip');
    this.effect(() => this.id.set(this.tooltipId()));
    this.effect(() => this.body.set(this.tooltip()));
    this.effect(() => this.onHover = this.hover());
  }

  @HostListener('mouseenter', ['$event'])
  protected onMouseEnter(_: MouseEvent) {
    this.show();
  }

  @HostListener('mouseleave', ['$event'])
  protected onMouseLeave(event: MouseEvent) {
    this.hide(event);
  }

  /** The keyboard gets the tooltip too (WCAG 1.4.13): shown when the element is focused, hidden when it loses the focus or on Escape. */
  @HostListener('focus')
  protected onFocus() {
    this.show();
  }

  @HostListener('blur')
  @HostListener('keydown.escape')
  protected onBlur() {
    this.hide();
  }

}
