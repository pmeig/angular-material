import { Component, inject, Renderer2 } from '@angular/core';
import { addLinkToHead, TagComponent } from '@pmeig/ng-material-core';
import { bootstrapLink } from './b-tag.constant';
import { DOCUMENT } from '@angular/common';

@Component({
  template: '',
})
export abstract class BTagComponent extends TagComponent {
  private readonly document = inject(DOCUMENT);
  protected readonly renderer = inject(Renderer2);
  protected constructor() {
    super();
  }


  protected override onInit() {
    super.onInit();
    addLinkToHead(bootstrapLink, this.renderer, this.document)
  }
}
