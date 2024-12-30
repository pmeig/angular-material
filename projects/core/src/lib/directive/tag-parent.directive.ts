import { Directive, ElementRef, inject, Input } from '@angular/core';
import { classesCss, stylesCss } from '../helper/style.helper';
import { Item, TagDirective } from './tag.directive';
import { isNotBlank } from '@pmeig/ng-core';
import { extractElementAndAddStyle } from '../helper/internal.helper';

type Handle = (child: Element | null, index: number) => void;

@Directive()
export abstract class TagParentDirective<T extends Element = Element> extends TagDirective<T> {
  private css = {
    styles: {
      before: {},
      after: {}
    },
    ngStyles: {
      before: {},
      after: {}
    },
    classes: {
      before: [] as string[],
      after: [] as string[]
    },
    ngClasses: {
      before: [] as string[],
      after: [] as string[]
    }
  };

  protected constructor(element: ElementRef<T> | boolean = inject(ElementRef), listenDOMInteraction: boolean = true) {
    super(element, listenDOMInteraction);
  }

  @Input()
  set ngStyleChild(styleChild: Record<string, string>) {
    this.css.ngStyles.after = this.styleSeparateByName(stylesCss(styleChild));
    console.log('ngStyleChild')
    this.afterViewInit();
  }

  @Input()
  set styleChild(style: string | undefined) {
    this.css.styles.after = this.styleSeparateByName(style);
    console.log('styleChild')
    this.afterViewInit();
  }

  @Input()
  set classChild(classes: string | undefined) {
    this.css.classes.after = (classes || '').split(' ');
    console.log('classChild')
    this.afterViewInit();
  }

  @Input()
  set ngClassChild(classChild: Record<string, any>) {
    this.css.ngClasses.after = classesCss(classChild).split(' ');
    console.log('ngClassChild')
    this.afterViewInit();
  }

  protected override afterViewInit() {
    this.removeClassChildren(this.element, ...Object.keys(this.css.classes.before).concat(...Object.keys(this.css.ngClasses.before)));
    this.removeStyleChildren(this.element, ...Object.keys(this.css.styles.before).concat(...Object.keys(this.css.ngStyles.before)));
    this.putClassChildren(this.element, ...Object.keys(this.css.classes.after).concat(...Object.keys(this.css.ngClasses.after)));
    this.putStyleChildren(Object.entries(this.css.styles.after).concat(...Object.entries(this.css.ngStyles.after))
      .reduce((accumulator, [name, value]) => ({ ...accumulator, [name]: value }), {}));
    this.css = {
      styles: {
        before: this.css.styles.after,
        after: {}
      },
      classes: {
        before: this.css.classes.after,
        after: []
      },
      ngStyles: {
        before: this.css.ngStyles.after,
        after: {}
      },
      ngClasses: {
        before: this.css.ngClasses.after,
        after: []
      }
    };
  }

  protected putClassChildren(element: Item | string, ...cssClass: string[]) {
    this.executeChild(element, cssClass, (item, classes) => this.putCSSClassesChildren(item, classes));
  }

  protected removeClassChildren(element: Item | string, ...cssClass: string[]) {
    this.executeChild(element, cssClass, (item, classes) => this.removeCSSClassesChildren(item, classes));
  }

  protected putStyleChildren(element: Record<string, string>): void
  protected putStyleChildren(element: string, value: string): void
  protected putStyleChildren(element: Item, value: Record<string, string>): void
  protected putStyleChildren(element: Item | Record<string, string> | string,
                             value?: string | Record<string, string>) {
    if (isNotBlank(element)) {
      const styles = {};
      this.putCSSStyleChildren(extractElementAndAddStyle(element!!, value, styles) ?? this.element, styles);
    }
  }

  protected removeStyleChildren(element: Item | string, ...cssClass: string[]) {
    this.executeChild(element, cssClass, (item, classes) => this.removeCSSStyleChildren(item, classes));
  }

  protected children(handle: Handle, element: Item = this.element) {
    if (element) {
      let numberChild = element.childElementCount;
      const children = element.children;
      while (numberChild-- > 0) {
        handle(children.item(numberChild), numberChild);
      }
    }
  }

  protected getChildren(element: Item = this.element) {
    if (!element) {
      return [];
    }
    const elements = [];
    const children = element.children;
    let iterator = element.childElementCount;
    while (iterator--) {
      elements.unshift(children[iterator]);
    }
    return elements;
  }

  private executeChild(element: Item | string, classes: string[], apply: (element: Item, classes: string[]) => void): void {
    if (typeof element === 'string') {
      classes.push(element);
      element = this.element;
    }
    apply(element, classes);
  }

  private styleSeparateByName(style: string | undefined): { [name: string]: string } {
    return (style || '').split(';').reduce((accumulator, style) => {
      const [name, value] = style.split(':');
      return { ...accumulator, [name]: value };
    }, {});
  }

  private putCSSClassesChildren(element: Item, cssClass: string[]) {
    if (cssClass.length > 0) {
      this.children(child => this.putClass(child, ...cssClass), element);
    }
  }

  private removeCSSClassesChildren(element: Item, cssClass: string[]) {
    if (cssClass.length > 0) {
      this.children(child => this.removeClass(child, ...cssClass), element);
    }
  }

  private putCSSStyleChildren(item: Item, styles: Record<string, string>) {
    this.children(child => this.putStyle(child, styles), item);
  }

  private removeCSSStyleChildren(item: Item, styles: string[]) {
    if (styles.length > 0) {
      this.children(child => this.removeStyle(child, ...styles), item);
    }
  }
}
