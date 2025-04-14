import { NgModule } from '@angular/core';
import { FormMaterial } from '@pmeig/ngb-form';
import { InputMaterial } from '@pmeig/ngb-input';
import { LabelMaterial } from '@pmeig/ngb-label';
import { ButtonMaterial } from '@pmeig/ngb-btn';
import { AccordionMaterial } from '@pmeig/ngb-accordion';
import { CollapseMaterial } from '@pmeig/ngb-collapse';
import { BadgeMaterial } from '@pmeig/ngb-badge';

const MATERIAL_MODULES = [InputMaterial, LabelMaterial, ButtonMaterial, FormMaterial,
AccordionMaterial, BadgeMaterial, CollapseMaterial];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class PmeigMaterial {}
