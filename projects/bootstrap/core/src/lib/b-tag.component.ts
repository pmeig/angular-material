import { AfterViewInit, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { addLinkToHead, getDocument, TagComponent } from '@pmeig/ng-material-core';
import { bootstrapLink } from './b-tag.constant';

@Component({
  template: '',
})
export abstract class BTagComponent extends TagComponent implements AfterViewInit {
  private elementRef = inject(ElementRef);
  protected constructor() {
    super();
  }


  protected override onInit() {
    super.onInit();
    addLinkToHead(bootstrapLink, inject(Renderer2), getDocument(this.elementRef.nativeElement))
  }
}
