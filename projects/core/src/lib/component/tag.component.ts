import {
  afterNextRender,
  AfterViewInit,
  Component,
  computed,
  HostListener,
  inject,
  input,
  Input,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { Listener } from './listener';
import { classesCss, stylesCss } from '../helper/style.helper';
import { isPlatformServer } from '@angular/common';
import { signalRecord } from '../helper/signal/signal.helper';


@Component({template: ''})
export abstract class TagComponent extends Listener implements AfterViewInit, OnInit {

  name = input('')
  private platform = inject(PLATFORM_ID)
  protected isHovered = signal(false)
  protected classes = computed(() =>  `${this.properties.classes} ${this.properties.ngClasses}`)
  protected styles = computed(() =>  `${this.properties.styles ? this.properties.styles + ';' : ''}${this.properties.ngStyles}`)

  private properties = signalRecord({
    classes: '',
    styles: '',
    ngStyles: '',
    ngClasses: ''
  })

  protected constructor() {
    super();
    if (this.isSSR) {
      afterNextRender(() => this.onInit())
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
    return isPlatformServer(this.platform)
  }

  protected afterViewInit() {

  }

  protected onInit(): void {

  }
}
