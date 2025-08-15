import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  Input,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  signal
} from '@angular/core';
import { Listener } from './listener';
import { classesCss, stylesCss } from '../helper/style.helper';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { signalRecord } from '../helper/signal/signal.helper';
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
import { getDocument } from '../helper/browser.helper';
import { isNotBlank } from '@pmeig/ng-core';
import { extractElementAndAddStyle, styleToRecord } from '../helper/internal.helper';


@Component({ template: '' })
export abstract class TagComponent extends Listener implements AfterViewInit, OnInit {

  name = input('');
  private platform = inject(PLATFORM_ID);

  protected element: Element;
  protected renderer = inject(Renderer2);
  protected isHovered = signal(false);
  protected classes = computed(() => `${this.properties.classes()} ${this.properties.ngClasses()}`);
  protected styles = computed(() => `${this.properties.styles() ? this.properties.styles() + ';' : ''}${this.properties.ngStyles()}`);

  private properties = signalRecord({
    classes: '',
    styles: '',
    ngStyles: '',
    ngClasses: '',
  });
  protected ready = false;

  protected constructor(elementRef: ElementRef = inject(ElementRef)) {
    super();
    this.element = elementRef.nativeElement;
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.onInit();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.afterViewInit();
      this.ready = true;
    }
  }


  @Input('classes')
  set _classes(classes: string) {
    this.properties.classes.set(classes);
  }

  @Input('styles')
  set _styles(styles: string) {
    this.properties.styles.set(styles);
  }

  @Input()
  set ngStyles(styles: Record<string, string>) {
    this.properties.ngStyles.set(stylesCss(styles));
  }

  @Input()
  set ngClasses(classes: Record<string, unknown>) {
    this.properties.ngClasses.set(classesCss(classes));
  }

  @HostListener('mouseenter')
  hoverEvent() {
    this.isHovered.set(true);
  }

  @HostListener('mouseleave')
  leaveEvent() {
    this.isHovered.set(false);
  }

  protected get isSSR() {
    return isPlatformServer(this.platform);
  }

  protected get isBrowser() {
    return isPlatformBrowser(this.platform);
  }

  protected afterViewInit() {

  }

  protected onInit(): void {
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

  protected effect(action: () => void) {
    effect(() => this.refresh(action));
  }

  protected refresh(action: () => void) {
    if (this.ready) {
      action.bind(this)();
    }
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
}
