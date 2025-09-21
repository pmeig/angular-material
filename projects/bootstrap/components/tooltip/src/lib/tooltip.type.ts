import { TemplateRef } from '@angular/core';

export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

export interface PopoverFactory extends TooltipBodyFactory<PopoverFactory> {
  title(template?: TemplateRef<any> | string): PopoverFactory;
}

export interface TooltipFactory extends TooltipBodyFactory<TooltipFactory> {}

export interface TooltipRendered {
  tooltip: HTMLElement;
  currentPlacement: TooltipPlacement;
  destroy(): void;
}

export interface TooltipBodyFactory<T extends TooltipFactory | PopoverFactory> {
  id(id?: string): T;
  body(template?: TemplateRef<any> | string): T;
  placement(placement?: TooltipPlacement): T;
  otherwise(placement?: TooltipPlacement): T;
  render(target: HTMLElement): TooltipRendered;
}

export abstract class TooltipRenderer {
  abstract create(type: 'tooltip'): TooltipFactory;
  abstract create(type: 'popover'): PopoverFactory;
  abstract create(type: 'tooltip' | 'popover'): TooltipFactory | PopoverFactory;
}

export interface TooltipBuilderState {
  placement: TooltipPlacement;
  otherwise?: TooltipPlacement;
  id: string;
  title?: TemplateRef<any> | string;
  body?: TemplateRef<any> | string;
}
