import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  Input,
  input,
  Renderer2,
} from '@angular/core';
import {
  BooleanAttribute,
  getDocument,
  TagDirective,
} from '@pmeig/ng-material-core';
import { bLabelCss } from './b-label.css';

type LabelFor = Element & { placeholder?: string; type?: string };

interface LabelState {
  parent?: HTMLDivElement;
  css: {
    classes: string[];
    styles: string;
  };
}

interface LabelNextElement {
  label?: Element;
  htmlFor?: Element;
}

@Directive({
  selector: '[label], label',
  standalone: true,
})
export class BLabelDirective extends TagDirective {
  private readonly htmlFor?: LabelFor;
  private label: Element;
  private elements?: LabelState;
  private isFloating = true;
  classes = input<string>('', { alias: 'class' });
  style = input<string>('');
  private observer?: MutationObserver;
  private next: LabelNextElement = {};

  @Input('label')
  set labelText(labelText: string | Element) {
    if (typeof labelText === 'string') this.label.innerHTML = labelText;
    else this.label = labelText;
  }

  @Input()
  set floating(floating: BooleanAttribute | '') {
    this.isFloating = floating === '' ? true : booleanAttribute(floating);
    this.refreshLabel();
  }

  constructor(elementRef: ElementRef, renderer: Renderer2) {
    super(elementRef, renderer);
    if (this.isLabel) {
      this.label = this.element;
      const id = (this.element as HTMLLabelElement).htmlFor;
      if (id) {
        this.htmlFor = getDocument(this.element).getElementById(id) as Element;
      }
    } else {
      this.label = this.renderer.createElement('label');
      this.htmlFor = this.element;
    }
    effect(() => {
      const classes = this.classes()
        .split(' ')
        .filter((classname) => !!classname);
      if (classes.length) {
        this.putClass(...classes);
        this.refreshLabel();
      }
    });
    effect(() => {
      if (this.style()) {
        this.putStyle(this.style());
        this.refreshLabel();
      }
    });
  }

  protected override onInit() {
    super.onInit();
    if (this.isEnabled()) {
      this.next.label = this.renderer.nextSibling(this.label) ?? undefined;
      if (this.htmlFor) {
        this.next.htmlFor =
          this.renderer.nextSibling(this.htmlFor) ?? undefined;
      }
      this.insertStyle(bLabelCss);
      this.refreshLabelWhenHtmlForChange();
      if (!this.refreshClasses()) {
        let element = this.htmlFor;
        while (element && !(element instanceof HTMLElement)) {
          element = element.firstElementChild as LabelFor;
        }
        if (element) {
          this.renderer.listen(this.label, 'click', () => element.click());
        }
      }

      this.refreshLabel();
    }
  }

  protected afterViewInit(): void {}

