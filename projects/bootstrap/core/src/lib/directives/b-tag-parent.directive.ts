import { Directive, ElementRef, inject } from '@angular/core';
import { TagParentDirective } from '@pmeig/ng-material-core';
import { bootstrapLink } from '../b-tag.constant';

@Directive()
export abstract class BTagParentDirective<T extends Element = Element> extends TagParentDirective<T> {

  protected constructor(elementRef: ElementRef<T> = inject(ElementRef)) {
    super(elementRef);
  }


  protected override onInit() {
    super.onInit();
    this.insertLink(bootstrapLink);
  }
}
