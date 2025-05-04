import { NgModule } from '@angular/core';
import { FormMaterial } from '@pmeig/ngb-form';
import { InputMaterial } from '@pmeig/ngb-input';
import { LabelMaterial } from '@pmeig/ngb-label';
import { ButtonMaterial } from '@pmeig/ngb-button';
import { AccordionMaterial } from '@pmeig/ngb-accordion';
import { CollapseMaterial } from '@pmeig/ngb-collapse';
import { BadgeMaterial } from '@pmeig/ngb-badge';
import { AlertMaterial } from '@pmeig/ngb-alert';
import { SelectMaterial } from '@pmeig/ngb-select';
import { BreadcrumbMaterial } from '@pmeig/ngb-breadcrumb';
import { CardMaterial } from '@pmeig/ngb-card';
import { CarouselMaterial } from '@pmeig/ngb-carousel';

const SIMPLE_MATERIAL_MODULES = [InputMaterial, LabelMaterial, ButtonMaterial, SelectMaterial]

@NgModule({
  imports: SIMPLE_MATERIAL_MODULES,
  exports: SIMPLE_MATERIAL_MODULES
})
export class PmeigSimpleMaterial {}

const MATERIAL_MODULES = [PmeigSimpleMaterial, FormMaterial,
  AccordionMaterial, AlertMaterial,  BadgeMaterial, BreadcrumbMaterial,  CollapseMaterial, CardMaterial, CarouselMaterial ];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class PmeigMaterial {}
