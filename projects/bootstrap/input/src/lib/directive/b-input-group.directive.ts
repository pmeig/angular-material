import { Directive, effect, Input, input } from '@angular/core';
import { BTagParentDirective } from '@pmeig/ngb-core';

export type InputGroupSize = 'md' | 'lg' | 'sm';


@Directive({
  selector: 'input-group, [input-group],',
  standalone: true
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

  protected override afterViewInit(): void {
    this.refreshClasses();
    let idInput = '';
    this.children((child) => {
      if (
        !['input', 'textarea', 'select'].includes(
          child?.localName ?? 'input'
        ) &&
        child?.className.indexOf('form-') === -1 &&
        child?.className.indexOf('btn') === -1 &&
        child?.className.indexOf('invalid-') === -1
      ) {
        this.putClass(child, 'input-group-text');
      } else if (child?.localName === 'input') {
        idInput = child.id;
      }
      if (child?.localName === 'label') {
        this.putAttribute(
          child,
          'override',
          'true');
      }
    });
    if (idInput) {
      this.children((child) => {
        if (child?.localName === 'label') {
          child.setAttribute('for', idInput);
        }
      });
    }
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
