import {booleanAttribute, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {BooleanAttribute, SizeAttribute, TagParentDirective} from "@ngp-material/core";

@Directive({
  standalone: true,
  selector: '[b-btn-group]'
})
export class BBtnGroup extends TagParentDirective {
  private lastSize: SizeAttribute
  @Input() size: SizeAttribute;
  @Input() vertical: BooleanAttribute = false
  @Input() margin: string | undefined

  private elements: Element[] = []

  protected override afterViewInit() {
    if (this.lastSize) {
      this.removeClass(`btn-group-${this.lastSize}`)
    }
    this.lastSize = this.size
    if (this.size) {
      this.putClass(`btn-group-${this.size}`);
    }
    const isVertical = booleanAttribute(this.vertical)
    if (isVertical) {
      this.putClass(`btn-group-vertical`);
      this.removeClass('btn-group')
    } else {
      this.removeClass(`btn-group-vertical`);
      this.putClass(`btn-group`)
    }
    this.elements = this.elements.length > 0 ? this.elements : this.getChildren();
    if (this.margin && this.elements.length > 0) {
      const addMargin = this.elements.slice(1)
      if (isVertical) {
        addMargin.forEach(value => this.putStyle(value, {'margin-top': this.margin!!}))
      } else {
        addMargin.forEach(value => this.putStyle(value, {'margin-left': this.margin!!}))
      }
    }
  }

  constructor(element: ElementRef<Element>, renderer: Renderer2) {
    super(element, renderer)
  }
}
