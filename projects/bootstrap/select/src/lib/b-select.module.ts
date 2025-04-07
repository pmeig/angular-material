import { NgModule } from '@angular/core';
import { BSelectDirective } from './directives/b-select.directive';
import { BSelectMultipleDirective } from './directives/b-select-multiple.directive';
import { BOptionDirective } from './directives/b-option.directive';

const SELECT_DIRECTIVES = [BSelectDirective, BSelectMultipleDirective, BOptionDirective];

@NgModule({
  exports: SELECT_DIRECTIVES,
  imports: SELECT_DIRECTIVES
})
export class SelectMaterial {}
