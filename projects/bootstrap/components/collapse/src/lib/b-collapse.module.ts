import { BCollapseDirective } from './b-collapse.directive';
import { NgModule } from '@angular/core';


const COLLAPSE_DIRECTIVES = [BCollapseDirective];

@NgModule({
  imports: COLLAPSE_DIRECTIVES,
  exports: COLLAPSE_DIRECTIVES,
})
export class CollapseMaterial {
}
