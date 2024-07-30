import {Component, HostListener, Input} from "@angular/core";
import {State} from "../annotation/signal.helper";
import {Listener} from "./listener";
import {isNotBlank} from "@ngp/core";

@Component({ template: '' })
export abstract class TagComponent extends Listener {
  @State()
  @Input()
  name?: string
  @State()
  isHovered: boolean = false;
  @State()
  private properties = {
    classes: '',
    styles: '',
    ngStyles: '',
    ngClasses: ''
  }

  get classes(): string {
    return `${this.properties.classes} ${this.properties.ngClasses}`
  }

  get styles(): string {
    return `${this.properties.styles ? this.properties.styles + ';' : ''}${this.properties.ngStyles}`
  }

  @Input()
  set classes(classes: string) {
    this.properties.classes = classes;
  }

  @Input()
  set styles(styles: string) {
    this.properties.styles = styles;
  }

  @Input()
  set ngStyles(styles: Record<string, unknown>) {
    this.properties.ngStyles = Object.entries(styles)
      .filter(value => isNotBlank(value[1]) && value[1])
      .map(value => `${value[0]}: ${value[1]}`)
      .join('; ')
  }

  @Input()
  set ngClasses(classes: Record<string, unknown>) {
    this.properties.ngClasses = Object.entries(classes)
      .filter(([_, value]) => isNotBlank(value) && value)
      .map(([name]) => name)
      .join('; ')
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
