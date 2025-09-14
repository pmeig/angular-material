import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  input,
  QueryList,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {
  BooleanAttribute,
  emptyBooleanAttribute,
  EmptyBooleanAttribute,
  signalRecord,
  SizeAttribute,
  timeoutAttribute,
  TimeoutAttribute
} from '@pmeig/ng-material-core';
import { HasChildrenDirective, Nullable, Timeout } from '@pmeig/ng-core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { BTagComponent } from '@pmeig/ngb-core';
import { ButtonMaterial } from '@pmeig/ngb-button';
import { Modal } from '../../modal';

const TIMEOUT_ANIMATION = 170;

interface ModalTimeout {
  animation: {
    show?: string,
    static?: string,
  };
  close?: string
}

@Component({
  selector: 'modal',
  imports: [
    ButtonMaterial,
    NgClass,
    NgTemplateOutlet,
    HasChildrenDirective
  ],
  templateUrl: './b-modal.component.html',
  styleUrl: './b-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalMaterial extends BTagComponent implements Modal {

  private timeoutConfig: ModalTimeout = {
    animation: {}
  };


  title = input<string>();
  show = input<boolean, BooleanAttribute>(false, { transform: booleanAttribute });
  animation = input<'zoom'| 'fade'>('zoom');
  cross = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute});
  backdrop = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute});
  closeOutside = input<boolean, BooleanAttribute>(true, {transform: booleanAttribute, alias: 'close-outside'});
  fullscreen = input<'modal-fullscreen-size-down' | 'modal-size', EmptyBooleanAttribute>('modal-size',
    {transform: fullscreen => emptyBooleanAttribute(fullscreen) ? 'modal-fullscreen-size-down' : 'modal-size'});
  timeout = input<Nullable<Timeout>, TimeoutAttribute>(undefined, {transform: timeoutAttribute})
  sizeAttribute = input<SizeAttribute>(undefined, {alias: 'size'});
  size = computed(() => this.compileClassSize());
  center = input<boolean, EmptyBooleanAttribute>(true, {transform: emptyBooleanAttribute});
  scrollable = input<boolean, EmptyBooleanAttribute>(true, {transform: emptyBooleanAttribute});




  protected display = signalRecord({
    show: false,
    container: false,
    animation: {
      static: false
    }
  });

  @ContentChildren('header') protected headers!: QueryList<TemplateRef<any>>;
  @ContentChildren('footer') protected footers!: QueryList<TemplateRef<any>>;
  @ContentChildren(TemplateRef) private modalBodies!: QueryList<TemplateRef<any>>;
  @ContentChildren('btn') protected buttons!: QueryList<TemplateRef<any>>;


  constructor(private viewContainerRef: ViewContainerRef) {
    super();
    this.viewContainerRef.clear();
    this.effect(this.openOrClose);
  }

  close() {
    if (this.display.show()) {
      this.clearTimeout(this.timeoutConfig.close);
      this.timeoutConfig.close = undefined;
      this.clearTimeout(this.timeoutConfig.animation.show);
      this.display.show.set(false);
      this.timeoutConfig.animation.show = this.addTimeout(() => this.display.container.set(false), TIMEOUT_ANIMATION).id;
    }
  }

  open() {
    if (!this.display.show()) {
      this.display.container.update(() => true);
      this.clearTimeout(this.timeoutConfig.animation.show);
      this.timeoutConfig.animation.show = this.addTimeout(() => this.display.show.set(true), TIMEOUT_ANIMATION).id;
      this.applyTimeout();
    }
  }

  get visible() {
    return this.display.show;
  }

  get reference() {
    return this.name();
  }

  protected get bodies() {
    return this.modalBodies
      .filter(item => [...this.headers, ...this.footers, ...this.buttons]
        .every(header => header.elementRef.nativeElement !== item.elementRef.nativeElement));
  }

  protected get closeBind() {
    return this.close.bind(this);
  }

  protected closeByClick(modalTemplate: HTMLDivElement, event: MouseEvent) {
    let apply = () => {
      this.clearTimeout(this.timeoutConfig.animation.static);
      this.display.animation.static.set(true);
      this.timeoutConfig.animation.static = this.addTimeout(() => this.display.animation.static.set(false), TIMEOUT_ANIMATION).id;
    };
    if (this.closeOutside()) {
      apply = () => this.close();
    }
    this.outside(modalTemplate, event, apply);
  }

  private outside(modalTemplate: HTMLDivElement, event: MouseEvent, apply: () => void) {
    const position = modalTemplate.getBoundingClientRect();
    if (event.x < position.x || event.x > position.x + position.width) {
      apply();
    } else if (event.y <= position.y || event.y >= position.y + position.height) {
      apply();
    }
  }

  private openOrClose() {
    let action = this.close;
    if (this.show()) {
      action = this.open;
    }

    setTimeout(() => action.bind(this)());
  }

  private applyTimeout() {
    const timeout = this.timeout();
    this.clearTimeout(this.timeoutConfig.close);
    if (timeout) {
      this.timeoutConfig.close = this.addTimeout(() => this.close(), timeout).id;
    }
  }

  private compileClassSize() {
    let template: string = this.fullscreen();
    let size = this.sizeAttribute();
    const isFullscreen = template !== 'modal-size';
    if (size) {
      if (!isFullscreen) {
        size = size.endsWith('xs') ? 'sm' : size === 'xxl' ? 'xl' : size;
      }
    } else {
      template = isFullscreen ? 'modal-size' : '';
    }
    return template.replace('size', size ?? '');
  }
}
