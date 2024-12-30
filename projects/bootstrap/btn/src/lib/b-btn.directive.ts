import { Directive, Injectable, Input, OnInit } from '@angular/core';
import { ColorAttribute, colorToString, isColor, rgbToString, Size, toRGB } from '@pmeig/ng-material-core';
import { BTagDirective } from '@pmeig/ngb-core';

@Injectable({providedIn: 'root'})
@Directive({
  selector: 'button, [btn]',
  standalone: true
})
export class BBtnDirective extends BTagDirective implements OnInit {
  @Input() disabled = false;
  private state = {
    color: {
      classes: 'btn-primary',
      rgb: ''
    },
    size: ''
  };

  constructor() {
    super();
  }

  @Input()
  set size(value: Size | undefined) {
    if (this.state.size) {
      this.removeClass(`btn-${this.state.size}`);
    }
    this.state.size = value ?? '';
  }

  @Input()
  set color(color: ColorAttribute) {
    if (this.state.color.classes) {
      this.removeClass(this.state.color.classes);
      this.state.color.classes = '';
    } else if (this.state.color.rgb) {
      this.removeStyle('color');
      this.state.color.rgb = '';
    }
    if (isColor(color)) {
      this.state.color.classes = colorToString(color, 'btn');
    } else {
      this.state.color.rgb = rgbToString(toRGB(color));
    }
  }

  private get eventClickBind() {
    return this.eventClick.bind(this);
  }

  override onInit(): void {
    this.overrideEvent('click', this.eventClickBind);
    this.overrideEvent('dblclick', this.eventClickBind);
    this.overrideEvent('submit', this.eventClickBind);
    this.overrideEvent('enter', this.eventClickBind);
  }

  protected override afterViewInit(): void {
    if (this.disabled) {
      this.renderer.setAttribute(this.element, 'disabled', '');
    } else {
      this.renderer.removeAttribute(this.element, 'disabled');
    }
    const classes = [];
    if (this.state.color.classes) {
      classes.push(this.state.color.classes);
    }
    if (this.state.size) {
      classes.push(`btn-${this.state.size}`);
    }
    this.putClass('btn', ...classes);
  }

  protected eventClick(event: Event) {
    if (this.disabled) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
