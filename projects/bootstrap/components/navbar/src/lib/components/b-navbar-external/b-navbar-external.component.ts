import { Component, input, signal, ViewEncapsulation } from '@angular/core';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { HasChildrenDirective, Nullable } from '@pmeig/ng-core';
import {
  ColorAttribute,
  colorAttributeToString,
  CssSize,
  CssSizeAttribute,
  cssSizeAttribute,
} from '@pmeig/ng-material-core';
import { NgClass } from '@angular/common';
import { CollapseMaterial } from '@pmeig/ngb-collapse';

@Component({
  selector: 'navbar-external',
  imports: [
    BNavbarComponent,
    CollapseMaterial,
    NgClass,
    HasChildrenDirective
  ],
  templateUrl: './b-navbar-external.component.html',
  styleUrl: './b-navbar-external.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class BNavbarExternalComponent {
  brandAttribute = input<string>(undefined, {alias: 'brand'});
  scroll = input<Nullable<CssSize>, CssSizeAttribute>(undefined, {transform: cssSizeAttribute});
  name = input<string>('');
  collapse = signal<boolean>(false);
  background = input<string, ColorAttribute>(undefined, {transform: (color: ColorAttribute) => colorAttributeToString(color, 'bg-')});

  get backgroundClass() {
    const color = this.background()
    return color?.startsWith('bg-') ? color : ''
  }

  get backgroundStyle() {
    const color = this.background()
    if (!color) return '';
    return !color.startsWith('bg-') ? color : ''
  }
}
