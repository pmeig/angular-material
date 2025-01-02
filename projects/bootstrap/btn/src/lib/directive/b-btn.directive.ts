import { booleanAttribute, Directive, Input, OnInit } from '@angular/core';
import {
  BooleanAttribute,
  ColorAttribute,
  colorToString,
  isColor,
  rgbToString,
  Size,
  TagDirective,
  toRGB
} from '@pmeig/ng-material-core';

@Directive({
  selector: 'button, [btn]',
  standalone: true
})
export class BBtnDirective extends TagDirective implements OnInit {
  private state = {
    disabled: false,
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
  set disabled(value: BooleanAttribute | '') {
    this.state.disabled = value === '' || booleanAttribute(value);
    this.refreshDisabled();
  }

  @Input()
  set size(value: Size | undefined) {
    if (this.state.size) {
      this.removeClass(`btn-${this.state.size}`);
    }
    this.state.size = value ?? '';
    this.refreshSize();
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
    this.refreshColor();
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
    this.putClass('btn');
    this.refreshDisabled();
    this.refreshSize();
    this.refreshColor();
  }

  protected eventClick(event: Event) {
    if (this.state.disabled) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  private refreshSize() {

    const classes = [];
    if (this.state.size) {
      classes.push(`btn-${this.state.size}`);
    }
  }

  private refreshColor() {
    const classes = [];
    if (this.state.color.classes) {
      classes.push(this.state.color.classes);
    }
    this.putClass(...classes);
  }

  private refreshDisabled() {
    if (this.state.disabled) {
      this.renderer.setAttribute(this.element, 'disabled', '');
    } else {
      this.renderer.removeAttribute(this.element, 'disabled');
    }
  }
}
