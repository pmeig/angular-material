import { Directive, inject, input, signal, TemplateRef } from '@angular/core';
import { BTagDirective } from '@pmeig/ngb-core';
import { PopoverFactory, TooltipFactory, TooltipPlacement, TooltipRendered, TooltipRenderer } from '../tooltip.type';
import { TooltipPlacementOtherwise } from '../tooltip.builder';
import { timeoutAttribute, TimeoutAttribute } from '@pmeig/ng-material-core';
import { Nullable, Timeout } from '@pmeig/ng-core';

const TooltipWait = Object.freeze({
  top: (target: DOMRect, mouseEvent: MouseEvent) => target.y >= mouseEvent.clientY && target.x < mouseEvent.clientX && target.x + target.width > mouseEvent.clientX,
  bottom: (target: DOMRect, mouseEvent: MouseEvent) => target.y + target.height <= mouseEvent.clientY && target.x < mouseEvent.clientX && target.x + target.width > mouseEvent.clientX,
  start: (target: DOMRect, mouseEvent: MouseEvent) => target.x >= mouseEvent.clientX && target.y < mouseEvent.clientY && target.y + target.height > mouseEvent.clientY,
  end: (target: DOMRect, mouseEvent: MouseEvent) => target.x + target.width <= mouseEvent.clientX && target.y < mouseEvent.clientY && target.y + target.height > mouseEvent.clientY,
})

@Directive({})
export abstract class BAbstractTooltipDirective<T extends TooltipFactory | PopoverFactory> extends BTagDirective<HTMLElement> {
  placement = input<TooltipPlacement>('top');
  otherwise = input<TooltipPlacement>();
  timeout = input<Nullable<Timeout>, TimeoutAttribute>(undefined, {transform: timeoutAttribute});

  protected id = signal<string | undefined>(undefined);
  protected body = signal<TemplateRef<any> | string | undefined>(undefined)
  protected onHover = false;
  protected factory: T
  protected isShown = false;

  private instance?: TooltipRendered
  private timeoutId?: string;
  private leaveTimeoutId?: string;
  private listeners = () => {};

  protected get tooltipElement() {
    return this.instance?.tooltip;
  }

  protected constructor(type: 'tooltip' | 'popover' = 'tooltip', tooltipRenderer: TooltipRenderer = inject(TooltipRenderer)) {
    super();
    this.factory = tooltipRenderer.create(type) as T;
    this.effect(() => this.factory = this.factory.otherwise(this.otherwise()) as T);
    this.effect(() => this.factory = this.factory.placement(this.placement()) as T);
    this.effect(() => this.factory = this.factory.id(this.id()) as T);
    this.effect(() => this.factory = this.factory.body(this.body()) as T);
  }

  protected override onInit() {
    super.onInit();
    this.factory = this.factory.id(this.id()).otherwise(this.otherwise())
      .placement(this.placement()).body(this.body()) as T;
  }

  protected show() {
    this.isShown = true;
    if (!this.instance) {
      this.instance = this.factory.render(this.element);
      const timeout = this.timeout();
      if (timeout) {
        this.timeoutId = this.addTimeout(() => {
          this.timeoutId = undefined;
          this.hide()
        }, timeout).id;
      }
      if (this.onHover) {
        this.listenMouseDirection();
      }
    } else if (this.onHover) {
      this.clearTimeout(this.leaveTimeoutId);
    }
  }

  protected hide(mouseEvent?: MouseEvent) {
    if (this.onHover && this.waitToHide(mouseEvent)) {
      this.leaveTimeoutId = this.addTimeout(() => {
        this.leaveTimeoutId = undefined;
        this.onHover = false;
        this.hide(mouseEvent);
        this.onHover = true;
      }, 500).id;
    } else {
      this.instance?.destroy();
      this.instance = undefined;
      this.clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
      this.listeners();
      this.listeners = () => {};
      this.isShown = false;
    }
  }

  private waitToHide(mouseEvent: MouseEvent | undefined, placement: TooltipPlacement = this.instance?.currentPlacement ?? 'top', config: DOMRect = this.element.getBoundingClientRect()) {
    if (!mouseEvent) return false;
    return TooltipWait[placement](config, mouseEvent);
  }

  private listenMouseDirection() {
    const onEnter = this.renderer.listen(this.instance!.tooltip, 'mouseenter', () => {
      this.clearTimeout(this.leaveTimeoutId);
    });
    const onLeave = this.renderer.listen(this.instance!.tooltip, 'mouseleave', event => {
      const check = this.waitToHide(event, TooltipPlacementOtherwise[this.instance!.currentPlacement ?? 'top'], this.instance!.tooltip.getBoundingClientRect());
      if (!check) {
        this.onHover = false;
        this.hide(event);
        this.onHover = true;
      }
    })
    const before = this.listeners;
    this.listeners = () => {
      before();
      onEnter();
      onLeave();
    }
  }
}
