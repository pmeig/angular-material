import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  effect,
  ElementRef,
  Input,
  input,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  BooleanAttribute,
  signalRecord,
  SizeAttribute,
  timeoutAttribute,
  TimeoutAttribute
} from '@pmeig/ng-material-core';
import { HasChildrenDirective, Timeout } from '@pmeig/ng-core';
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
  close: {
    ms?: Timeout,
    id?: string
  },
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
export class BModalComponent extends BTagComponent implements Modal {

  private lastSize: SizeAttribute

  private timeout: ModalTimeout = {
    close: {
    },
    animation: {}
  }


  title = input<string>()
  show = input<boolean, BooleanAttribute>(false, {transform: booleanAttribute})

  protected display = signalRecord({
    show: false,
    container: false,
    backdrop: true,
    content: {
      header: {
        active: true,
        cross: true
      },
    }
  })

  protected settings = signalRecord({
    animations: {
      static: false,
      type: 'zoom'
    },
    size: {
      value: '',
      fullscreen: false,
    },
    center: true,
    scrollable: true,
    closeOutside: true,
  })

  @Input('animation-type')
  set animationType(type: 'zoom' | 'fade') {
    this.settings.animations.type.set(type)
  }


  @Input('timeout')
  set setTimeout(timeout: TimeoutAttribute) {
    this.timeout.close.ms = timeoutAttribute(timeout)
    if (this.timeout.close.id && this.timeout.close.ms) {
      this.clearTimeout(this.timeout.close.id)
      this.timeout.close.id = this.addTimeout(() => this.close(), this.timeout.close.ms).id
    }
  }

  @Input()
  set cross(cross: BooleanAttribute) {
    this.display.content.header.cross.set(booleanAttribute(cross))
  }

  @Input()
  set backdrop(backdrop: BooleanAttribute) {
    this.display.backdrop.set(booleanAttribute(backdrop))
  }

  @Input({alias: 'close-outside'})
  set closeOutsideEnabled(closeOutside: BooleanAttribute) {
    this.settings.closeOutside.set(booleanAttribute(closeOutside))
  }

  @Input()
  set size(size: SizeAttribute) {
    const isFullscreen = this.settings.size.fullscreen()
    let template = isFullscreen ? 'modal-fullscreen-size-down' : 'modal-size'
    if (size) {
      if (!isFullscreen) {
        size = size.endsWith('xs') ? 'sm' : size === 'xxl' ? 'xl' : size
      }
    } else {
      template = isFullscreen ? 'modal-fullscreen' : ''
    }
    this.lastSize = size
    this.settings.size.value.set(size ? template.replace('size', size) : template)
  }

  @Input()
  set fullscreen(fullscreen: BooleanAttribute) {
    this.settings.size.fullscreen.set(booleanAttribute(fullscreen))
    this.size = this.lastSize
  }

  @ContentChildren('header') protected headers!: QueryList<TemplateRef<any>>
  @ContentChildren('footer') protected footers!: QueryList<TemplateRef<any>>
  @ContentChildren(TemplateRef) private modalBodies!: QueryList<TemplateRef<any>>
  @ContentChildren('btn') protected buttons!: QueryList<TemplateRef<any>>

  @ViewChild('header')
  protected set header(header: ElementRef<HTMLDivElement>) {
    if (header) {
      const content = header.nativeElement.children.item(0);
      const btnGroup = header.nativeElement.children.item(1);
      this.display.content.header.active.set((content?.children?.length ?? 0) > 0 || (btnGroup?.children?.length ?? 0) > 0)
    }
  }


  constructor(private viewContainerRef: ViewContainerRef) {
    super();
    this.viewContainerRef.clear()
    effect(() => this.openOrClose())
  }

  close() {
    if (this.display.show()) {
      this.clearTimeout(this.timeout.close.id)
      this.timeout.close.id = undefined
      this.clearTimeout(this.timeout.animation.show)
      this.display.show.set(false)
      this.timeout.animation.show = this.addTimeout(() => this.display.container.set(false), TIMEOUT_ANIMATION).id
      this.display.content.header.active.set(true)
    }
  }

  open() {
    if (!this.display.show()) {
      this.display.container.update(() => true)
      this.clearTimeout(this.timeout.animation.show)
      this.timeout.animation.show = this.addTimeout(() => this.display.show.set(true), TIMEOUT_ANIMATION).id
      if (this.timeout.close.ms) {
        this.timeout.close.id = this.addTimeout(() => this.close(), this.timeout.close.ms).id
      }
    }
  }

  get visible() {
    return this.display.show()
  }

  get reference() {
    return this.name()
  }

  protected get bodies() {
    return this.modalBodies
      .filter(item => [...this.headers, ...this.footers, ...this.buttons]
        .every(header => header.elementRef.nativeElement !== item.elementRef.nativeElement))
  }

  protected get closeBind() {
    return this.close.bind(this)
  }

  protected closeByClick(modalTemplate: HTMLDivElement, event: MouseEvent) {
    let apply = () => {
      this.clearTimeout(this.timeout.animation.static)
      this.settings.animations.static.set(true)
      this.timeout.animation.static = this.addTimeout(() => this.settings.animations.static.set(false), TIMEOUT_ANIMATION).id
    }
    if (this.settings.closeOutside()) {
      apply = () => this.close()
    }
    this.outside(modalTemplate, event, apply)
  }

  private outside(modalTemplate: HTMLDivElement, event: MouseEvent, apply: () => void) {
    const position = modalTemplate.getBoundingClientRect()
    if (event.x < position.x || event.x > position.x + position.width) {
      apply()
    } else if (event.y <= position.y || event.y >= position.y + position.height) {
      apply()
    }
  }

  private openOrClose() {
    let action = this.close
    if (this.show()) {
      action = this.open
    }

    setTimeout(() => action.bind(this)())
  }
}
