import { BListGroupDirective } from './b-list-group.directive';
import { ListGroupActionDirective } from './list-group-action.directive';
import { NgModule } from '@angular/core';

const DIRECTIVES_EXPORT = [BListGroupDirective, ListGroupActionDirective]

@NgModule({
  imports: DIRECTIVES_EXPORT,
  exports: DIRECTIVES_EXPORT,
})
export class ListMaterial {}
