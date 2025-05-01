import {
  afterNextRender,
  AfterViewInit,
  Component,
  computed,
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
import { addLinkToHead, Link } from '../helper/css.helper';
import { getDocument } from '../helper/browser.helper';


@Component({template: ''})
export abstract class TagComponent extends Listener implements AfterViewInit, OnInit {

  name = input('')
  private platform = inject(PLATFORM_ID)

  protected element: Element
  protected renderer = inject(Renderer2)
  protected isHovered = signal(false)
  protected classes = computed(() =>  `${this.properties.classes} ${this.properties.ngClasses}`)
  protected styles = computed(() =>  `${this.properties.styles ? this.properties.styles + ';' : ''}${this.properties.ngStyles}`)

  private properties = signalRecord({
    classes: '',
    styles: '',
    ngStyles: '',
    ngClasses: ''
  })

  protected constructor(elementRef: ElementRef = inject(ElementRef)) {
    super();
    this.element = elementRef.nativeElement;
    if (this.isSSR) {
      afterNextRender(() => {
        this.onInit()
        this.afterViewInit()
      })
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.onInit()
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.afterViewInit()
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
    this.properties.ngStyles.set(stylesCss(styles))
  }

  @Input()
  set ngClasses(classes: Record<string, unknown>) {
    this.properties.ngClasses.set(classesCss(classes))
  }

  @HostListener('mouseenter')
  hoverEvent() {
    this.isHovered.set(true)
  }

  @HostListener('mouseleave')
  leaveEvent() {
    this.isHovered.set(false)
  }

  protected get isSSR() {
    return isPlatformServer(this.platform)
  }

  protected get isBrowser() {
    return isPlatformBrowser(this.platform)
  }

  protected afterViewInit() {

  }

  protected onInit(): void {

  }

  protected insertLink(...links: Link[]) {
    links.forEach(link => addLinkToHead(link, this.renderer, getDocument(this.element)));
  }
}
