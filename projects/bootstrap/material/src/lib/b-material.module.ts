import { NgModule, Type } from '@angular/core';
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
import { DropdownMaterial } from '@pmeig/ngb-dropdown';
import { ListMaterial } from '@pmeig/ngb-list';
import { OffcanvasMaterial } from '@pmeig/ngb-offcanvas';
import { NavbarMaterial } from '@pmeig/ngb-navbar';
import { PaginationMaterial } from '@pmeig/ngb-pagination';
import { ProgressMaterial } from '@pmeig/ngb-progress';
import { PopoverMaterial, TooltipMaterial } from '@pmeig/ngb-tooltip';
import { ToastMaterial } from '@pmeig/ngb-toast';
import { SpinnerMaterial } from '@pmeig/ngb-spinner';
import { TableMaterial } from '@pmeig/ngb-table';

const excludeModule = <T>(excludes: T[], modules: T[]) => {
  const imports = modules.filter(module => !excludes.includes(module));
  return {
    imports,
    exports: imports
  };
}

const SIMPLE_MATERIAL_MODULES = [InputMaterial, LabelMaterial, ButtonMaterial, SelectMaterial];

@NgModule({
  imports: SIMPLE_MATERIAL_MODULES,
  exports: SIMPLE_MATERIAL_MODULES,
})
export class PmeigSimpleMaterial {
}

type FORM_EXCLUDES = AlertMaterial | DropdownMaterial | ProgressMaterial | TooltipMaterial | PopoverMaterial | ToastMaterial | SpinnerMaterial;
const FORMS_MATERIAL_MODULES = [PmeigSimpleMaterial, FormMaterial, AlertMaterial, DropdownMaterial,
  ProgressMaterial, TooltipMaterial, PopoverMaterial, ToastMaterial, SpinnerMaterial];

@NgModule({
  imports: FORMS_MATERIAL_MODULES,
  exports: FORMS_MATERIAL_MODULES,
})
export class PmeigFormsMaterial {
  static excludes(...excludes: FORM_EXCLUDES[]) {
    return excludeModule(excludes, FORMS_MATERIAL_MODULES);
  }
}

type NAVIGATION_EXCLUDES = NavbarMaterial | CollapseMaterial | OffcanvasMaterial | BreadcrumbMaterial | PaginationMaterial;
const NAVIGATION_MATERIAL_MODULES = [PmeigSimpleMaterial, NavbarMaterial, CollapseMaterial,
  OffcanvasMaterial, BreadcrumbMaterial, PaginationMaterial];

@NgModule({
  imports: NAVIGATION_MATERIAL_MODULES,
  exports: NAVIGATION_MATERIAL_MODULES,
})
export class PmeigNavigationMaterial {
  static excludes(...excludes: NAVIGATION_EXCLUDES[]) {
    return excludeModule(excludes, FORMS_MATERIAL_MODULES);
  }
}


type DESIGN_EXCLUDES = CardMaterial | CarouselMaterial | AccordionMaterial | CollapseMaterial | ListMaterial | TableMaterial;
const DESIGN_MATERIAL_MODULES = [PmeigSimpleMaterial, CardMaterial, CarouselMaterial,
  AccordionMaterial, CollapseMaterial, ListMaterial, TableMaterial];

@NgModule({
  imports: DESIGN_MATERIAL_MODULES,
  exports: DESIGN_MATERIAL_MODULES,
})
export class PmeigDesignMaterial {
  static excludes(...excludes: DESIGN_EXCLUDES[]) {
    return excludeModule(excludes, FORMS_MATERIAL_MODULES);
  }
}

const MATERIAL_MODULES = [PmeigFormsMaterial, PmeigNavigationMaterial, PmeigDesignMaterial,
  BadgeMaterial];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class PmeigMaterial {
  static excludes(excludes: {
    forms?: FORM_EXCLUDES[],
    navigation?: NAVIGATION_EXCLUDES[],
    design?: DESIGN_EXCLUDES[],
    default?: BadgeMaterial
  }) {
    const imports = [PmeigMaterial.exclude(excludes.forms, PmeigFormsMaterial),
      PmeigMaterial.exclude(excludes.navigation, PmeigNavigationMaterial),
      PmeigMaterial.exclude(excludes.design, PmeigDesignMaterial),
      ...[BadgeMaterial].filter(() => !excludes.default)];
    return {
      imports,
      exports: imports
    };
  }

  private static exclude<T>(excludes: T[] | undefined, module: Type<any> & {
    excludes(...excludes: T[]): any
  }): Type<any> {
    if (excludes) {
      return module.excludes(...excludes);
    }
    return module;
  }
}
