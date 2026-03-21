# @pmeig/ngb-spinner

A powerful Angular library that provides Bootstrap-styled loading spinners with customizable shapes, sizes, and colors for indicating loading states in your applications.

## Installation
```bash
  npm install @pmeig/ngb-spinner
```
## Features

- 🎯 **SpinnerMaterial Directive** - Lightweight spinner directive with Bootstrap styling
- 📦 **Shape Variants** - Border and grow animation types
- 🔄 **Size Options** - Small, default, and large spinner sizes
- ✨ **Color Theming** - Bootstrap color variants and custom color support
- 🎨 **CSS Integration** - Full Bootstrap 5.3.3 spinner compatibility
- 🚀 Angular 21.2.0 support with signals
- 📱 **Responsive Design** - Scalable spinners for all screen sizes
- ♿ **Accessibility Friendly** - Screen reader support with proper markup
- 🛠️ **Flexible Implementation** - Easy integration with existing elements

## Usage

### Import the Module
```typescript
import { SpinnerMaterial } from '@pmeig/ngb-spinner';
@Component({
imports: [SpinnerMaterial],
// ...
})
export class MyComponent { }
```
### Basic Border Spinner
```html
<spinner></spinner>
```
### Grow Spinner
```html
<spinner shape="grow"></spinner>
```
### Colored Spinners
```html
<spinner color="primary"></spinner>
<spinner color="success"></spinner>
<spinner color="danger"></spinner>
<spinner color="warning"></spinner>
<spinner color="info"></spinner>
```
### Different Sizes
```html
<!-- Small Spinner -->
<spinner size="sm" color="primary"></spinner>

<!-- Default Spinner -->
<spinner color="secondary"></spinner>

<!-- Large Spinner -->
<spinner size="lg" color="success"></spinner>
```
### Custom Colors
```html
<!-- Hex Color -->
<spinner color="#ff6b35"></spinner>

<!-- RGB Color -->
<spinner color="rgb(255, 107, 53)"></spinner>

<!-- CSS Variable -->
<spinner color="var(--custom-color)"></spinner>
```
### Loading States in Buttons
```html
<button class="btn btn-primary" [disabled]="isLoading">
  @if(isLoading) {
    <spinner size="sm" color="white" class="me-2"></spinner>
  }
{{ isLoading ? 'Loading...' : 'Submit' }}
</button>
```
### Inline Loading Indicators
```html
<div class="d-flex align-items-center">
  <spinner size="sm" color="primary" class="me-2"></spinner>
  <span>Loading data...</span>
</div>
```
### Center Loading Overlay
```html
<div class="text-center py-5">
  <spinner size="lg" color="primary"></spinner>
  <div class="mt-3">
    <h5>Loading...</h5>
    <p class="text-muted">Please wait while we fetch your data.</p>
  </div>
</div>
```
## API Reference

### Spinner Directive Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `shape` | `'border' \| 'grow'` | `'border'` | Animation type - rotating border or pulsing grow effect |
| `size` | `'sm' \| 'lg'` | `undefined` | Spinner size variant |
| `color` | `ColorConfig \| ColorAttribute` | `{style: ''}` | Spinner color configuration |

#### Shape Options
- **Border**: `shape="border"` - Rotating border spinner (default)
- **Grow**: `shape="grow"` - Pulsing/scaling spinner effect

#### Size Options
- **Small**: `size="sm"` - Compact spinner for inline use
- **Default**: No size attribute - Standard spinner size
- **Large**: `size="lg"` - Prominent spinner for main loading states

#### Color Configuration
- **Bootstrap Colors**: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`
- **Custom CSS Colors**: Hex (`#ff0000`), RGB (`rgb(255,0,0)`), HSL, CSS variables
- **CSS Classes**: Custom text color classes

## How It Works

### Spinner Implementation
The spinner directive automatically:
1. **Class Application**: Applies appropriate Bootstrap spinner classes
2. **Size Management**: Handles size variant styling
3. **Color Processing**: Manages color through CSS classes or inline styles
4. **Animation Control**: Provides smooth, hardware-accelerated animations
5. **Accessibility**: Maintains proper ARIA attributes for screen readers

### Performance Considerations
- **Lightweight**: Minimal DOM manipulation and CSS
- **Hardware Acceleration**: Uses CSS transforms for smooth animations
- **Conditional Rendering**: Only renders when needed to save resources

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 spinner classes:
- `spinner-border` - Rotating border spinner
- `spinner-grow` - Growing/pulsing spinner
- `spinner-border-sm`, `spinner-grow-sm` - Small size variants
- `spinner-border-lg`, `spinner-grow-lg` - Large size variants
- `text-primary`, `text-success`, etc. - Text color classes

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

**Spinner not appearing**
- Ensure the spinner directive is properly imported
- Check that Bootstrap CSS is loaded
- Verify that the element is not hidden by CSS

**Animation not smooth**
- Ensure hardware acceleration is enabled in the browser
- Check for conflicting CSS animations
- Verify that the element has proper positioning

**Color not applying**
- Check that the color name is a valid Bootstrap variant
- For custom colors, ensure proper CSS color syntax
- Verify that text color classes are not being overridden

**Size not working correctly**
- Confirm that Bootstrap size classes are available
- Check for conflicting CSS that might override dimensions
- Ensure proper spacing around sized spinners

**Accessibility issues**
- Add appropriate ARIA labels for screen readers
- Ensure sufficient color contrast for visibility
- Provide text alternatives for loading states

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
