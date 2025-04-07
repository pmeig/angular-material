import { Directive, inject, TemplateRef } from '@angular/core';
import { TagTemplateDirective } from '@pmeig/ng-material-core';
import { bootstrapLink } from '../b-tag.constant';

@Directive()
export class BTagTemplateDirective extends TagTemplateDirective {

  protected constructor(templateRef: TemplateRef<any> = inject(TemplateRef<any>)) {
    super(templateRef);
  }

  protected override onInit() {
    super.onInit();
    this.insertLink(bootstrapLink);
  }

}
