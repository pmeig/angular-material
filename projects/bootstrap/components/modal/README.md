# @pmeig/ngb-modal

A powerful Angular library that provides Bootstrap-styled modal dialogs with advanced features, animations, and comprehensive customization options.

## Installation

```bash 
  npm install @pmeig/ngb-modal
``` 

## Features

- 🎯 **ModalMaterial Component** - Full-featured modal component with Bootstrap styling
- 📦 **Content Projection** - Header, body, and footer slot support with template flexibility
- 🔄 **Animation Options** - Zoom and fade animations with smooth transitions
- ✨ **Size Variants** - Multiple sizes including fullscreen options
- 🎨 **Backdrop Control** - Customizable backdrop and outside-click behavior
- 🔢 **Auto-close Timer** - Optional timeout-based automatic closing
- 📱 **Responsive Design** - Fullscreen modes for mobile devices
- 🚀 Angular 21.2.0 support with signals
- 🛠️ Programmatic control with Modal interface
- 🎭 Centering and scrollable content support

## Usage

### Import the Module
```typescript 
import { ModalMaterial } from '@pmeig/ngb-modal';
@Component({
  imports: [ModalMaterial],
  // ...
})
export class MyComponent { }
``` 

### Basic Modal
```html
<modal #basicModal title="Basic Modal">
  <p>This is a basic modal with default settings.</p>
</modal>

<button class="btn btn-primary" (click)="basicModal.open()">
  Open Modal
</button>
```


### Modal with Custom Header and Footer
Two ways, both work: an **element** with the attribute `header` / `footer` / `btn` (projected with `ng-content`), or an
`ng-template` with the **template reference** `#header` / `#footer` / `#btn` (it receives `close` in its context).
`<ng-template header>` (attribute, not `#header`) is **not** a header, and an `ng-template` is a body only with `#body`
(`<ng-template #body let-close="close">`; since 2.0.2: before, every template of the content was rendered, including
the ones of `@if` and `@for`, which showed twice).
```html
<modal #customModal>
  <h4 header class="modal-title">Custom Header</h4>

  <p>Modal body content goes here.</p>

  <ng-template #footer let-close="close">
    <button type="button" color="secondary" (click)="close()">Cancel</button>
    <button type="button" color="primary">Save Changes</button>
  </ng-template>
</modal>
```


### Controlled Modal
`[(show)]`: the modal opens when the value becomes `true`, closes when it becomes `false`, and `showChange` gives the
value back whatever closed it (cross, click outside, Escape, `timeout`), so that it can be opened again.
```html
<modal title="Delete?" [(show)]="confirming">
  <p>This cannot be undone.</p>
  <button footer type="button" color="danger" (click)="remove(); confirming.set(false)">Delete</button>
</modal>

<button type="button" color="primary" (click)="confirming.set(true)">Delete</button>
```
The template reference works too: `#confirm` then `confirm.open()` / `confirm.close()`, and its `visible` signal.


### Modal with Different Sizes
```html
<!-- Small Modal -->
<modal #smallModal title="Small Modal" size="sm">
  <p>Small modal content</p>
</modal>

<!-- Large Modal -->
<modal #largeModal title="Large Modal" size="lg">
  <p>Large modal content</p>
</modal>

<!-- Extra Large Modal -->
<modal #xlModal title="Extra Large Modal" size="xl">
  <p>Extra large modal content</p>
</modal>

<!-- Fullscreen Modal -->
<modal #fullscreenModal title="Fullscreen Modal" fullscreen>
  <p>Fullscreen modal content</p>
</modal>
```


### Modal with Auto-close Timer
```html
<!-- a number is in milliseconds; a Timeout object ({ value: 5, unit: TimeoutUnit.SECOND }) works too -->
<modal #timedModal 
       title="Auto-close Modal" 
       [timeout]="5000">
  <p>This modal will automatically close after 5 seconds.</p>
</modal>
```


### Modal with Custom Animation
```html
<modal #fadeModal 
       title="Fade Animation" 
       animation="fade">
  <p>This modal uses fade animation instead of zoom.</p>
</modal>
```


## API Reference

