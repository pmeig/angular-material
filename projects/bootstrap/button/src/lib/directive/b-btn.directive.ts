import { computed, Directive, input, OnInit } from '@angular/core';
import {
  colorAttribute,
  ColorAttribute,
  ColorConfig,
  Empty,
  emptyBooleanAttribute,
  EmptyBooleanAttribute,
  SizeAttribute,
  sizeToString
} from '@pmeig/ng-material-core';
import { BTagDirective } from '@pmeig/ngb-core';

@Directive({
  selector: 'button, [btn]',
  standalone: true,
})
export class BBtnDirective extends BTagDirective implements OnInit {

  btn = input<boolean, Empty<'close'>>(false, {transform: closes => closes === 'close'})
  outline = input<string, EmptyBooleanAttribute>('btn',
    {transform: outline => emptyBooleanAttribute(outline) ? 'btn-outline' : 'btn'})
  close = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute})
  disabled = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute})
  size = input<string, SizeAttribute>('', {transform: size => sizeToString(size, 'btn')})
  /** A Bootstrap color, `link` (Bootstrap's btn-link variant) or a CSS color; primary when not given. */
  color = input<ColorConfig, Empty<ColorAttribute | 'link'>>(colorAttribute('primary'), {
    transform: color => {
      this.colorGiven = true;
      return color === 'link' ? { style: 'link', color: 'link' } : colorAttribute(color as ColorAttribute);
    }
  })

  private colorGiven = false;
  private linkByClass = false;
  private buttonClass = computed(() => (this.btn() || this.close()) ? 'btn-close' : 'btn');

  constructor() {
    super();
    this.effect(this.refreshDisabled)
    this.effect(this.refreshSize)
    this.effect(this.refreshColor)
    this.effect(this.refreshClose)
  }

  private get eventClickBind() {
    return this.eventClick.bind(this);
  }

  override onInit(): void {
    super.onInit();
    // <button class="btn-link"> without color keeps Bootstrap's link variant
    this.linkByClass = this.element.classList.contains('btn-link');
    this.overrideEvent('click', this.eventClickBind);
    this.overrideEvent('dblclick', this.eventClickBind);
    this.overrideEvent('submit', this.eventClickBind);
    this.overrideEvent('enter', this.eventClickBind);
  }

  private refreshClose() {
    this.removeClass('btn-close');
    this.putClass(this.buttonClass());
  }

  protected eventClick(event: Event) {
    if (this.disabled()) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  }

  private refreshSize() {
    this.removeClass(...['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxs'].map(value => `btn-${value}`));
    const size = this.size();
    if (size) {
      this.putClass(size);
    }
  }

  private refreshColor() {
    this.removeClass(...['primary', 'success', 'warning', 'danger', 'info', 'light', 'dark', 'secondary']
      .flatMap(value => [`btn-${value}`, `btn-outline-${value}`]));
    if (!this.linkByClass) {
      this.removeClass('btn-link');
    }
    this.removeStyle('background-color');
    // a close button has no color; a btn-link class is the color unless another one is given
    if (this.close() || this.btn() || (this.linkByClass && !this.colorGiven)) {
      return;
    }
    const color = this.color();
    if (color.color === 'link') {
      // Bootstrap has no btn-outline-link
      this.putClass('btn-link');
    } else if (color.color) {
      this.putClass(this.outline() + '-' + color.color);
    } else if (color.style) {
      // a CSS color: rgb is '' when the color is not an RGB one
      this.putStyle('background-color', color.rgb || color.style as string);
    }
  }

  private refreshDisabled() {
    const disabled = this.disabled();
    if (disabled) {
      this.renderer.setAttribute(this.element, 'disabled', '');
    } else {
      this.renderer.removeAttribute(this.element, 'disabled');
    }
  }
}
