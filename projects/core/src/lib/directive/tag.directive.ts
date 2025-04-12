import {
  afterNextRender,
  AfterViewChecked,
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import { isNotBlank } from '@pmeig/ng-core';
import { EventHandler } from '../helper/event-handler';
import { extractElementAndAddStyle, styleToRecord, tagParentName } from '../helper/internal.helper';
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
import { insertParent, ParentExclude, removeParent, TagParent } from '../helper/component.helper';


@Directive()
export abstract class TagDirective<T extends Element = Element> extends EventHandler implements AfterViewInit, OnDestroy, OnInit, AfterViewChecked {
  readonly element: T;
  protected renderer = inject(Renderer2);
  protected ready = false
  private platform = inject(PLATFORM_ID);
  readonly ignore = input<'' | undefined>(undefined, {alias: 'pmeig-ignore'});
  private attributes: {
    class: string,
    style: string
  } = {
    class: '',
    style: ''
  }


  protected constructor(
    elementRef: ElementRef<T> = inject(ElementRef)
  ) {
    super();
    this.element = elementRef.nativeElement;
    if (this.isSSR()) {
      afterNextRender(
        () => {
          if (this.ignore() !== '') {
            this.applyInit()
          }
        })
    }
  }

  ngOnInit(): void {
    if (this.isBrowser() && this.ignore() !== '') {
      this.applyInit()
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser() && this.ignore() !== '') {
      this.applyAfterViewInit()
    }
  }

  ngAfterViewChecked(): void {
    if ((this.isBrowser() || this.ready) && this.ignore() !== '') {
      this.onChange();
    }
  }

  ngOnDestroy(): void {
    this.clearEvent();
  }

  protected onInit() {
  }

  protected afterViewInit() {

  }

  protected onChange() {

  }

  protected applyAfterViewInit() {
    this.afterViewInit()
  }

  protected applyInit() {
    this.init();
    this.onInit()
    this.attributes = {
      class: this.element.className,
      style: this.element.getAttribute('style') ?? ''
    }
  }

  protected effect(action: () => void) {
    effect(() => this.refresh(action))
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
    classes: string[]
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
    tag: TagParent | ParentExclude | string = 'div',
    excludes: ParentExclude | string = '',
    classes: string = '',
    styles: string = ''): Element {
    if (typeof tag === 'string') {
      if (!tagParentName.includes(tag)) {
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
      excludes = {};
    }
    return insertParent(this.element, tag, this.renderer, excludes, styleToRecord(styles as string), ...(classes === '' ? [] : classes.split(' ')));
  }

  protected removeParent(classes: string = '', styles: string = ''): Element {
    return removeParent(this.element, this.renderer, this.attributes, styles.length > 0 ? styles.split(':') : [],
      ...(classes === '' ? [] : classes.split(' ')));
  }

  protected refresh(action: () => void) {
    if (this.ready && this.ignore() !== '') {
      action.bind(this)()
    }
  }

  private init() {
    this.putClass(...this.getDefaultClassname());
    this.ready = true;
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
