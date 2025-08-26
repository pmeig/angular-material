import { Directive, effect, HostListener, input } from '@angular/core';
import { BNavDirective } from './b-nav.directive';
import { NavMenuDirective } from './nav-menu.directive';
import { emptyBooleanAttribute, EmptyBooleanAttribute, TagDirective } from '@pmeig/ng-material-core';
import { filter, Subject } from 'rxjs';
import { navParent } from './event.directives';

const navAEventClick = new Subject<{nav: NavMenuDirective | BNavDirective, a: string}>()

@Directive({
  selector: 'nav > a, ul > a, ol > a',
  standalone: true,
})
export class BNavADirective extends TagDirective {
  private ref = Math.random().toString(36);
  private index = 0

  nav?: NavMenuDirective | BNavDirective;
  disabled = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute});

  constructor() {
    super();
    effect(() => this.onEffect(() => this.changeDisable(this.disabled())));
    this.addObservable(navParent.pipe(filter(value => {
      return value.child === this.element
    })), value => {
      this.nav = value.directive as NavMenuDirective | BNavDirective;
      this.index = value.index;
      this.onInit();
    })
  }

  @HostListener('click')
  private onClick() {
    if (this.nav && !this.disabled()) {
      if (!this.element.classList.contains('active')) {
        navAEventClick.next({nav: this.nav, a: this.ref})
      }
    }
  }


  protected override onInit() {
    super.onInit();
    if (this.nav) {
      this.putClass('nav-link')
      this.addObservable(navAEventClick.pipe(filter(value => value.nav.ref === this.nav?.ref)), value => {
        this.removeClass('active');
        this.removeAttribute('aria-current');
        if (value.a === this.ref) {
          this.putClass('active');
          this.putAttribute('aria-current', this.nav!.navigator());
        }
      });
    }
  }

  protected override afterViewInit() {
    super.afterViewInit();
    if (this.nav) {
      this.putClass('nav-link')
      this.putAttribute('id', this.element.id ?? this.nav.name() + `-nav-link-` + this.index)
    }
  }

  private changeDisable(disable: boolean) {
    if (disable) {
      this.putClass('disabled');
      this.putAttribute('aria-disabled', 'true');
      this.removeStyle('cursor')
    } else {
      this.removeClass('disabled');
      this.removeAttribute('aria-disabled');
      this.putStyle('cursor', 'pointer');
    }
  }
}
