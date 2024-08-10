import {Component, computed, Directive, HostListener, input, Input} from "@angular/core";
import {ref, state} from "../annotation/signal.helper";
import {Listener} from "./listener";
import {isNotBlank} from "@ngp/core";
import {classesCss, stylesCss} from "../helper/style.helper";

@Component({template: ''})
export abstract class TagComponent extends Listener {
  @Input()
  name = ref(this, 'name', '')
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
}
