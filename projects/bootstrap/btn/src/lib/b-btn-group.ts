import {booleanAttribute, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {BooleanAttribute, SizeAttribute, TagDirective} from "@ngp-material/core";

@Directive({
  standalone: true,
  selector: '[b-btn-group]'
})
export class BBtnGroup extends TagDirective {
  private lastSize: SizeAttribute
  @Input() size: SizeAttribute;
  @Input() vertical: BooleanAttribute = false
  @Input() margin: string | undefined

  private firstChildren: Element[] = []

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
    this.firstChildren = this.firstChildren.length > 0 ? this.firstChildren : this.getChildren();
    if (this.margin && this.firstChildren.length > 0) {
      const addMargin = this.firstChildren.slice(1)
      if (isVertical) {
        addMargin.forEach(value => this.putStyle(value, 'margin-top', this.margin!!))
      } else {
        addMargin.forEach(value => this.putStyle(value, 'margin-left', this.margin!!))
      }
    }
  }

  constructor(element: ElementRef<Element>, renderer: Renderer2) {
    super(element, renderer)
  }

  private getChildren() {
    const elements = []
    const children = this.element!!.children
    let iterator = this.element!!.childElementCount
    while (iterator--) {
      elements.unshift(children[iterator])
    }
    return elements
  }
}
