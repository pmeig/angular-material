import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  signal
} from '@angular/core';
import { isNotBlank } from '@pmeig/ng-core';
import { EventHandler } from '../helper/event-handler';
import { extractElementAndAddStyle, styleToRecord } from '../helper/internal.helper';
import {
  addAttribute,
  addLinkToHead,
  addStyleToHead,
  Css,
  Item,
  Link,
  putAttribute,
  putClass,
  putStyle,
  removeAttribute,
  removeClass,
  removeStyle,
  StyleElement
} from '../helper/css.helper';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { getDocument } from '../helper/browser.helper';
import { InsertParent, insertParent, isTag, ParentExclude, removeParent, TagParent } from '../helper/component.helper';
import { BehaviorSubject, debounceTime, take } from 'rxjs';

@Directive()
export abstract class TagDirective<T extends Element = Element> extends EventHandler implements AfterViewInit, OnDestroy, OnInit {
  readonly element: T;
  readonly ignore = input<'' | undefined>(undefined, { alias: 'pmeig-ignore' });

  protected readonly renderer = inject(Renderer2);
  protected parent?: InsertParent;
  protected readonly isReady = signal(false);


  private readonly platform = inject(PLATFORM_ID);
  private lastLifecycleExecutor = new BehaviorSubject(false).pipe(debounceTime(50), take(1));


  protected constructor(
    elementRef: ElementRef<T> = inject(ElementRef),
  ) {
    super();
    this.element = elementRef.nativeElement;
  }

  ngOnInit(): void {
    if (this.isBrowser() && this.ignore() !== '') {
      this.lastLifecycleExecutor.subscribe(() => {
        this.putClass(...this.getDefaultClassname());
        this.onInit();
      })
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser() && this.ignore() !== '') {
      this.lastLifecycleExecutor.subscribe(() => {
        this.afterViewInit();
        this.isReady.set(true);
      })
    }

  }

  ngOnDestroy(): void {
    if (this.isBrowser()) {
      this.lastLifecycleExecutor.subscribe(() => {
        this.clearEvent();
        this.removeParent();
      })
    }
  }

  protected effect(action: () => void) {
    effect(() => this.onEffect(action));
  }

  protected onInit() {
  }

  protected afterViewInit() {
  }

  protected onEffect(action: () => void) {
    if (this.isReady()) {
      action.bind(this)();
    }
  }

  protected insertLink(...links: Link[]) {
    links.forEach(link => addLinkToHead(link, this.renderer, getDocument(this.element)));
  }

  protected insertStyle(style: StyleElement): void;
  protected insertStyle(id: string, ...style: (string | Css)[]): void;
  protected insertStyle(id: string | StyleElement, ...style: (string | Css)[]) {
    if (typeof id === 'string') {
      id = { id, css: style } as StyleElement;
    }
    addStyleToHead(id, this.renderer, getDocument(this.element));
  }

  protected overrideEvent(element: string, type: (event: Event) => void): void
  protected overrideEvent(element: Item, type: string, handler: (event: Event) => void): void
  protected overrideEvent(element: string | Item, type: ((event: Event) => void) | string,
                          handler?: (event: Event) => void): void {
    let eventType = '';
    if (typeof element === 'string') {
      eventType = element;
      handler = type as (event: Event) => void;
      element = this.element;
    }
    element?.addEventListener(eventType, event => handler!!(event), true);
  }

  protected putClass(...classname: string[]): void;
  protected putClass(element: Item, ...classname: string[]): void;
  protected putClass(element: Item | string, ...cssClass: string[]) {
    this.execute(element, cssClass, (item, classes) => this.putCSSClasses(item, classes));
  }

  protected removeClass(...classname: string[]): void;
  protected removeClass(element: Item, ...classname: string[]): void;
  protected removeClass(element: Item | string, ...cssClass: string[]) {

    this.execute(element, cssClass, (item, classes) => this.removeCSSClasses(item, classes));
  }

  protected removeStyle(...names: string[]): void;
  protected removeStyle(element: Item, ...names: string[]): void;
  protected removeStyle(element: Item | string, ...names: string[]) {
    this.execute(element, names, (item, names) => this.removeCSSStyle(item, names));
  }

  protected putStyle(element: string): void;
  protected putStyle(element: Record<string, string>): void
  protected putStyle(element: string, value: string): void
  protected putStyle(element: Item, value: string): void
  protected putStyle(element: Item, value: Record<string, string>): void
  protected putStyle(element: Item | Record<string, string> | string,
                     value?: string | Record<string, string>) {
    if (isNotBlank(element)) {
      const styles = {};
      if (typeof element === 'string' && !value) {
        value = styleToRecord(element);
        element = this.element;
      }
      if (element instanceof Element && typeof value === 'string') {
        value = styleToRecord(value);
      }
      this.putCSSStyle(extractElementAndAddStyle(element!!, value, styles) ?? this.element, styles);
    }
  }

  protected addAttribute(name: string, value: any | undefined): void
  protected addAttribute(element: Item, name: string, value: any | undefined): void
  protected addAttribute(element: Item | string, name: any | undefined, value?: any) {
    if (typeof element === 'string') {
      value = name;
      name = element;
      element = this.element;
    }
    addAttribute(element, this.renderer, name, value);
  }

