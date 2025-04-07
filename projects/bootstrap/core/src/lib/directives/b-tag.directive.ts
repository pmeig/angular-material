import { Directive, ElementRef, inject } from '@angular/core';
import { TagDirective } from '@pmeig/ng-material-core';
import { bootstrapLink } from '../b-tag.constant';

@Directive()
export abstract class BTagDirective<T extends Element = Element> extends TagDirective<T> {

  protected constructor(elementRef: ElementRef<T> = inject(ElementRef)) {
    super(elementRef);
  }


  protected override onInit() {
    super.onInit();
    this.insertLink(bootstrapLink);
  }
}
