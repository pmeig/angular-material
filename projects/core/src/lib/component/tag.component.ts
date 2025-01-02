import {
  afterNextRender,
  AfterViewInit,
  Component,
  computed,
  HostListener,
  inject,
  Input,
  PLATFORM_ID
} from '@angular/core';
import { ref, state } from '../annotation/signal.helper';
import { Listener } from './listener';
import { classesCss, stylesCss } from '../helper/style.helper';
import { isPlatformServer } from '@angular/common';

@Component({template: ''})
export abstract class TagComponent extends Listener implements AfterViewInit {
  @Input()
  name = ref(this, 'name', '')
  private platform = inject(PLATFORM_ID)
  protected isHovered = ref(this, 'isHovered', false)
  protected classes = ref(this, 'classes', computed(() =>  `${this.properties.classes} ${this.properties.ngClasses}`))
  protected styles = ref(this, 'styles', computed(() =>  `${this.properties.styles ? this.properties.styles + ';' : ''}${this.properties.ngStyles}`))

  private properties = state({
    classes: '',
    styles: '',
    ngStyles: '',
    ngClasses: ''
  })

  protected constructor() {
    super();
    if (this.isSSR) {
      afterNextRender(() => this.afterViewInit())
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.afterViewInit()
    }
  }



  @Input('classes')
  set _classes(classes: string) {
    this.properties.classes = classes;
  }

  @Input('styles')
  set _styles(styles: string) {
    this.properties.styles = styles;
  }

  @Input()
  set ngStyles(styles: Record<string, string>) {
    this.properties.ngStyles = stylesCss(styles)
  }

  @Input()
  set ngClasses(classes: Record<string, unknown>) {
    this.properties.ngClasses = classesCss(classes)
  }

  @HostListener('mouseenter')
  hoverEvent() {
    this.isHovered = true
  }

  @HostListener('mouseleave')
  leaveEvent() {
    this.isHovered = false
  }

  protected get isSSR() {
    return isPlatformServer(this.platform)
  }

  protected get isBrowser() {
    return isPlatformServer(this.platform)
  }

  protected afterViewInit() {

  }
}
