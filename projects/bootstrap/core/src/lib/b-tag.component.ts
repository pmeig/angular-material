import { Component } from '@angular/core';
import { TagComponent } from '@pmeig/ng-material-core';
import { bootstrapLink } from './b-tag.constant';

@Component({
  template: '',
})
export abstract class BTagComponent extends TagComponent {
  protected constructor() {
    super();
  }

  protected override onInit() {
    super.onInit();
    this.insertLink(bootstrapLink);
  }
}
