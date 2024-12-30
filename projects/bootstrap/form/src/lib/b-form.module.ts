import { BFormDirective } from './b-form.directive';
import { BValidatorDirective } from './b-validator.directive';
import { NgModule } from '@angular/core';

const FORM_DIRECTIVES = [BFormDirective, BValidatorDirective];

@NgModule({
  imports: FORM_DIRECTIVES,
  exports: FORM_DIRECTIVES
})
export class FormMaterial {}
