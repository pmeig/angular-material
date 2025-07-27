import {
  Component,
  ElementRef,
  HostListener,
  input,
  Optional,
  output,
  OutputRefSubscription,
  signal,
  ViewChild,
} from '@angular/core';
import { BTagComponent } from '@pmeig/ngb-core';
import {
  CssSize,
  CssSizeAttribute,
  cssSizeAttribute,
  emptyBooleanAttribute,
  EmptyBooleanAttribute,
  Size,
  SizeAttribute,
  sizeToString,
} from '@pmeig/ng-material-core';
import { NavMenuDirective } from '../../directives/nav-menu.directive';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { HasChildrenDirective, Nullable } from '@pmeig/ng-core';
import { CollapseMaterial } from '@pmeig/ngb-collapse';
import { OffCanvasMaterial } from '@pmeig/ngb-offcanvas';
import { BNavOffcanvasOptionsDirective } from '../../directives/b-nav-offcanvas.options.directive';

@Component({
  selector: 'navbar',
  templateUrl: './b-navbar.component.html',
  imports: [CollapseMaterial, NavMenuDirective, NgTemplateOutlet,
    NgStyle, HasChildrenDirective, OffCanvasMaterial],
  styleUrl: './b-navbar.component.scss'
})
export class BNavbarComponent extends BTagComponent {

  private subscription: OutputRefSubscription = new class implements OutputRefSubscription {
    unsubscribe(): void {
    }
  }

  offcanvas = input<boolean, EmptyBooleanAttribute>(false, {transform: emptyBooleanAttribute});
  brand = input<string>();
  orchestrator = signal<boolean | HTMLButtonElement>(false)
  toggler = input<Nullable<`navbar-expand-${Exclude<Size, 'xs' | 'xxs'>}`>, Exclude<SizeAttribute, 'xs' | 'xxs'>>('navbar-expand-lg',
    {transform: (value: Exclude<SizeAttribute, 'xs' | 'xxs'>) =>
        sizeToString(value, 'navbar-expand') as Nullable<`navbar-expand-${Exclude<Size, 'xs' | 'xxs'>}`>});
  scroll = input<Nullable<CssSize>, CssSizeAttribute>(undefined, {transform: cssSizeAttribute});

  togglerClicked = output()


  @ViewChild('button') private readonly button!: ElementRef<HTMLButtonElement>;

  @HostListener('window:resize')
  private onResize() {
    if (getComputedStyle(this.button.nativeElement).display === 'none') {
      this.orchestrator.set(true)
    } else {
      this.orchestrator.set(this.button.nativeElement)
    }
  }

  constructor(@Optional() protected readonly offcanvasOption?: BNavOffcanvasOptionsDirective) {
    super();
    this.effect(() => {
      const togglerSize = this.toggler();
      if (!this.offcanvas() && togglerSize) {
        this.putClass(togglerSize)
      } else {
        this.removeClass('navbar-expand-lg', 'navbar-expand-md', 'navbar-expand-sm', 'navbar-expand-xl', 'navbar-expand-xxl')
      }
    })
  }

  protected override afterViewInit() {
    super.afterViewInit();
    const classes = ['navbar']
    if (!this.offcanvas() && this.toggler()) {
      classes.push(this.toggler()!)
    }
    if (this.element.className.split(' ').some(value => !value.startsWith('bg-'))) {
      classes.push('bg-body-tertiary')
    }
    this.putClass(...classes);
    setTimeout(() => this.onResize(), 500)

  }


  protected override onInit() {
    super.onInit();
    this.subscription = this.togglerClicked.subscribe(() => {
      this.togglerState.update(value => !value);
    })
  }


  protected override onDestroy() {
    super.onDestroy();
    this.subscription.unsubscribe();
  }
}
