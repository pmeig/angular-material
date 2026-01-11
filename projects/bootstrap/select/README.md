# @pmeig/ngb-select

A powerful Angular library that provides Bootstrap-styled select components with advanced features like multiple selection, smart option handling, and automatic styling management.

## Installation
```bash
  npm install @pmeig/ngb-select
```
## Features

- 🎯 **BSelectDirective** - Smart single-selection select directive with Bootstrap styling
- 📦 **BSelectMultipleDirective** - Multiple selection support with array value handling
- 🔘 **BOptionDirective** - Enhanced option directive with value binding support
- 🔄 **Smart Value Mapping** - Automatic conversion between option values and selected items
- ✨ **Size Variants** - Support for small and large select components
- 🛡️ **Disabled State Management** - Built-in disabled state handling with event prevention
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 20.2.1 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly
- 🛠️ Smart parent element management

## Usage

### Import the Module
```typescript
import { SelectMaterial } from '@pmeig/ngb-select';

@NgModule({
imports: [
SelectMaterial
],
// ...
})
export class AppModule { }
```
### Basic Single Select
```html
<!-- Basic select -->
<select id="country" [(selection)]="selectedCountry">
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="uk">United Kingdom</option>
  <option value="de">Germany</option>
</select>

<!-- With object values -->
<select id="product" [(selection)]="selectedProduct">
  <option [ngValue]="product1">Premium Package</option>
  <option [ngValue]="product2">Standard Package</option>
  <option [ngValue]="product3">Basic Package</option>
</select>
```
### Multiple Selection
```html
<!-- Multiple select with array values -->
<select multiple id="skills" [(selection)]="selectedSkills">
  <option value="angular">Angular</option>
  <option value="react">React</option>
  <option value="vue">Vue.js</option>
  <option value="typescript">TypeScript</option>
  <option value="javascript">JavaScript</option>
</select>

<!-- Multiple select with object values -->
<select multiple id="categories" [(selection)]="selectedCategories">
  <option [ngValue]="tech">Technology</option>
  <option [ngValue]="design">Design</option>
  <option [ngValue]="business">Business</option>
  <option [ngValue]="marketing">Marketing</option>
</select>
```
### Size Variants
```html
<!-- Small select -->
<select id="smallSelect" tall="sm" [(selection)]="smallValue">
  <option value="option1">Small Option 1</option>
  <option value="option2">Small Option 2</option>
</select>

<!-- Default size select -->
<select id="defaultSelect" [(selection)]="defaultValue">
  <option value="option1">Default Option 1</option>
  <option value="option2">Default Option 2</option>
</select>

<!-- Large select -->
<select id="largeSelect" tall="lg" [(selection)]="largeValue">
  <option value="option1">Large Option 1</option>
  <option value="option2">Large Option 2</option>
</select>
```
### Disabled Select
```html
<!-- Disabled select -->
<select id="disabledSelect" disabled [(selection)]="disabledValue">
  <option value="option1">Cannot Select This</option>
  <option value="option2">Or This</option>
</select>

<!-- Conditionally disabled -->
<select id="conditionalSelect" [disabled]="isReadOnly" [(selection)]="conditionalValue">
  <option value="read">Read Only Mode</option>
  <option value="edit">Edit Mode</option>
</select>
```

## API Reference

### BSelectDirective

Applied automatically to `select:not([multiple])` elements.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | **Required** | Unique identifier for the select element |
| `selection` | `T` | `undefined` | Currently selected value |
| `tall` | `'sm' \| 'lg'` | `undefined` | Size variant of the select |
| `disabled` | `boolean` | `false` | Disabled state of the select |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `selectionChange` | `T \| undefined` | Emitted when selection changes, returns the selected option value |

### BSelectMultipleDirective

Applied automatically to `select[multiple]` elements.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | **Required** | Unique identifier for the select element |
| `selection` | `T[]` | `[]` | Currently selected values array |
| `tall` | `'sm' \| 'lg'` | `undefined` | Size variant of the select |
| `disabled` | `boolean` | `false` | Disabled state of the select |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `selectionChange` | `T[]` | Emitted when selection changes, returns the array of selected option values |

### BOptionDirective

Applied automatically to `option` elements.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `any` | `undefined` | Option value (alternative to HTML value attribute) |
| `ngValue` | `any` | `undefined` | Object value for the option (takes precedence over value) |

## How It Works

### Smart Value Mapping
The select directives automatically:
1. **Map option values**: Converts between HTML option indices and actual values
2. **Handle selection events**: Processes change events and emits typed values
3. **Manage state**: Tracks selected options and updates selection accordingly
4. **Type conversion**: Handles both primitive values and complex objects

### Single vs Multiple Selection
- **Single Selection**: Returns the selected value directly (`T | undefined`)
- **Multiple Selection**: Returns an array of selected values (`T[]`)
- **Automatic Detection**: Uses the `multiple` attribute to determine behavior

### Option Value Resolution
1. **ngValue**: Takes highest precedence for object values
2. **value**: Used for primitive values
3. **Automatic ID**: Generates unique IDs for options if not provided

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 select classes:
- `form-select` - Base select styling
- `form-select-sm` - Small select variant
- `form-select-lg` - Large select variant
- `form-select-option` - Applied to option elements


## Dependencies

- **Angular**: >=20.2.1
- **@angular/common**: >=20.2.1
- **@pmeig/ngb-core**: ^0.0.1
- **tslib**: ^2.3.0

## Compatibility

- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)


## Troubleshooting

### Common Issues

**Error: "id is required for select"**
- The `id` attribute is required for all select elements
- Ensure you've set a unique ID: `<select id="unique-id">`

**Selection not updating**
- Verify that the selection binding is correct: `[(selection)]="property"`
- Check that option values match the expected data types
- Ensure ngValue is used for object comparisons

**Multiple select not working**
- Ensure the `multiple` attribute is present: `<select multiple>`
- Check that the selection property is an array: `selectedItems: any[] = []`

**Options not displaying values correctly**
- Use `[ngValue]` for object values and `value` for primitive values
- Ensure the binding syntax is correct
- Check for proper change detection in dynamic options

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.

