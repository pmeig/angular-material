import { Directive, input } from '@angular/core';
import { emptyBooleanAttribute, EmptyBooleanAttribute } from '@pmeig/ng-material-core';

export type DropdownDirection = 'up' | 'down' | 'start' | 'end';

@Directive({
  selector: 'dropdown[direction=up], dropdown[direction=down], dropdown:not([direction])',
})
export class DropdownDirectionDirective {

  center = input<boolean, EmptyBooleanAttribute>(false, { transform: emptyBooleanAttribute });

  constructor() {
  }

}
