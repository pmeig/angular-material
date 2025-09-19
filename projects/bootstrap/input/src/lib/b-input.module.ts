import { BInputDirective } from './directive/b-input.directive';
import { BInputGroupDirective } from './directive/b-input-group.directive';
import { BInputDateDirective } from './directive/b-input-date.directive';
import { NgModule } from '@angular/core';

const INPUT_DIRECTIVES = [BInputDirective, BInputGroupDirective, BInputDateDirective];


@NgModule({
  imports: INPUT_DIRECTIVES,
  exports: INPUT_DIRECTIVES,
})
export class InputMaterial {
}
