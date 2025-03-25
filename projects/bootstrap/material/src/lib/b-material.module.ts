import { NgModule } from '@angular/core';
import { FormMaterial } from '@pmeig/ngb-form';
import { InputMaterial } from '@pmeig/ngb-input';
import { LabelMaterial } from '@pmeig/ngb-label';
import { ButtonMaterial } from '@pmeig/ngb-btn';

const MATERIAL_DIRECTIVES = [InputMaterial, LabelMaterial, ButtonMaterial, FormMaterial];

@NgModule({
  imports: MATERIAL_DIRECTIVES,
  exports: MATERIAL_DIRECTIVES
})
export class PmeigMaterial {}
