import { ElementRef, TemplateRef } from '@angular/core';

export interface ElementItem {
  value: Element | TemplateRef<any> | ElementRef;
  template: () => TemplateRef<any>;
  element: () => Element | ElementRef;
  index: number;
  isTemplate: boolean;
}

export type AutoClose = 'outside' | 'inside' | 'both' | 'manual';

export const createElementItem = (value: ElementItem['value'], index: number) => {
  const record = {
    value,
    template: () => record.isTemplate ? value : null,
    element: () => record.isTemplate ? null : value,
    index,
    isTemplate: value instanceof TemplateRef,
  } as ElementItem;
  return record;
};
