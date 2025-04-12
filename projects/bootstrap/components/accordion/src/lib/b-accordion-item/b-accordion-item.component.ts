import { ChangeDetectionStrategy, Component, ContentChild, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BTagComponent } from '@pmeig/ngb-core';
import { CollapseDirective } from '@pmeig/ngb-collapse';

@Component({
  selector: 'accordion',
  templateUrl: './b-accordion-item.component.html',
  styleUrl: './b-accordion-item.component.scss',
  imports: [
    CollapseDirective,
    NgTemplateOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BAccordionItemComponent extends BTagComponent {
  readonly header = input<string>();
  @ContentChild(TemplateRef) body?: TemplateRef<any>;
  constructor() {
    super()
  }
}
