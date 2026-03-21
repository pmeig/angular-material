# @pmeig/ngb-label

A powerful Angular library that provides Bootstrap-styled label components with advanced features like floating labels, smart input type detection, and checkbox/radio button styling.

## Installation
```bash
  npm install @pmeig/ngb-label
```
## Features

- 🎯 **BLabelDirective** - Smart label directive with automatic input type detection
- 🏷️ **BLabelFloatingDirective** - Floating label functionality with positioning options
- ☑️ **BLabelCheckDirective** - Checkbox and radio button label styling with switch support
- 🔘 **BLabelCheckButtonDirective** - Button-styled checkbox/radio labels with color variants
- ✨ **Automatic Type Detection** - Automatically applies correct Bootstrap classes based on input type
- 🎨 **Floating Labels** - Bootstrap 5.3.3 floating label support with positioning
- 🔄 **Dynamic Positioning** - Start/end label positioning with input group support
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 21.2.0 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly
- 🛠️ Smart parent element management

## Usage

### Import the Module
```typescript
import { LabelMaterial } from '@pmeig/ngb-label';

@NgModule({
imports: [
LabelMaterial
],
// ...
})
export class AppModule { }
```
### Basic Label Usage
```html
<!-- By default is floating labels -->
<input type="text" id="username" label="Username" class="form-control">
```
### Label Positioning
```html
<input type="text" id="floatingInput" class="form-control" label="Username" 
       placeholder="Username" floating="false">

<!-- Right label -->
<input type="text" id="rightLabel" class="form-control" label="Username" floating="false"
       placeholder="Username" label-position="end">
```

## API Reference

### BLabelDirective

Applied automatically to `label[for]` elements.

| Property | Type | Description |
|----------|------|-------------|
| `for` | `Element` | Target input element (can override HTML for attribute) |

### BLabelFloatingDirective

Applied to inputs with `label` attribute (excludes checkboxes, radios, and ranges).

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `floating` | `boolean` | `true` | Enables floating label behavior |
| `label-position` | `'start' \| 'end'` | `'start'` | Label position when not floating |

### BLabelCheckDirective

Applied to checkbox/radio inputs with `label` attribute (excludes button-type).

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `switch` | `boolean` | `false` | Enables Bootstrap switch styling for checkboxes |

### BLabelCheckButtonDirective

Applied to checkbox/radio inputs with `label` and `label-type="btn"`.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label-btn-outline` | `boolean` | `false` | Uses outline button styling |
| `label-btn-color` | `ColorAttribute` | `undefined` | Button color variant |

## How It Works

### Automatic Type Detection
The label directives automatically:
1. **Detect input types**: Examines the associated input element's type
2. **Apply appropriate classes**: Uses `form-label` for regular inputs, `form-check-label` for checkboxes/radios
3. **Handle click events**: Properly associates labels with custom elements
4. **Manage parent containers**: Creates and manages form floating/check containers

### Floating Label Behavior
- **Default floating**: Labels float above inputs when focused or filled
- **Position control**: `label-position` controls placement when floating is disabled
- **Dynamic insertion**: Labels are dynamically positioned in the DOM

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 form classes:
- `form-label` - Standard form labels
- `form-check-label` - Checkbox/radio labels
- `form-floating` - Floating label containers
- `form-check` - Checkbox/radio containers
- `form-switch` - Switch-style checkboxes
- `btn`, `btn-*` - Button-styled labels
- `btn-outline-*` - Outline button variants
- `btn-check` - Hidden button-check inputs

## Dependencies

- **Angular**: >=21.2
- **@angular/common**: >=21.2
- **@pmeig/ngb-core**: ^0.0.1
- **tslib**: ^2.3.0

## Compatibility

- Angular: 21.2
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Troubleshooting

### Common Issues

**Labels not showing correct styling**
- Ensure the `for` attribute matches the input's `id`
- Verify input type detection is working correctly

**Floating labels not working**
- Ensure placeholder text is provided for floating labels
- Check that the input has the `form-control` class
- Verify the parent container structure

**Button labels not applying colors**
- Ensure `label-type="btn"` is set
- Check color attribute values are valid Bootstrap colors
- Verify button label directives are being applied

**Checkbox/radio labels misaligned**
- Check parent container has proper Bootstrap form classes
- Ensure switch functionality is properly configured
- Verify checkbox/radio styling directives are active

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
