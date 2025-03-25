import { AfterViewInit, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { addLinkToHead, getDocument, TagComponent } from '@pmeig/ng-material-core';

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
    addLinkToHead({
      id: 'ngb-css',
      rel: 'stylesheet',
      integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
      crossorigin: 'anonymous',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
    }, inject(Renderer2), getDocument(this.elementRef.nativeElement))
  }
}
