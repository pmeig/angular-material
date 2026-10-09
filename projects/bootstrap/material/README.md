# @pmeig/ngb-material

All the `@pmeig/ngb-*` libraries in one package, grouped in modules. Import a group when a component uses many of them;
import the single libraries (`@pmeig/ngb-button`, `@pmeig/ngb-card`...) otherwise: each one styles every element its
selector matches (`button`, `input`, `select`, `option`...), so a group may style more than you expect (see
`pmeig-ignore` in [`@pmeig/ngb-core`](../core/README.md)).

## Installation

```bash
  npm install @pmeig/ngb-material
```

## Modules

| Module | Contains |
|--------|----------|
| `PmeigSimpleMaterial` | `InputMaterial`, `LabelMaterial`, `ButtonMaterial`, `SelectMaterial` |
| `PmeigFormsMaterial` | `PmeigSimpleMaterial`, `FormMaterial`, `AlertMaterial`, `DropdownMaterial`, `ProgressMaterial`, `TooltipMaterial`, `PopoverMaterial`, `ToastMaterial`, `SpinnerMaterial` |
| `PmeigNavigationMaterial` | `PmeigSimpleMaterial`, `NavbarMaterial`, `CollapseMaterial`, `OffcanvasMaterial`, `BreadcrumbMaterial`, `PaginationMaterial` |
| `PmeigDesignMaterial` | `PmeigSimpleMaterial`, `CardMaterial`, `CarouselMaterial`, `AccordionMaterial`, `CollapseMaterial`, `ListMaterial`, `TableMaterial` |
| `PmeigMaterial` | the three groups above and `BadgeMaterial` |

`@pmeig/ngb-modal` is in no group: import `ModalMaterial` from `@pmeig/ngb-modal`.

```typescript
import { PmeigDesignMaterial } from '@pmeig/ngb-material';

@Component({
  imports: [PmeigDesignMaterial],
  // ...
})
export class MyComponent { }
```

## Excluding libraries

Each group has a static `excludes(...)` that returns the lists of the group without the libraries given, as
`{ imports, exports }`, to spread in an `@NgModule`:

```typescript
@NgModule(PmeigFormsMaterial.excludes(ToastMaterial, AlertMaterial))
export class MyFormsMaterial { }
```

See Known issues before using it with the other groups.

## Known issues (2.0.0)

- **`PmeigNavigationMaterial.excludes` and `PmeigDesignMaterial.excludes` filter the forms modules**: both call
  `excludeModule(excludes, FORMS_MATERIAL_MODULES)`, so they return the forms group instead of their own. Fix: use
  `NAVIGATION_MATERIAL_MODULES` and `DESIGN_MATERIAL_MODULES`.
- **`PmeigMaterial.excludes({...})` cannot be imported**: as soon as one group has excludes, `exclude()` puts a
  `{ imports, exports }` object (not a module class) in `imports`, which Angular refuses.
- **The exclude types are instance types** (`AlertMaterial` instead of `typeof AlertMaterial`): every module class is
  an empty object type, so TypeScript accepts any module, or any object, in `excludes(...)`.
- **`@pmeig/ngb-modal` is missing** from every group.

## Dependencies

- **Angular**: >=21.2
- every `@pmeig/ngb-*` library: ^2.0.0

## License

This project is licensed under the MIT License.
