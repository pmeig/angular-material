import { BBtnGroupDirective } from './b-btn-group.directive';
import { BBtnDirective } from './b-btn.directive';
import { NgModule } from '@angular/core';

const BTN_DIRECTIVES = [BBtnDirective, BBtnGroupDirective];

@NgModule({
  imports: BTN_DIRECTIVES,
  exports: BTN_DIRECTIVES
})
export class BtnMaterial {}
