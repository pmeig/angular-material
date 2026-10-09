# @pmeig/ngb-button

A powerful Angular library that provides Bootstrap-styled button components with advanced features like color variants, size options, disabled states, and flexible grouping capabilities.

## Installation
```bash
  npm install @pmeig/ngb-button
```
## Features

- 🎯 **BBtnDirective** - Smart button directive with comprehensive Bootstrap styling
- 📦 **BBtnGroupDirective** - Button group functionality with vertical/horizontal layouts
- 🛠️ **BBtnToolbarDirective** - Button toolbar organization with gap management
- ✨ **Color Variants** - Support for all Bootstrap colors plus custom colors
- 📏 **Size Options** - Multiple button sizes from xs to xxl
- 🔘 **Outline Styles** - Solid and outline button variants
- 🚫 **Disabled States** - Built-in disabled state handling with event prevention
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 21.2.0 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly
- 🛠️ Smart parent element management

## Usage

### Import the Module
```typescript
import { ButtonMaterial } from '@pmeig/ngb-button';

@NgModule({
imports: [
ButtonMaterial
],
// ...
})
export class AppModule { }
```
### Basic Buttons
```html
<!-- Basic button -->
<button>Default Button</button>

<!-- Button with color -->
<button color="primary">Primary Button</button>
<button color="secondary">Secondary Button</button>
<button color="success">Success Button</button>
<button color="danger">Danger Button</button>
<button color="warning">Warning Button</button>
<button color="info">Info Button</button>
<button color="light">Light Button</button>
<button color="dark">Dark Button</button>
```
### Outline Buttons
```html
<!-- Outline buttons -->
<button outline color="primary">Primary Outline</button>
<button outline color="secondary">Secondary Outline</button>
<button outline color="success">Success Outline</button>
<button outline color="danger">Danger Outline</button>
<button outline color="warning">Warning Outline</button>
<button outline color="info">Info Outline</button>
<button outline color="light">Light Outline</button>
<button outline color="dark">Dark Outline</button>
```
### Button Sizes
```html
<!-- Small buttons (btn-sm) -->
<button size="sm" color="primary">Small</button>

<!-- Default size -->
<button color="primary">Default</button>

<!-- Large buttons (btn-lg) -->
<button size="lg" color="primary">Large</button>
```
Bootstrap has two size classes only, `btn-sm` and `btn-lg`
([docs](https://getbootstrap.com/docs/5.3/components/buttons/#sizes)). `size="xs"`, `"xl"`, `"xxl"` add `btn-xs`,
`btn-xl`, `btn-xxl`, which neither Bootstrap nor this library style. For another size, use Bootstrap's CSS variables:
```html
<button color="primary" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
  Custom size
</button>
```

### Link Buttons
Bootstrap's `btn-link` variant: `color="link"`, or the Bootstrap class (a `<button class="btn-link">` without `color`
keeps it and gets no `btn-primary`). There is no `btn-outline-link` in Bootstrap: `outline` is ignored for it.
```html
<button color="link">Looks like a link</button>
<button class="btn-link">Looks like a link too</button>
```

### Buttons that must not become `.btn`
The selector is `button`: once `ButtonMaterial` is imported, **every** `<button>` of the component gets `btn`. Add
`pmeig-ignore` to the ones that are something else (tabs, list items, custom widgets):
```html
<button type="button" pmeig-ignore class="nav-link">Tab</button>
```
### Disabled Buttons
```html
<!-- Disabled solid buttons -->
<button color="primary" disabled>Disabled Primary</button>
<button color="secondary" [disabled]="isDisabled">Conditional Disabled</button>
```
### Close Buttons
```html
<!-- Close button -->
<button close aria-label="Close"></button>

<!-- Close button with custom styling -->
<button btn="close" aria-label="Close dialog"></button>
```
### Custom Colors
```html
<!-- Custom hex color -->
<button color="#ff6b6b">Custom Hex</button>

<!-- Custom RGB color -->
<button [color]="{ red: 255, green: 107, blue: 107 }">Custom RGB</button>
```
## Button Groups

### Horizontal Button Groups
```html
<!-- Basic button group -->
<btn-group>
  <button color="primary">Left</button>
  <button color="primary">Middle</button>
  <button color="primary">Right</button>
</btn-group>

<!-- Button group with different colors -->
<btn-group>
  <button outline color="primary">Option 1</button>
  <button outline color="primary">Option 2</button>
  <button outline color="primary">Option 3</button>
</btn-group>

<!-- Button group with sizes -->
<btn-group size="lg">
  <button color="secondary">Large</button>
  <button color="secondary">Button</button>
  <button color="secondary">Group</button>
</btn-group>
```
### Vertical Button Groups
```html
<!-- Vertical button group -->
<btn-group vertical>
  <button color="primary">First</button>
  <button color="primary">Second</button>
  <button color="primary">Third</button>
</btn-group>

<!-- Alternative vertical syntax -->
<btn-group btn-group="vertical">
  <button outline color="success">Top</button>
  <button outline color="success">Middle</button>
  <button outline color="success">Bottom</button>
</btn-group>
```
## Button Toolbars

### Basic Toolbar
```html
<btn-toolbar>
  <btn-group>
    <button outline color="primary">Cut</button>
    <button outline color="primary">Copy</button>
    <button outline color="primary">Paste</button>
  </btn-group>
  <btn-group>
    <button outline color="secondary">Undo</button>
    <button outline color="secondary">Redo</button>
  </btn-group>
</btn-toolbar>
```
### Toolbar with Custom Gap
```html
<btn-toolbar gap="1rem">
  <btn-group>
    <button color="primary">Save</button>
    <button outline color="primary">Save As</button>
  </btn-group>
  <btn-group>
    <button outline color="danger">Delete</button>
  </btn-group>
  <btn-group>
    <button color="success">Export</button>
    <button outline color="success">Import</button>
  </btn-group>
</btn-toolbar>
```
## API Reference

### BBtnDirective

Applied automatically to `button` elements and `[btn]` attributes.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `ColorAttribute \| 'link'` | `primary` | Bootstrap color name, `link` (`btn-link`), or a CSS color / RGB applied as `background-color` |
| `outline` | `boolean` | `false` | Uses outline button styling (`btn-outline-<color>`) |
| `size` | `SizeAttribute` | `''` | `sm` or `lg` (other values give classes Bootstrap does not style) |
| `disabled` | `boolean` | `false` | Sets the `disabled` attribute; clicks, double clicks and submits are stopped |
| `close` | `boolean` | `false` | Creates a close button (`btn-close` instead of `btn`) |
| `btn` | `'close'` | | `btn="close"` = `close`; on a non-button element (`<a btn>`), selects the directive |
| `pmeig-ignore` | attribute | | The directive leaves this button alone (see `@pmeig/ngb-core`) |

#### Color Options
- **Bootstrap colors**: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`
- **Custom colors**: any other string is a CSS color (`#ff6b6b`, `tomato`), a JSON string `{"red":255,"green":107,"blue":107}`
  or an `RGB` object is an RGB color: set as inline `background-color` (no hover/active colors, `outline` ignored)

#### Size Options
- `sm`, `lg` (Bootstrap); `xs`, `xl`, `xxl` produce `btn-xs`, `btn-xl`, `btn-xxl` without any style

### BBtnGroupDirective

Applied to `btn-group` elements and `[btn-group]` attributes.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | `SizeAttribute` | `''` | Size for all buttons in the group |
| `vertical` | `boolean` | `false` | Creates vertical button group |
| `btn-group` | `'vertical' \| 'horizontal'` | `'horizontal'` | Group orientation |

### BBtnToolbarDirective

Applied to `btn-toolbar` elements and `[btn-toolbar]` attributes.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `gap` | `string` | `undefined` | Custom gap between button groups |

## How It Works

### Automatic Styling Management
The button directives automatically:
1. **Apply Bootstrap classes**: Adds appropriate `btn-*` classes based on properties
2. **Handle events**: Prevents clicks when disabled
3. **Manage colors**: Supports both Bootstrap colors and custom colors
4. **Size management**: Applies size classes consistently
5. **Group behavior**: Handles input elements within button groups

### Color System
- **Bootstrap colors**: Uses predefined Bootstrap color classes
- **Custom colors**: Applies inline styles for custom colors
- **Outline variants**: Automatically prefixes with `btn-outline-`
- **Dynamic switching**: Properly cleans up previous color classes

### Group and Toolbar Behavior
- **Button groups**: Automatically style child elements as buttons
- **Input handling**: Converts radio/checkbox inputs to button-check styles
- **Gap management**: Custom spacing between elements
- **Vertical layouts**: Special handling for vertical button groups

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 button classes:
- `btn` - Base button class
- `btn-primary`, `btn-secondary`, etc. - Color variants
- `btn-outline-*` - Outline button variants
- `btn-sm`, `btn-lg` - Size variants
- `btn-group`, `btn-group-vertical` - Button groups
- `btn-toolbar` - Button toolbars
- `btn-check` - For input elements in groups
- `btn-close` - Close button styling


## Dependencies

- **Angular**: >=21.2
- **@angular/common**: >=21.2
- **@pmeig/ngb-core**: ^2.0.0
- **tslib**: ^2.3.0

## Compatibility

- Angular: 21.2
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)


