import { NgModule } from '@angular/core';
import {BLabelDirective, BLabelFloatingDirective, BLabelCheckDirective, BLabelCheckButtonDirective} from './directives/public.directive';

const LABEL_DIRECTIVES = [BLabelDirective, BLabelFloatingDirective, BLabelCheckDirective, BLabelCheckButtonDirective];

@NgModule({
  imports: LABEL_DIRECTIVES,
  exports: LABEL_DIRECTIVES
})
export class LabelMaterial {}
