import { NgModule } from '@angular/core';
import {
  BLabelCheckButtonDirective,
  BLabelCheckDirective,
  BLabelDirective,
  BLabelFloatingDirective
} from './directive/public.directive';

const LABEL_DIRECTIVES = [BLabelDirective, BLabelFloatingDirective, BLabelCheckDirective, BLabelCheckButtonDirective];

@NgModule({
  imports: LABEL_DIRECTIVES,
  exports: LABEL_DIRECTIVES
})
export class LabelMaterial {}
