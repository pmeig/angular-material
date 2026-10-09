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
| `PmeigFormsMaterial` | `PmeigSimpleMaterial`, `FormMaterial`, `AlertMaterial`, `DropdownMaterial`, `ProgressMaterial`, `TooltipMaterial`, `PopoverMaterial`, `ToastMaterial`, `SpinnerMaterial`, `ModalMaterial` |
| `PmeigNavigationMaterial` | `PmeigSimpleMaterial`, `NavbarMaterial`, `CollapseMaterial`, `OffcanvasMaterial`, `BreadcrumbMaterial`, `PaginationMaterial` |
| `PmeigDesignMaterial` | `PmeigSimpleMaterial`, `CardMaterial`, `CarouselMaterial`, `AccordionMaterial`, `CollapseMaterial`, `ListMaterial`, `TableMaterial` |
| `PmeigMaterial` | the three groups above and `BadgeMaterial` |


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

`PmeigMaterial.excludes({ forms, navigation, design, default })` does the same for every group (`default: true` leaves
`BadgeMaterial` out):

```typescript
@NgModule(PmeigMaterial.excludes({ forms: [ToastMaterial], design: [CarouselMaterial] }))
export class MyMaterial { }
```

## Fixed in 2.0.1

- `PmeigNavigationMaterial.excludes` and `PmeigDesignMaterial.excludes` filter their own group (2.0.0 returned the
  forms group).
- `PmeigMaterial.excludes({...})` returns module classes only: it can be given to `@NgModule` (2.0.0 put an object in
  `imports`).
- `excludes(...)` takes the module classes (`typeof AlertMaterial`): TypeScript refuses anything else.
- `ModalMaterial` (`@pmeig/ngb-modal`) is in `PmeigFormsMaterial`.

## Dependencies

- **Angular**: >=21.2
- every `@pmeig/ngb-*` library: ^2.0.0

## License

This project is licensed under the MIT License.
