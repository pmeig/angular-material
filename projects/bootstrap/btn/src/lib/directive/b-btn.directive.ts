import { booleanAttribute, Directive, Input, OnInit } from '@angular/core';
import {
  BooleanAttribute,
  ColorAttribute,
  colorToString,
  Empty,
  emptyBooleanAttribute,
  EmptyBooleanAttribute,
  isColor,
  rgbToString,
  Size,
  toRGB
} from '@pmeig/ng-material-core';
import { BTagDirective } from '@pmeig/ngb-core';

@Directive({
  selector: 'button, [btn]',
  standalone: true
})
export class BBtnDirective extends BTagDirective implements OnInit {
  private state = {
    disabled: false,
    close: false,
    color: {
      classes: 'btn-primary',
      rgb: ''
    },
    size: ''
  };

  @Input()
  set btn(value: Empty<'close'>) {
    this.state.close = value === 'close';
    this.afterViewInit()
  }

  @Input()
  set close(value: EmptyBooleanAttribute) {
    this.state.close = emptyBooleanAttribute(value);
    this.afterViewInit()
  }

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
    if (this.state.close) {
      this.putClass('btn-close');
      this.removeAttribute(this.element, 'disabled');
      const removeClasses = []
      if (this.state.size) {
        removeClasses.push(`btn-${this.state.size}`);
      }
      if (this.state.color.classes) {
        removeClasses.push(this.state.color.classes);
      }
      this.removeClass(...removeClasses);
      if (this.state.color.rgb) {
        this.removeStyle('color');
      }
    } else {
      this.removeClass('btn-close')
      this.putClass('btn');
      this.refreshDisabled();
      this.refreshSize();
      this.refreshColor();
    }
  }

  protected eventClick(event: Event) {
    if (this.state.disabled) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  private refreshSize() {
    if (this.state.size) {
      this.putClass(`btn-${this.state.size}`);
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
