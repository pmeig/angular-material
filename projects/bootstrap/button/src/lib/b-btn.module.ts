import { BBtnGroupDirective } from './directive/b-btn-group.directive';
import { BBtnDirective } from './directive/b-btn.directive';
import { NgModule } from '@angular/core';
import { BBtnToolbarDirective } from './directive/b-btn-toolbar.directive';

const BTN_DIRECTIVES = [BBtnDirective, BBtnGroupDirective, BBtnToolbarDirective];

@NgModule({
  imports: BTN_DIRECTIVES,
  exports: BTN_DIRECTIVES
})
export class ButtonMaterial {}
