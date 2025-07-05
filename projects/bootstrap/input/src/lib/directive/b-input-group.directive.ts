import { Directive, effect, Input, input } from '@angular/core';
import { BTagParentDirective } from '@pmeig/ngb-core';

export type InputGroupSize = 'md' | 'lg' | 'sm';


@Directive({
  selector: 'input-group, [input-group],',
  standalone: true,
})
export class BInputGroupDirective extends BTagParentDirective {
  size = input<InputGroupSize>('md');
  private groupClassnames = ['input-group'];
  private sizeDirective?: InputGroupSize;

  constructor() {
    super();
    effect(() => {
      this.refreshClasses();
    });
  }

  @Input('input-group')
  protected set inputGroup(value: InputGroupSize | '') {
    this.sizeDirective = value === '' ? 'md' : value;
    this.refreshClasses();
  }

  private get currentSize(): InputGroupSize {
    return this.sizeDirective ?? this.size();
  }


  protected override onInit() {
    super.onInit();
    this.putAttribute('pmeig-parent', 'input-group');
  }

  protected override afterViewInit(): void {
    this.refreshClasses();
    this.children((child) => {
      if (
        ['form-', 'btn', 'valid-feedback', 'dropdown-menu'].every(regex => child?.className.indexOf(regex) === -1)
        || child?.tagName === 'LABEL'
      ) {
        this.removeClass(child, 'form-label', 'form-check-label');
        this.putClass(child, 'input-group-text');
      }
    });
  }

  private refreshClasses() {
    this.removeClass(...this.groupClassnames);
    if (this.currentSize !== 'md') {
      this.groupClassnames = ['input-group', `input-group-${this.currentSize}`];
    } else {
      this.groupClassnames = ['input-group'];
    }
    this.putClass(...this.groupClassnames);
  }
}
