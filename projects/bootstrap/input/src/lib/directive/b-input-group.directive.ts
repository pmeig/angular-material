import { computed, Directive, input } from '@angular/core';
import { BTagParentDirective } from '@pmeig/ngb-core';
import { Empty } from '@pmeig/ng-material-core';

export type InputGroupSize = 'md' | 'lg' | 'sm';


@Directive({
  selector: 'input-group, [input-group],',
  standalone: true,
})
export class BInputGroupDirective extends BTagParentDirective {
  sizeAttribute = input<InputGroupSize>(undefined, {alias: 'size'});
  inputGroup = input<InputGroupSize, Empty<InputGroupSize>>('md',
    {transform: size => size === '' ? 'md' : size, alias: 'input-group'})
  private groupClassnames = ['input-group'];
  private size = computed(() => this.sizeAttribute() ?? this.inputGroup());

  constructor() {
    super();
    this.effect(this.refreshClasses);
  }


  protected override onInit() {
    super.onInit();
    this.putAttribute('pmeig-parent', 'input-group');
  }

  protected override afterViewInit(): void {
    this.children((child) => {
      if (
        ['form-', 'btn', 'valid-feedback', 'dropdown-menu'].every(regex => child?.className.indexOf(regex) === -1)
        || child?.tagName === 'LABEL'
      ) {
        if (child?.tagName === 'LABEL' && child.previousElementSibling?.getAttribute('label')) {
          this.renderer.insertBefore(this.element, child, child.previousElementSibling, true);
        }
        this.removeClass(child, 'form-label', 'form-check-label');
        this.putClass(child, 'input-group-text');
      }
    });
    this.removeClass('form-floating', 'form')
  }

  private refreshClasses() {
    this.removeClass(...this.groupClassnames);
    const size = this.size();
    if (size !== 'md') {
      this.groupClassnames = ['input-group', `input-group-${size}`];
    } else {
      this.groupClassnames = ['input-group'];
    }
    this.putClass(...this.groupClassnames);
  }
}
