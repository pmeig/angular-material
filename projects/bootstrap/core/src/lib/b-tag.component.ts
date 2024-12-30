import { afterNextRender, AfterViewInit, Component, ElementRef, inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { addLinkToHead, getDocument, TagComponent } from '@pmeig/ng-material-core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  template: '',
})
export abstract class BTagComponent extends TagComponent implements AfterViewInit {
  private platform = inject(PLATFORM_ID);
  private elementRef = inject(ElementRef);
  protected constructor() {
    super();
    if (isPlatformServer(this.platform)) {
      afterNextRender(() => {
        addLinkToHead({
          id: 'ngb-css',
          rel: 'stylesheet',
          integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
          crossorigin: 'anonymous',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
        }, inject(Renderer2), getDocument(this.elementRef.nativeElement))
      })
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platform)) {
      addLinkToHead({
        id: 'ngb-css',
        rel: 'stylesheet',
        integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
        crossorigin: 'anonymous',
        href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
      }, inject(Renderer2), getDocument(this.elementRef.nativeElement))
    }
  }

}
