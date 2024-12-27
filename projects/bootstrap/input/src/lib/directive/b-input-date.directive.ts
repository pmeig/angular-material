import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { findMapper, InputValueType } from '../b-input.mapper';
import { BInputDirective } from './b-input.directive';
import { NgpDatePipe } from '@pmeig/ng-core';

@Directive({
  selector:
    'input[type=date], input[type=datetime-local], input[type=month], input[type=week], input[type=time], input[type=datetime], input[type=datetime-local]',
  standalone: true,
  providers: [NgpDatePipe],
})
export class BInputDateDirective extends BInputDirective {
  @Input('value-type')
  set valueType(valueType: InputValueType | undefined) {
    this.mapper = findMapper(
      valueType || 'ts-date',
      this.element,
      this.dateParser,
    );
  }

  constructor(
    elementRef: ElementRef<HTMLInputElement>,
    renderer: Renderer2,
    dateParser: NgpDatePipe,
  ) {
    super(elementRef, renderer, dateParser);
  }
}
