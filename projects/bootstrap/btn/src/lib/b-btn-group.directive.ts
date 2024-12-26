import {booleanAttribute, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {BooleanAttribute, SizeAttribute, TagParentDirective} from "@ngp-material/core";

@Directive({
  standalone: true,
  selector: '[b-btn-group]'
})
export class BBtnGroupDirective extends TagParentDirective {
  private lastSize: SizeAttribute
  @Input() size: SizeAttribute;
  @Input() vertical: BooleanAttribute = false
  @Input() gap: string | undefined

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
    this.elements.forEach(element => this.putClass(element, 'btn'))
    if (this.gap && this.elements.length > 0) {
      const addMargin = this.elements.slice(1)
      if (isVertical) {
        addMargin.forEach(value => {
          this.putStyle(value, {'margin-top': this.gap!!})
          this.removeStyle(value, 'margin-left')
        })
      } else {
        addMargin.forEach(value => {
          this.putStyle(value, {'margin-left': this.gap!!})
          this.removeStyle(value, 'margin-right')
        })
      }
    }
  }

  constructor(element: ElementRef<Element>, renderer: Renderer2) {
    super(element, renderer)
  }
}
