import { Directive, input } from '@angular/core';
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

  dateType = input<Omit<InputValueType, 'rgb'>>('ts-date', {alias: 'date-type'});

  constructor(
    dateParser: NgpDatePipe,
  ) {
    super(dateParser);
    this.effect(this.restoreMapper)
  }

  private restoreMapper() {
    this.mapper = findMapper(
      this.dateType(),
      this.element,
      this.dateParser,
    )
  }
}
