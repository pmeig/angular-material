import {AfterViewInit, Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';
import {isNotBlank} from "@ngp/core";
import {classesCss, stylesCss} from "../helper/style.helper";

type Handle = (child: Element | null, index: number) => void;
type Item = Element | null | undefined;

// noinspection JSUnusedGlobalSymbols
@Directive()
export abstract class TagDirective implements AfterViewInit, OnChanges {
  private css = {
    styles: {},
    ngStyles: {},
    classes: [] as string[],
    ngClasses: [] as string[]
  }
  protected isViewInit = false

  readonly element?: Element;

  @Input()
  set ngStyleChild(styleChild: Record<string, string>) {
    this.css.ngStyles = this.styleSeparateByName(stylesCss(styleChild))
  }

  @Input()
  set styleChild(style: string | undefined) {
    this.css.styles = this.styleSeparateByName(style)
  }

  @Input()
  set classChild(classes: string | undefined) {
    this.css.classes = (classes || '').split(' ')
  }

  @Input()
  set ngClassChild(classChild: Record<string, any>) {
    this.css.ngClasses = classesCss(classChild).split(' ')
  }

  protected constructor(
    elementRef: ElementRef<Element>,
    protected renderer: Renderer2
  ) {
    this.element = elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refresh()
  }


  protected abstract afterViewInit(): void;

  ngAfterViewInit(): void {
    this.isViewInit = true
    this.afterViewInit();
  }

  protected putClass(element: Item | string, ...cssClass: string[]) {
    this.execute(element, cssClass, (item, classes) => this.putCSSClasses(item, classes))
  }

  protected putClassChildren(element: Item | string, ...cssClass: string[]) {
    this.execute(element, cssClass, (item, classes) => this.putCSSClassesChildren(item, classes))
  }

  protected removeClass(element: Item | string, ...cssClass: string[]) {

    this.execute(element, cssClass, (item, classes) => this.removeCSSClasses(item, classes))
  }

  protected removeClassChildren(element: Item | string, ...cssClass: string[]) {
    this.execute(element, cssClass, (item, classes) => this.removeCSSClassesChildren(item, classes))
  }

  protected removeStyle(element: Item | string, ...names: string[]) {
    this.execute(element, names, (item, names) => this.removeCSSStyle(item, names))
  }

  protected putStyle(element: Element, name: string, value: string): void
  protected putStyle(element: {name: string, value: string}, value: {name: string, value: string}, ...cssClass: {name: string, value: string}[]): void
  protected putStyle(element: Item, value: {name: string, value: string}, ...cssStyles: {name: string, value: string}[]): void
  protected putStyle(element: string, value: string): void
  protected putStyle(element: Item | {name: string, value: string} | string,
                     value: string | {name: string, value: string},
                     styles?: string | {name: string, value: string},
                     ...cssStyles: { name: string, value: any }[]) {
    if (isNotBlank(element)) {
      if (!(element instanceof Element)) {
        if (typeof element === 'string') {
          cssStyles.push({name: element, value})
        } else {
          cssStyles.push(element!!)
        }
        element = this.element
      }
      if (styles) {
        if (typeof styles === 'string') {
          cssStyles.push({name: value as string, value: styles})
        } else {
          cssStyles.push(styles!!)
        }
      }
      this.putCSSStyle(element, cssStyles)
    }
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

  protected putAttribute(name: string, value: any | undefined): void
  protected putAttribute(element: Item, name: string, value: any | undefined): void
  protected putAttribute(element: Item | string, name: any | undefined, value?: any): void {
    if (typeof element === 'string') {
      value = name
      name = element
      element = this.element
    }
    if (element) {
      let action = {
        put: () => this.renderer.setAttribute(element, name, value),
        remove: () => this.renderer.removeAttribute(element, name)
      };
      if (element.nodeType === Node.COMMENT_NODE) {
        action = {
          put: () => element.setAttribute(name, value.toString()),
          remove: () => element.removeAttribute(name)
        };
      }
      if (value) {
        action.put();
      } else {
        action.remove();
      }
    }
  }

  private putCSSClassesChildren(element: Item, cssClass: string[]) {
    this.children(child => this.putCSSClasses(child, cssClass), element);
  }

  private removeCSSClassesChildren(element: Item, cssClass: string[]) {
    this.children(child => this.removeCSSClasses(child, cssClass), element);
  }

  private execute(element: Item | string, classes: string[], apply: (element: Item, classes: string[]) => void): void {
    if (typeof element === 'string') {
      classes.push(element);
      element = this.element
    }
    apply(element, classes)
  }

  private putCSSClasses(element: Item, classes: string[]) {
    if (element) {
      const className = element.getAttribute('class')?.split(' ') ?? [];
      const action = element.nodeType === Node.COMMENT_NODE
        ? (value: string) => element.setAttribute('class', `${element.getAttribute('class')} ${value}`)
        : (value: string) => this.renderer.addClass(element, value);
      classes
        .filter((value) => className.length === 0 || !className.includes(value))
        .forEach((value) => action(value));
    }
  }

  private removeCSSClasses(
    element: Item,
    classes: string[]
  ) {
    if (element) {
      const className = element.getAttribute('class')?.split(' ') ?? [];
      const action = element.nodeType === Node.COMMENT_NODE
        ? (value: string) => element.setAttribute('class', (element.getAttribute('class')?.split(value) ?? []).map(cssClass => cssClass.trim()).join(' '))
        : (value: string) => this.renderer.removeClass(element, value);
      classes
        .filter((value) => className.includes(value))
        .forEach((value) => action(value));
    }
  }

  private putCSSStyle(element: Item, cssStyles: { name: string, value: any }[]) {
    if (element) {
      if (element.nodeType === Node.COMMENT_NODE) {
        const names = cssStyles.map(value => value.name);
        const styles = element.getAttribute('style')?.split(';').map(style => style.split(':').map(part => part.trim()))
          .filter(entry => !names.includes(entry[0])).map(entry => `${entry[0]}: ${entry[1]}`).join('; ');
        const css = cssStyles.map(value => `${value.name}: ${value.value}`).join('; ');
        element.setAttribute('style', `${styles}${styles ? '; ' : ''}${css}`);
      } else {
        cssStyles.forEach(value => this.renderer.setStyle(element, value.name, value.value));
      }
    }
  }

  private removeCSSStyle(element: Item, cssStyle: string[]) {
    if (element) {
      if (element.nodeType === Node.COMMENT_NODE) {
        let name = '';
        const styles = element.getAttribute('style')?.split(';').map(value => {
          if (name.length === 0) {
            name = value;
            return undefined;
          }
          return { name: name.trim(), value: value.trim() };
        }).filter(value => value && !cssStyle.includes(value.name)).map(value => `${value!!.name}: ${value!!.value}`).join('; ');
        if (styles && styles.trim().length > 0) {
          element.setAttribute('style', styles);
        } else {
          element.removeAttribute('style');
        }
      } else {
        cssStyle.forEach(value => this.renderer.removeStyle(element, value));
      }
    }
  }

  private styleSeparateByName(style: string | undefined) {
    return (style || '').split(';').reduce((accumulator, style) => {
      const [name, value] = style.split(':')
      return {...accumulator, [name]: value}
    }, {} );
  }

  protected refresh() {
    if (this.isViewInit) {
      this.ngAfterViewInit()
    }
  }
}
