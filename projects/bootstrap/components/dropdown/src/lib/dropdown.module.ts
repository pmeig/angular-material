import { NgModule } from '@angular/core';
import { BDropdownComponent } from './b-dropdown/b-dropdown.component';
import { DropdownDirectionDirective } from './directives/dropdown-direction.directive';

const DROPDOWN_EXPOSES = [BDropdownComponent, DropdownDirectionDirective];

@NgModule({
  imports: DROPDOWN_EXPOSES,
  exports: DROPDOWN_EXPOSES,
})
export class DropdownMaterial {
}
