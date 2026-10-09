import { Component } from '@angular/core';
import { TagComponent } from '@pmeig/ng-material-core';
import { injectBootstrapLinks } from './b-tag.constant';

@Component({
  template: '',
})
export abstract class BTagComponent extends TagComponent {
  private readonly bootstrapLinks = injectBootstrapLinks();

  protected constructor() {
    super();
  }

  protected override onInit() {
    super.onInit();
    this.insertLink(...this.bootstrapLinks);
  }
}
