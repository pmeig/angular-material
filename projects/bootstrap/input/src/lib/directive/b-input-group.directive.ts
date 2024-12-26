import {
  Directive,
  effect,
  ElementRef,
  Input,
  input,
  Renderer2,
} from '@angular/core';
import { TagParentDirective } from '@ngp-material/core';

export type InputGroupSize = 'md' | 'lg' | 'sm';

@Directive({
  selector: 'input-group, [input-group],',
  standalone: true,
})
export class BInputGroupDirective extends TagParentDirective {
  private groupClassnames = ['input-group'];
  private sizeDirective?: InputGroupSize;
  size = input<InputGroupSize>('md');

  @Input('input-group')
  protected set inputGroup(value: InputGroupSize | '') {
    this.sizeDirective = value === '' ? 'md' : value;
    this.refreshClasses();
  }

  constructor(renderer: Renderer2, elementRef: ElementRef<Element>) {
    super(elementRef, renderer);
    effect(() => {
      this.refreshClasses();
    });
  }

  protected afterViewInit(): void {
    this.putClass(...this.groupClassnames);
    let idInput = '';
    this.children((child) => {
      if (
        !['input', 'textarea', 'select'].includes(
          child?.localName ?? 'input',
        ) &&
        child?.className.indexOf('form-') === -1 &&
        child?.className.indexOf('btn') === -1 &&
        child?.className.indexOf('invalid-') === -1
      ) {
        this.putClass(child, 'input-group-text');
      } else if (child?.localName === 'input') {
        idInput = child.id;
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

  private get currentSize(): InputGroupSize {
    return this.sizeDirective ?? this.size();
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
