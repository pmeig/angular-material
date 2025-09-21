import { booleanAttribute, Directive, input } from '@angular/core';
import { BooleanAttribute, emptyBooleanAttribute, EmptyBooleanAttribute } from '@pmeig/ng-material-core';
import { OffCanvasPosition } from '@pmeig/ngb-offcanvas';

@Directive({
  selector: 'navbar[offcanvas] navbar:not([offcanvas="false"])'
})
export class BNavOffcanvasOptionsDirective {
  scrollable = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute, alias: 'offcanvas-scrollable'});
  backdrop = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute, alias: 'offcanvas-backdrop'});
  static = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute, alias: 'offcanvas-static'});
  position = input<OffCanvasPosition>('end', {alias: 'offcanvas-position'});
  close = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute, alias: 'offcanvas-close'});

  constructor() { }

}
