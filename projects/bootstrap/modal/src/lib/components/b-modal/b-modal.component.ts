import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Nullable, Timeout } from '@pmeig/ng-core';
import { Modal } from '../../modal';
import {
  BooleanAttribute,
  Size,
  SizeAttribute,
  state,
  TagComponent,
  timeoutAttribute,
  TimeoutAttribute
} from '@pmeig/ng-material-core';
import { ButtonMaterial } from '@pmeig/ngb-btn';

@Component({
  selector: 'modal',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgClass,
    ButtonMaterial
  ],
  templateUrl: './b-modal.component.html',
  styleUrl: './b-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BModalComponent extends TagComponent implements Modal, OnInit {
  @ContentChild('header') protected header?: TemplateRef<any> | any
  @ContentChild('body') protected body?: TemplateRef<any> | any
  @ContentChild('footer') protected footer?: TemplateRef<any> | any

  private state = state({
    visible: {
      show: false,
      display: false,
      enabled: {
        header: true,
        body: true,
        footer: true,
        backdrop: true,
        cross: true
      }
    },
    animations: {
      static: false,
      type: 'zoom' as 'zoom' | 'fade'
    },
    text: {
      title: undefined as string | undefined
    },
    settings: {
      center: true,
      scrollable: true,
      closeOutside: true,
      size: ''
    }
  })
  private isFullscreen = false
  private lastSize?: Size
  private timeBeforeClose?: Timeout;
  private onInitEnable = false
  private onStart = {
    animation: undefined as Nullable<string>,
    timeout: undefined as Nullable<string>,
    static: undefined as Nullable<string>
  }

  @Input('animation-type')
  set animationType(type: 'zoom' | 'fade') {
    this.animations.type = type
  }

  @Input()
  set enable(enable: BooleanAttribute) {
    this.onInitEnable = booleanAttribute(enable)
  }


  @Input()
  set timeout(timeout: TimeoutAttribute) {
    this.timeBeforeClose = timeoutAttribute(timeout)
    if (this.onStart.timeout && this.timeBeforeClose) {
      this.clearTimeout(this.onStart.timeout)
      this.onStart.timeout = this.appendTimeout(this.timeBeforeClose, () => this.close()).id
    }
  }

  @Input()
  set cross(cross: BooleanAttribute) {
    this.enabled.cross = booleanAttribute(cross)
  }

  @Input()
  set backdrop(backdrop: BooleanAttribute) {
    this.enabled.backdrop = booleanAttribute(backdrop)
  }

  @Input({alias: 'close-outside'})
  set closeOutsideEnabled(closeOutside: BooleanAttribute) {
    this.settings.closeOutside = booleanAttribute(closeOutside)
  }

  @Input()
  set size(size: SizeAttribute) {
    let template = this.isFullscreen ? 'modal-fullscreen-size-down' : 'modal-size'
    if (size) {
      if (!this.isFullscreen) {
        size = size.endsWith('xs') ? 'sm' : size === 'xxl' ? 'xl' : size
      }
    } else {
      template = this.isFullscreen ? 'modal-fullscreen' : ''
    }
    this.lastSize = size
    this.settings.size = size ? template.replace('size', size) : template
  }

  @Input()
  set fullscreen(fullscreen: BooleanAttribute) {
    this.isFullscreen = booleanAttribute(fullscreen)
    this.size = this.lastSize
  }

  @Input()
  set title(title: string) {
    this.text.title = title
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.onInitEnable) {
      this.open()
    }
  }

  protected get opening() {
    return this.open.bind(this)
  }

  protected isTemplate(item: TemplateRef<any> | any): boolean {
    return item instanceof TemplateRef
  }

  protected get closing() {
    return this.close.bind(this)
  }

  protected get text() {
    return this.state.text
  }

  close() {
    if (this.visible.show) {
      this.clearTimeout(this.onStart.timeout)
      this.onStart.timeout = undefined
      this.clearTimeout(this.onStart.animation)
      this.visible.show = false
      setTimeout(() => this.visible.display = false, 170)
      this.onStart.animation = this.appendTimeout(170, () => this.visible.display = false).id
    }
  }

  open() {
    if (!this.visible.show) {
      this.visible.display = true
      this.clearTimeout(this.onStart.animation)
      this.onStart.animation = this.appendTimeout(170, () => this.visible.show = true).id
      setTimeout(() => this.visible.show = true, 170)
      if (this.timeBeforeClose) {
        this.onStart.timeout = this.appendTimeout(this.timeBeforeClose, () => this.close()).id
      }
    }
  }

  get opened(): boolean {
    return this.visible.show;
  }

  protected get visible() {
    return this.state.visible
  }

  protected get enabled() {
    return this.visible.enabled
  }

  protected get animations() {
    return this.state.animations
  }

  protected get settings() {
    return this.state.settings
  }

  protected closeByClick(modalTemplate: HTMLDivElement, event: MouseEvent) {
    let apply = () => {
      this.clearTimeout(this.onStart.static)
      this.animations.static = true
      this.onStart.static = this.appendTimeout(170, () => this.animations.static = false).id
    }
    if (this.settings.closeOutside) {
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
}
