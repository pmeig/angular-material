import { Directive, inject, TemplateRef } from '@angular/core';
import { TagTemplateDirective } from '@pmeig/ng-material-core';
import { injectBootstrapLinks } from '../b-tag.constant';

@Directive()
export class BTagTemplateDirective extends TagTemplateDirective {
  private readonly bootstrapLinks = injectBootstrapLinks();


  protected constructor(templateRef: TemplateRef<any> = inject(TemplateRef<any>)) {
    super(templateRef);
  }

  protected override onInit() {
    super.onInit();
    this.insertLink(...this.bootstrapLinks);
  }

}
