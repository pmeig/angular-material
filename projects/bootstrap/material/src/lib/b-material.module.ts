import { NgModule } from '@angular/core';
import { FormMaterial } from '@pmeig/ngb-form';
import { ButtonMaterial } from '@pmeig/ngb-btn';
import { LabelMaterial } from '@pmeig/ngb-label';
import { InputMaterial } from '@pmeig/ngb-input';

const MATERIAL_DIRECTIVES = [InputMaterial, LabelMaterial, ButtonMaterial, FormMaterial];

@NgModule({
  imports: MATERIAL_DIRECTIVES,
  exports: MATERIAL_DIRECTIVES
})
export class PmeigMaterial {}