  override ngOnDestroy() {
    super.ngOnDestroy();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private mergeLabelInput(label: Element) {
    const parent = this.renderer.parentNode(this.htmlFor);
    if (!this.elements?.parent && parent.contains(label)) {
      this.renderer.removeChild(parent, label);
    }
    return this.mergeLabelTitleInput(label, parent);
  }

  private mergeLabelTitleInput(label: Element, parent: Element) {
    const div =
      this.elements?.parent ??
      (this.renderer.createElement('div') as HTMLDivElement);
    const suffixClassname = this.typeForm(this.htmlFor!!);
    this.putClass(
      div,
      ...[`form-${suffixClassname}`, ...(this.elements?.css?.classes ?? [])],
    );
    if (suffixClassname === 'check') this.putClass(div, 'c-default');
    if (this.elements?.css.styles) {
      this.putStyle(div, this.elements.css.styles);
    }
    if (this.elements?.parent) return this.elements.parent;
    this.renderer.insertBefore(parent, div, this.htmlFor);
    this.renderer.removeChild(parent, this.htmlFor);
    this.renderer.removeChild(parent, label);
    this.renderer.appendChild(div, this.htmlFor);
    setTimeout(() =>
      this.renderer.insertBefore(
        div,
        label,
        this.renderer.nextSibling(this.htmlFor),
      ),
    );
    if ('placeholder' in this.htmlFor!! && !this.htmlFor.placeholder) {
      this.htmlFor.placeholder = label.textContent || ' ';
    }
    return div;
  }

  private refreshLabel(force: boolean = false) {
    if (this.isEnabled()) {
      if (
        this.htmlFor &&
        this.isFloating &&
        this.htmlFor.type !== 'range' &&
        !force
      ) {
        this.elements = {
          css: {
            classes:
              this.htmlFor.className
                ?.split(' ')
                ?.filter((classname) => !classname.startsWith('form-')) || [],
            styles: this.htmlFor.getAttribute('style') || '',
          },
        };
        this.removeCss();
        this.elements.parent = this.mergeLabelInput(this.label);
      } else if (
        this.htmlFor &&
        ((!this.isFloating && this.elements) || force)
      ) {
        this.elements = {
          ...this.elements,
          css: {
            classes:
              this.htmlFor.className
                ?.split(' ')
                ?.filter((classname) => !classname.startsWith('form-')) || [],
            styles: this.htmlFor.getAttribute('style') || '',
          },
        };
        this.insertCss();
        this.removeParent();
        if (force) {
          this.refreshLabel();
        }
      }
    }
  }

  private get isLabel(): boolean {
    return this.element.tagName === 'LABEL';
  }

  private putClassByInputType(input: HTMLInputElement) {
    switch (input.type) {
      case 'checkbox':
      case 'radio':
        this.removeClass(this.label, 'form-label');
        this.putClass(this.label, 'form-check-label');
        break;
      default:
        this.removeClass(this.label, 'form-check-label');
        this.putClass(this.label, 'form-label');
    }
  }

  private removeCss() {
    this.removeClass(this.htmlFor, ...(this.elements?.css?.classes ?? []));
    this.removeAttribute(this.htmlFor, 'style');
  }

  private insertCss() {
    this.putClass(this.htmlFor, ...(this.elements?.css?.classes ?? []));
    if (this.elements?.css?.styles) {
      this.putAttribute(this.htmlFor, 'style', this.elements.css.styles);
    }
  }

  private removeParent() {
    const parent = this.renderer.parentNode(this.elements!!.parent);
    this.putElementParentOrNextSibling('htmlFor', parent);
    this.putElementParentOrNextSibling('label', parent);
    this.renderer.removeChild(parent, this.elements!!.parent);
    this.elements = undefined;
  }

  private putElementParentOrNextSibling(
    name: 'htmlFor' | 'label',
    parent: Element,
  ) {
    const expectedNext = this.next[name];
    let target = this.elements!!.parent as Element | undefined;
    if (expectedNext) {
      const children = parent.children;
      let nb = parent.childElementCount;
      while (nb-- && children[nb] !== expectedNext) {}
      if (nb > -1) target = expectedNext;
    }
    this.renderer.insertBefore(parent, this[name], target);
  }

  private typeForm(htmlFor: LabelFor) {
    return ['checkbox', 'radio'].includes(htmlFor.type!!)
      ? 'check'
      : 'floating';
  }

  private refreshLabelWhenHtmlForChange() {
    if (this.htmlFor) {
      this.onChange(
        this.htmlFor,
        () => {
          this.refreshLabel(true);
          this.refreshClasses();
        },
        {
          attributeFilter: ['class', 'style', 'type'],
        },
      );
    }
  }

  private refreshClasses() {
    if (this.isLabel) {
      if (this.htmlFor && this.htmlFor.tagName === 'INPUT') {
        this.putClassByInputType(this.htmlFor as HTMLInputElement);
      }
      return true;
    } else {
      if (this.element.tagName === 'INPUT') {
        this.putClassByInputType(this.element as HTMLInputElement);
      }
      if (this.label.tagName === 'LABEL') {
        this.label.setAttribute('for', this.htmlFor!!.id);
        return true;
      }
    }
    return false;
  }

  private isEnabled() {
    return this.renderer.parentNode(this.element).tagName !== 'INPUT-GROUP';
  }
}
