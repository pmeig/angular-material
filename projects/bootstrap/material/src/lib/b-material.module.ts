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
import { ModalMaterial } from '@pmeig/ngb-modal';
import { OffcanvasMaterial } from '@pmeig/ngb-offcanvas';
import { NavbarMaterial } from '@pmeig/ngb-navbar';
import { PaginationMaterial } from '@pmeig/ngb-pagination';
import { PopoverMaterial, TooltipMaterial } from '@pmeig/ngb-tooltip';
import { ToastMaterial } from '@pmeig/ngb-toast';
import { SpinnerMaterial } from '@pmeig/ngb-spinner';
import { TableMaterial } from '@pmeig/ngb-table';
import { ProgressMaterial } from '@pmeig/ngb-progress';

/** What `excludes(...)` returns: the modules of the group without the excluded ones, to spread in an `@NgModule`. */
export interface MaterialModules {
  imports: Type<unknown>[];
  exports: Type<unknown>[];
}

const excludeModule = (excludes: Type<unknown>[], modules: Type<unknown>[]): MaterialModules => {
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

type FORM_EXCLUDES = typeof AlertMaterial | typeof DropdownMaterial | typeof ProgressMaterial | typeof TooltipMaterial
  | typeof PopoverMaterial | typeof ToastMaterial | typeof SpinnerMaterial | typeof ModalMaterial;
const FORMS_MATERIAL_MODULES: Type<unknown>[] = [PmeigSimpleMaterial, FormMaterial, AlertMaterial, DropdownMaterial,
  ProgressMaterial, TooltipMaterial, PopoverMaterial, ToastMaterial, SpinnerMaterial, ModalMaterial];

@NgModule({
  imports: FORMS_MATERIAL_MODULES,
  exports: FORMS_MATERIAL_MODULES,
})
export class PmeigFormsMaterial {
  static excludes(...excludes: FORM_EXCLUDES[]): MaterialModules {
    return excludeModule(excludes, FORMS_MATERIAL_MODULES);
  }
}

type NAVIGATION_EXCLUDES = typeof NavbarMaterial | typeof CollapseMaterial | typeof OffcanvasMaterial
  | typeof BreadcrumbMaterial | typeof PaginationMaterial;
const NAVIGATION_MATERIAL_MODULES: Type<unknown>[] = [PmeigSimpleMaterial, NavbarMaterial, CollapseMaterial,
  OffcanvasMaterial, BreadcrumbMaterial, PaginationMaterial];

@NgModule({
  imports: NAVIGATION_MATERIAL_MODULES,
  exports: NAVIGATION_MATERIAL_MODULES,
})
export class PmeigNavigationMaterial {
  static excludes(...excludes: NAVIGATION_EXCLUDES[]): MaterialModules {
    return excludeModule(excludes, NAVIGATION_MATERIAL_MODULES);
  }
}


type DESIGN_EXCLUDES = typeof CardMaterial | typeof CarouselMaterial | typeof AccordionMaterial | typeof CollapseMaterial
  | typeof ListMaterial | typeof TableMaterial;
const DESIGN_MATERIAL_MODULES: Type<unknown>[] = [PmeigSimpleMaterial, CardMaterial, CarouselMaterial,
  AccordionMaterial, CollapseMaterial, ListMaterial, TableMaterial];

@NgModule({
  imports: DESIGN_MATERIAL_MODULES,
  exports: DESIGN_MATERIAL_MODULES,
})
export class PmeigDesignMaterial {
  static excludes(...excludes: DESIGN_EXCLUDES[]): MaterialModules {
    return excludeModule(excludes, DESIGN_MATERIAL_MODULES);
  }
}

const MATERIAL_MODULES = [PmeigFormsMaterial, PmeigNavigationMaterial, PmeigDesignMaterial,
  BadgeMaterial];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class PmeigMaterial {
  /** The modules of every group without the excluded ones; `default` (true or BadgeMaterial) leaves BadgeMaterial out. */
  static excludes(excludes: {
    forms?: FORM_EXCLUDES[],
    navigation?: NAVIGATION_EXCLUDES[],
    design?: DESIGN_EXCLUDES[],
    default?: boolean | typeof BadgeMaterial
  }): MaterialModules {
    // a group with excludes is replaced by the modules it keeps (an object cannot be in imports)
    const imports = [
      ...(excludes.forms ? PmeigFormsMaterial.excludes(...excludes.forms).imports : [PmeigFormsMaterial]),
      ...(excludes.navigation ? PmeigNavigationMaterial.excludes(...excludes.navigation).imports : [PmeigNavigationMaterial]),
      ...(excludes.design ? PmeigDesignMaterial.excludes(...excludes.design).imports : [PmeigDesignMaterial]),
      ...(excludes.default ? [] : [BadgeMaterial]),
    ].filter((module, index, modules) => modules.indexOf(module) === index);
    return {
      imports,
      exports: imports
    };
  }
}