## Troubleshooting

### Common Issues

**Button styling not applying**
- Check that color values are valid
- Verify directive selectors match your elements

**Disabled buttons still clickable**
- The directive prevents events when disabled is true
- Check that [disabled] binding is working correctly
- Ensure click handlers are not bypassing the directive

**Button groups not displaying correctly**
- Verify child elements are direct descendants
- Check that Bootstrap button group CSS is loaded
- Ensure proper button group structure

**Custom colors not working**
- Pass the color as a string (`color="#ff0000"`) or an `RGB` object (`[color]="{ red: 255, green: 0, blue: 0 }"`)
- A custom color is an inline `background-color`: `outline` has no effect on it

**Buttons look unstyled for an instant**
- Classes are added ~50 ms after the first render (see `@pmeig/ngb-core`), then Bootstrap's 0.15 s transition runs:
  a page shows native buttons for a moment, and a test or a screenshot taken right away sees them unstyled

## Fixed in 2.0.1

- A `<button>` without `color` is `btn-primary` (2.0.0 wrote `btn-btn-primary`: no color).
- `close` buttons get no color class.
- A CSS color (`color="#ff0000"`, `color="tomato"`) is painted (2.0.0 threw `Cannot read properties of undefined`).
- `color="link"` gives Bootstrap's `btn-link`.
- A button alone inserts the Bootstrap `<link>` like the other directives (see `@pmeig/ngb-core` to turn it off).

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
