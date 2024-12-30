import { Directive, effect, HostListener, Injectable, input } from '@angular/core';
import { BTagDirective } from '@pmeig/ngb-core';

@Injectable({providedIn: 'root'})
@Directive({
  selector: 'form, [formGroup]',
  standalone: true
})
export class BFormDirective extends BTagDirective<HTMLFormElement> {
  unvalidated = input<boolean>(false);
  private submitted = false;

  constructor() {
    super();
    effect(() => {
      if (this.unvalidated()) this.removeClass('was-validated');
      else if (this.submitted) this.putClass('was-validated');
    });
  }

  @HostListener('ngSubmit')
  protected onSubmit() {
    this.submitted = true;
    if (!this.unvalidated()) this.putClass('was-validated');
  }
}
