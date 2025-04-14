import { NgModule } from '@angular/core';
import { BBadgeDirective } from './b-badge.directive';


const BADGE_DIRECTIVES = [BBadgeDirective];

@NgModule({
  imports: BADGE_DIRECTIVES,
  exports: BADGE_DIRECTIVES,
})
export class BadgeMaterial { }