### Modal Component Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `undefined` | Modal title text |
| `show` | `boolean` | `false` | Opens (`true`) / closes (`false`) the modal; two-way with `[(show)]` (see Controlled Modal) |
| `animation` | `'zoom' \| 'fade'` | `'zoom'` | Animation type for show/hide transitions |
| `cross` | `boolean` | `true` | Shows close button (×) in header |
| `backdrop` | `boolean` | `true` | Shows backdrop overlay |
| `close-outside` | `boolean` | `true` | A click outside closes the modal; `false` = a "static" shake instead |
| `fullscreen` | `boolean` | `false` | `modal-fullscreen`; with `size`, `modal-fullscreen-<size>-down` (`sm`, `md`, `lg`, `xl`, `xxl`: fullscreen below that breakpoint) |
| `timeout` | `number \| Timeout` | `undefined` | Auto-close: a number is in milliseconds |
| `size` | `'sm' \| 'lg' \| 'xl'` | `undefined` | Modal size variant (`xs` → `sm`, `xxl` → `xl`) |
| `center` | `boolean` | `true` | Centers modal vertically |
| `scrollable` | `boolean` | `true` | Makes modal body scrollable |
| `keyboard` | `boolean` | `true` | Escape closes the modal (Bootstrap's `keyboard` option) |

### Modal Interface Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `open()` | `void` | Opens the modal |
| `close()` | `void` | Closes the modal |
| `visible` | `Signal<boolean>` | Signal indicating modal visibility state |
| `reference` | `string` | Unique reference identifier for the modal |

#### Content Projection Slots
- **Default slot**: Main modal body content (and the `<ng-template #body>` templates)
- **`[header]` element / `#header` template**: Custom header content
- **`[footer]` element / `#footer` template**: Custom footer content
- **`[btn]` element / `#btn` template**: buttons in the header, before the cross
- Templates receive `{ close }` (`let-close="close"`)

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `showChange` | `boolean` | Every open (`true`) and close (`false`), whatever the cause |

## How It Works

### Modal Lifecycle
The modal component automatically:
1. **State Management**: Uses signals to track visibility and animation states
2. **DOM Manipulation**: Dynamically shows/hides modal and backdrop elements
3. **Animation Handling**: Manages CSS transitions between states
4. **Event Management**: Handles click events for backdrop and close actions
5. **Timeout Management**: Automatically closes modal when timeout is set

### Accessibility
The component replaces Bootstrap's JavaScript and does what it does on show
([Bootstrap modal](https://getbootstrap.com/docs/5.3/components/modal/#options)): `role="dialog"`, `aria-modal="true"`
and `tabindex="-1"` on `.modal`, `aria-labelledby` pointing to the `title`, Escape closes it (`keyboard`), and the focus
moves into the modal once it is shown. A title given in your own `[header]` content needs its own `aria-labelledby`.

## Fixed in 2.0.2

- An `@if` / `@for` directly in `<modal>` is rendered once (2.0.0 and 2.0.1 rendered it a second time, with the context
  of a template: `[object Object]` for an `as` alias). **Behavior change**: a body template needs `#body`.

## Fixed in 2.0.1

- `showChange` output: `[(show)]` works, and a modal closed by the user can be opened again.
- `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape and focus, like Bootstrap's JavaScript.
- `fullscreen` alone gives Bootstrap's `modal-fullscreen` (2.0.0 wrote `modal-`); `size="md"` gives no class (the
  default width) instead of the nonexistent `modal-md`.

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 modal classes:
- `modal` - Main modal container
- `modal-dialog` - Modal dialog wrapper
- `modal-content` - Modal content container
- `modal-header` - Header section
- `modal-title` - Title element
- `modal-body` - Body content area
- `modal-footer` - Footer section
- `modal-backdrop` - Backdrop overlay
- `modal-dialog-centered` - Vertically centered modal
- `modal-dialog-scrollable` - Scrollable modal body
- `modal-sm`, `modal-lg`, `modal-xl` - Size variants
- `modal-fullscreen` - Fullscreen variants

## Size Options

Available size configurations:
- **Small**: `size="sm"` - Compact modal for simple content
- **Default**: No size attribute - Standard modal size
- **Large**: `size="lg"` - Wider modal for complex content
- **Extra Large**: `size="xl"` - Maximum width modal
- **Fullscreen**: `fullscreen` - Full viewport coverage

## Dependencies

- **Angular**: >=21.2
- **@angular/common**: >=21.2
- **@pmeig/ngb-button**: ^2.0.0
- **tslib**: ^2.3.0

## Compatibility

- Angular: 21.2
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)


## Troubleshooting

### Common Issues

**Modal not showing**
- Ensure the modal is properly opened using `open()` method or `[show]="true"`
- Check that Bootstrap CSS is properly loaded
- Verify that there are no conflicting z-index styles

**Modal not closing on backdrop click**
- Check that `close-outside` is `true` (default)
- Ensure `backdrop` is enabled
- Verify that event propagation is not being stopped

**Content not displaying properly**
- Use appropriate content projection slots (`[header]`, `[footer]`)
- Check for template reference syntax errors
- Ensure content is properly nested within modal tags

**Animation issues**
- Verify that CSS transitions are not being overridden
- Check that animation type is valid (`'zoom'` or `'fade'`)
- Ensure sufficient time for animations to complete

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
