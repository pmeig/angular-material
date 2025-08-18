import {
  AfterViewInit,
  Directive,
  effect,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  signal,
  TemplateRef,
  ViewContainerRef
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
import { BehaviorSubject, debounceTime, filter, Observable, of, take } from 'rxjs';


@Directive()
export abstract class TagTemplateDirective extends EventHandler implements AfterViewInit, OnDestroy, OnInit {
  protected renderer = inject(Renderer2);
  protected viewContainerRef = inject(ViewContainerRef);
  element: Element = this.renderer.createElement('div') as Element;
  protected display = false;
  protected isReady = signal(false);


  private platform = inject(PLATFORM_ID);
  private lastLifecycleExecutor = new BehaviorSubject(false).pipe(debounceTime(50), take(1));


  protected constructor(
    private readonly template: TemplateRef<any> = inject(TemplateRef<any>),
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.lastLifecycleExecutor.subscribe(() => this.onInit());
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser()) {
      this.lastLifecycleExecutor.subscribe(() => {
        this.afterViewInit();
        this.isReady.set(true);
      });
    }
  }

  ngOnDestroy(): void {
    this.clearEvent();
  }


  protected effect(action: () => void) {
    effect(() => this.onEffect(action));
  }

  protected onShow() {

  }

  protected onHide(): Observable<boolean> {
    return of();
  }

  protected show(context: any = {}) {
    if (!this.display) {
      this.element = this.viewContainerRef.createEmbeddedView(this.template, context).rootNodes[0] as Element;
      this.putClass('opacity-0');
      setTimeout(() => {
        this.removeClass('opacity-0');
        this.onShow()
      });
    }
    this.display = true;
  }

  protected hide() {
    if (this.display) {
      this.onHide().pipe(filter(hiding => hiding)).subscribe(() => {
        this.viewContainerRef.clear();
        this.display = false;
      })
    }
  }

  protected onInit() {
  }

  protected afterViewInit() {

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


  protected onEffect(action: () => void) {
    if (this.isReady()) {
      action.bind(this)();
    }
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
}
