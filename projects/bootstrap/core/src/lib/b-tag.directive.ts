import { Directive, ElementRef, inject } from '@angular/core';
import { TagDirective } from '@pmeig/ng-material-core';

@Directive()
export abstract class BTagDirective<T extends Element = Element> extends TagDirective<T> {

  protected constructor(elementRef: ElementRef<T> = inject(ElementRef)) {
    super(elementRef);
  }


  protected override onInit() {
    super.onInit();
    this.insertLink({
      id: 'ngb-css',
      rel: 'stylesheet',
      integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
      crossorigin: 'anonymous',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
    })
  }
}
