import {
  Directive,
  effect,
  ElementRef,
  HostListener,
  input,
  Renderer2,
} from '@angular/core';
import { TagDirective } from '@pmeig/ng-material-core';

@Directive({
  selector: 'form, [formGroup]',
  standalone: true,
})
export class BFormDirective extends TagDirective<HTMLFormElement> {
  private submitted = false;
  unvalidated = input<boolean>(false);

  constructor(elementRef: ElementRef<HTMLFormElement>, renderer: Renderer2) {
    super(elementRef, renderer);
    effect(() => {
      if (this.unvalidated()) this.removeClass('was-validated');
      else if (this.submitted) this.putClass('was-validated');
    });
  }

  protected afterViewInit(): void {}

  @HostListener('ngSubmit')
  protected onSubmit() {
    this.submitted = true;
    if (!this.unvalidated()) this.putClass('was-validated');
  }
}