  protected putAttribute(name: string, value: any | undefined): void
  protected putAttribute(element: Item, name: string, value: any | undefined): void
  protected putAttribute(element: Item | string, name: any | undefined, value?: any): void {
    if (typeof element === 'string') {
      value = name;
      name = element;
      element = this.element;
    }
    putAttribute(element, this.renderer, name, value);

  }

  protected removeAttribute(...names: string[]): void
  protected removeAttribute(element: Item, ...names: string[]): void
  protected removeAttribute(element: Item | string, ...names: string[]) {
    if (typeof element === 'string') {
      names.unshift(element);
      element = this.element;
    }
    removeAttribute(element, this.renderer, names);
  }

  protected onRemove() {

  }

  protected isBrowser(): boolean {
    return isPlatformBrowser(this.platform);
  }

  protected isSSR(): boolean {
    return isPlatformServer(this.platform);
  }

  private execute(element: Item | string, classes: string[], apply: (element: Item, classes: string[]) => void): void {
    if (typeof element === 'string') {
      if (element) {
        classes.push(element);
      }
      element = this.element;
    }
    apply(element, classes);
  }

  private putCSSClasses(element: Item, classes: string[]) {
    putClass(element, this.renderer, classes);
  }

  private removeCSSClasses(
    element: Item,
    classes: string[],
  ) {
    removeClass(element, this.renderer, classes);
  }

  private putCSSStyle(element: Item, cssStyles: Record<string, string>) {
    putStyle(element, this.renderer, cssStyles);
  }

  private removeCSSStyle(element: Item, cssStyle: string[]) {
    removeStyle(element, this.renderer, cssStyle);
  }


  protected insertParent(
    element: Element, excludes: ParentExclude, classes?: string, styles?: string): Element
  protected insertParent( element: Element,
    classes: string, styles?: string): Element
  protected insertParent(
    element: Element,
    tag: TagParent,
    excludes?: ParentExclude, classes?: string, styles?: string): Element
  protected insertParent(
    element: Element,
    tag: TagParent,
    classes?: string, styles?: string): Element
  protected insertParent(
    excludes: ParentExclude, classes?: string, styles?: string): Element
  protected insertParent(
    classes: string, styles?: string): Element
  protected insertParent(
    tag: TagParent,
    excludes?: ParentExclude, classes?: string, styles?: string): Element
  protected insertParent(
    tag: TagParent,
    classes?: string, styles?: string): Element
  protected insertParent(
    element: TagParent | ParentExclude | string | Element = this.element,
    tag: TagParent | ParentExclude | string = '',
    excludes: ParentExclude | string = '',
    classes: string = '',
    styles: string = ''): Element {
    if (!(element instanceof Element)) {
      styles = classes;
      classes = excludes as string;
      excludes = tag;
      tag = element;
      element = this.element;
    }
    if (typeof tag === 'string') {
      if (!isTag(tag)) {
        styles = classes;
        classes = excludes as string;
        excludes = tag;
        tag = 'div';
      }
    } else {
      styles = classes;
      classes = excludes as string;
      excludes = tag;
      tag = 'div';
    }
    if (typeof excludes === 'string') {
      styles = classes;
      classes = excludes as string;
      excludes = {
        styles: element.getAttribute('style')?.split(';')
          ?.map(style => style.trimStart().split(':').shift()).filter(style => style) as string[] ?? [],
        classes: element.className.split(' ')
      };
    }
    if (this.parent) {
      this.putClass(this.parent.parent, classes);
      this.putStyle(this.parent.parent, styles);
    } else {
      this.parent = insertParent(element, tag as TagParent, this.renderer, excludes,
        styleToRecord(styles as string), ...(classes === '' ? [] : classes.split(' ')));
    }
    return this.parent.parent;
  }

  protected updateParent(add: false, styles: string[], ...classes: string[]): void
  protected updateParent(add: boolean, ...classes: string[]): void
  protected updateParent(add: true, styles: Record<any, any>, ...classes: string[]): void
  protected updateParent(add: boolean, styles: Record<string, string> | string[] | string, ...classes: string[]) {
    if (typeof styles === 'string') {
      classes.unshift(styles);
      styles = {};
    }
    if (add) {
      this.putClass(this.parent?.parent, ...classes);
      this.putStyle(this.parent?.parent, styles as Record<string, string>);
    } else {
      this.removeClass(this.parent?.parent, ...classes);
      if (Array.isArray(styles)) {
        this.removeStyle(this.parent?.parent, ...styles);
      }
    }
  }

  protected removeParent(): Element {
    const element = removeParent(this.element, this.renderer, this.parent?.id ?? '')
    this.parent = undefined;
    return element;
  }

  private getDefaultClassname() {
    const classname = [`pmeig-${this.element.tagName.toLowerCase()}`];
    const id = this.element.getAttribute('id');
    if (id) {
      classname.push(`${classname[0]}-${id}`);
    }
    return classname;
  }
}
