import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {isNotBlank, Optional} from "@ngp/core";
import {EventHandler} from "../helper/event-handler";
import {extractElementAndAddStyle, styleToRecord} from "../helper/internal.helper";
import {stylesCss} from "../helper/style.helper";
import {addStyleToHead, Css, StyleElement} from "../helper/css.helper";


export type Item = Optional<Element>;

@Directive()
export abstract class TagDirective<T extends Element = Element> extends EventHandler implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  protected isViewInit = false

  readonly element: T;

  protected constructor(
    elementRef: ElementRef<T>,
    protected renderer: Renderer2,
    listenChange: boolean = false
  ) {
    super()
    this.element = elementRef.nativeElement;
    if (listenChange) {
      this.onChange(
        this.renderer.parentNode(this.element),
        (mutations) => {
          if (
            mutations
              ?.find((mutation) => this.foundElement(mutation.addedNodes))
          ) {
            this.ngAfterViewInit();
          } else if (mutations?.find((mutation) => this.foundElement(mutation.removedNodes))) {
            this.onRemove()
          }
        },
        { childList: true, subtree: true },
      );
    }
  }

  protected onInit() {
  }

  // noinspection JSUnusedLocalSymbols
  protected onChanges(changes: SimpleChanges) {
  }

  protected insertStyle(style: StyleElement): void;
  protected insertStyle(id: string, ...style: (string | Css)[]): void;
  protected insertStyle(id: string | StyleElement, ...style: (string | Css)[]) {
    if (typeof id === 'string') {
      id = {id, css: style} as StyleElement
    }
    addStyleToHead(id, this.renderer, this.element.ownerDocument);
  }

  ngOnInit(): void {
    this.onInit()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refresh()
    this.onChanges(changes)
  }

  ngOnDestroy(): void {
    this.clearEvent()
  }
  protected abstract afterViewInit(): void;

  ngAfterViewInit(): void {
    this.isViewInit = true
    this.afterViewInit();
  }

  protected refresh() {
    if (this.isViewInit) {
      this.ngAfterViewInit()
    }
  }

  protected overrideEvent(element: string, type: (event: Event) => void): void
  protected overrideEvent(element: Item, type: string, handler: (event: Event) => void): void
  protected overrideEvent(element: string | Item, type: ((event: Event) => void) | string,
                          handler?: (event: Event) => void): void {
    let eventType = ''
    if (typeof element === 'string') {
      eventType = element
      handler = type as (event: Event) => void
      element = this.element
    }
    element?.addEventListener(eventType, event => handler!!(event), true)
  }

  protected putClass(...classname: string[]): void;
  protected putClass(element: Item, ...classname: string[]): void;
  protected putClass(element: Item | string, ...cssClass: string[]) {
    this.execute(element, cssClass, (item, classes) => this.putCSSClasses(item, classes))
  }

  protected removeClass(...classname: string[]): void;
  protected removeClass(element: Item, ...classname: string[]): void;
  protected removeClass(element: Item | string, ...cssClass: string[]) {

    this.execute(element, cssClass, (item, classes) => this.removeCSSClasses(item, classes))
  }

  protected removeStyle(...names: string[]): void;
  protected removeStyle(element: Item, ...names: string[]): void;
  protected removeStyle(element: Item | string, ...names: string[]) {
    this.execute(element, names, (item, names) => this.removeCSSStyle(item, names))
  }

  protected putStyle(element: string): void;
  protected putStyle(element: Record<string, string>): void
  protected putStyle(element: string, value: string): void
  protected putStyle(element: Item, value: string): void
  protected putStyle(element: Item, value: Record<string, string>): void
  protected putStyle(element: Item | Record<string, string> | string,
                             value?: string | Record<string, string>) {
    if (isNotBlank(element)) {
      const styles = {}
      if (typeof element === 'string' && !value) {
        value = styleToRecord(element)
        element = this.element
      }
      if (element instanceof Element && typeof value === 'string') {
        value = styleToRecord(value)
      }
      this.putCSSStyle(extractElementAndAddStyle(element!!, value, styles) ?? this.element, styles)
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

  protected removeAttribute(...names: string[]): void
  protected removeAttribute(element: Item, ...names: string[]): void
  protected removeAttribute(element: Item | string, ...names: string[]) {
    if (typeof element === 'string') {
      names.unshift(element)
      element = this.element
    }
    names.forEach(name => this.renderer.removeAttribute(element, name))
  }

  protected elementChange(element: Item, callback: (element: Item) => void): void {
    if (element) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes') {
            callback(element)
          }
        })
      })
      observer.observe(element, {attributes: true})
    }
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

  private putCSSStyle(element: Item, cssStyles: Record<string, string>) {
    if (element) {
      if (element.nodeType === Node.COMMENT_NODE) {
        element.setAttribute('style', stylesCss(cssStyles));
      } else {
        Object.entries(cssStyles).forEach(([name, value]) => this.renderer.setStyle(element, name, value));
      }
    }
  }

  private removeCSSStyle(element: Item, cssStyle: string[]) {
    if (element) {
      if (element.nodeType === Node.COMMENT_NODE) {
        const styles = element.getAttribute('style')?.split(';')?.map(style => style.split(':').map(part => part.trim()))
          .filter(([name]) => !cssStyle.includes(name))
          .reduce((accumulator, [name, value]) => ({...accumulator, [name]: value}), {})
        if (styles && Object.keys(styles).length > 0) {
          element.setAttribute('style', stylesCss(styles));
        } else {
          element.removeAttribute('style');
        }
      } else {
        cssStyle.forEach(value => this.renderer.removeStyle(element, value));
      }
    }
  }

  private foundElement(nodes: NodeList) {
    let index = nodes.length;
    let item = nodes[--index];
    while (index-- > 0 && item !== this.element) {
      item = nodes[index];
    }
    return item === this.element;
  }

  protected onRemove() {

  }
}
