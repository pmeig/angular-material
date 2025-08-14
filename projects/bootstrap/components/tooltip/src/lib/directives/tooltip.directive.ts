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
export class Tooltip extends BAbstractTooltipDirective<TooltipFactory> {
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
  private onMouseEnter(_: MouseEvent) {
    this.show();
  }

  @HostListener('mouseleave', ['$event'])
  private onMouseLeave(event: MouseEvent) {
    this.hide(event);
  }

}
