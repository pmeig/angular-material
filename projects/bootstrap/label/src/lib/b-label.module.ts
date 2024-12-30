import { BLabelDirective } from './b-label.directive';
import { NgModule } from '@angular/core';

const LABEL_DIRECTIVES = [BLabelDirective];

@NgModule({
  imports: LABEL_DIRECTIVES,
  exports: LABEL_DIRECTIVES
})
export class LabelMaterial {}
