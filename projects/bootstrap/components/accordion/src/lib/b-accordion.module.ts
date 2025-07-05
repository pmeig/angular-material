import { NgModule } from '@angular/core';
import { BAccordionDirective } from './b-accordion.directive';
import { BAccordionItemComponent } from './b-accordion-item/b-accordion-item.component';

const ACCORDION_DIRECTIVES = [BAccordionDirective, BAccordionItemComponent];

@NgModule({
  imports: ACCORDION_DIRECTIVES,
  exports: ACCORDION_DIRECTIVES,
})
export class AccordionMaterial {
}
