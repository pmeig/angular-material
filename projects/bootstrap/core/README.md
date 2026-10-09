# @pmeig/ngb-core

Base classes shared by every `@pmeig/ngb-*` library (button, input, card, modal...). An application does not import it:
each `@pmeig/ngb-*` package depends on it. Read this page to know what **every** directive of the family does to the
page, whichever one you use.

## Installation

```bash
  npm install @pmeig/ngb-core
```

## What it contains

| Class | Extends (`@pmeig/ng-material-core`) | Used by |
|-------|-------------------------------------|---------|
| `BTagDirective` | `TagDirective` | directives on one element (`button`, `input`, `spinner`, `badge`...) |
| `BTagParentDirective` | `TagParentDirective` | directives that style their children (`btn-group`, `list-group`, `select`...) |
| `BTagTemplateDirective` | `TagTemplateDirective` | structural directives (`*alert`) |
| `BTagComponent` | `TagComponent` | components with a template (`card`, `modal`, `offcanvas`, `toast`...) |
| `bootstrapLink` | | the `<link>` of the Bootstrap stylesheet described below |
| `NGB_BOOTSTRAP_LINK`, `provideNgbBootstrapLink()` | | turn the `<link>` off (see below) |

Each class adds one thing to its parent: on init it inserts `bootstrapLink` in the `<head>` of the document, unless
`provideNgbBootstrapLink(false)` turned it off.

## Behavior common to every `@pmeig/ngb-*` directive

### The Bootstrap stylesheet is loaded from a CDN

The first directive initialized adds this element to `<head>` (once: it is found again by its id):

```html
<link id="ngb-css" rel="stylesheet" crossorigin="anonymous" integrity="sha384-..."
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.4/dist/css/bootstrap.min.css">
```

It is appended **after** the styles of the application, so its rules win over the application's rules of the same
specificity (a `.btn-primary { --bs-btn-bg: ... }` of your theme, for example). To keep your own Bootstrap (bundled from
`angular.json > styles`: needed for an offline PWA or a strict Content-Security-Policy), turn it off in the providers
of the application (since 2.0.1):

```typescript
import { provideNgbBootstrapLink } from '@pmeig/ngb-core';

bootstrapApplication(App, { providers: [provideNgbBootstrapLink(false)] });
```

(`NGB_BOOTSTRAP_LINK` is the token behind it.) With 2.0.0, declare instead an element with the same id in
`index.html`: the library finds it and adds nothing.

```html
<!-- index.html: Bootstrap comes from angular.json > styles, @pmeig/ngb-* must not load it again from the CDN -->
<link id="ngb-css" rel="stylesheet" href="data:text/css," />
```

### Classes are applied after the first render

In the browser, the directives wait for the end of the first change detection plus 50 ms (`debounceTime(50)`) before
adding their classes and starting their effects; on the server (SSR) they do nothing. A unit test waits for it
(`await fixture.whenStable()`, then `vi.advanceTimersByTime(50)` or `tick(50)`).

### Marker classes

Every host element gets the class `pmeig-<tag name>`, plus `pmeig-<tag name>-<id>` when it has an id
(`<button id="save">` gets `pmeig-button pmeig-button-save`): use them to target an element in CSS or in tests.

### `pmeig-ignore`: leave an element alone

Most selectors are element names (`button`, `input`, `select`, `option`, `label[for]`...): importing a library styles
**every** such element of the component. Put the empty attribute `pmeig-ignore` on an element the directive must not
touch: no class, no effect, no event listener.

```html
<!-- ButtonMaterial is imported: these tabs stay .nav-link, they do not become .btn -->
<button type="button" pmeig-ignore class="nav-link" [class.active]="tab() === 'a'">A</button>
```

### Attribute values

- An empty attribute is `true` (`<button outline>`), `"false"` is `false`.
- Colors: the Bootstrap names (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`) give the
  Bootstrap classes; any other string is used as a CSS color (`#ff6b35`, `white`), a JSON string
  `{"red":255,"green":0,"blue":0}` or an `RGB` object as an RGB color.

## Dependencies

- **Angular**: >=21.2
- **@pmeig/ng-material-core**: ^2.0.0
- **@pmeig/ng-core**: ^2.0.0
- **tslib**: ^2.3.0

## Compatibility

- Angular: 21.2+
- Bootstrap: 5.3 (the stylesheet loaded from the CDN is 5.3.4)

## License

This project is licensed under the MIT License.
