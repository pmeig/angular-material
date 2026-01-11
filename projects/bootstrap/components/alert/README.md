
# @pmeig/ngb-alert

A powerful Angular library that provides Bootstrap-styled alert components with automatic dismissal, animations, and enhanced functionality.

## Installation
```bash 
  npm install @pmeig/ngb-alert
``` 

## Features

- 🎯 **BAlertDirective** - Main alert directive with show/hide functionality
- 🔗 **BAlertLinkDirective** - Automatic alert link styling  
- 📝 **BAlertHeaderDirective** - Automatic alert heading styling
- ⏱️ **Auto-dismiss** - Configurable timeout for automatic dismissal
- ✨ **Smooth Animations** - Bootstrap fade transitions
- 🎨 **All Bootstrap Colors** - Support for all Bootstrap alert variants
- 🚀 **Angular 20.2.1 support** with signals
- 📱 **Responsive design**
- ♿ **Accessibility friendly**
- 🔄 **Dynamic Control** - Programmatic show/hide control

## Usage

### Import the Module
```typescript 
import { AlertMaterial } from '@pmeig/ngb-alert';
@NgModule({ imports: [ AlertMaterial ],
  // ... 
  })
  export class AppModule { }
``` 

### Basic Alert
By default alerts stay in DOM 3 seconds
```html
<div *alert="alert()">
  **Success!** Your action was completed successfully.
</div>
``` 

### Alert with Different Colors
```html
<!-- Primary Alert -->
<div *alert="alert(); color: 'primary'">
  <strong>Primary!</strong> This is a primary alert with useful information.
</div>

<!-- Secondary Alert -->
<div *alert="alert(); color: 'secondary'">
  <strong>Secondary!</strong> This is a secondary alert with neutral information.
</div>

<!-- Success Alert -->
<div *alert="alert(); color: 'success'">
  <strong>Success!</strong> Your action was completed successfully.
</div>

<!-- Danger Alert -->
<div *alert="alert(); color: 'danger'">
  <strong>Error!</strong> Something went wrong. Please try again.
</div>

<!-- Warning Alert -->
<div *alert="alert(); color: 'warning'">
  <strong>Warning!</strong> Please check your input before proceeding.
</div>

<!-- Info Alert -->
<div *alert="alert(); color: 'info'">
  <strong>Info!</strong> Here's some important information for you.
</div>

<!-- Light Alert -->
<div *alert="alert(); color: 'light'">
  <strong>Light!</strong> This is a light alert with subtle styling.
</div>

<!-- Dark Alert -->
<div *alert="alert(); color: 'dark'">
  <strong>Dark!</strong> This is a dark alert with bold contrast.
</div>

``` 

### Auto-Dismissible Alert
```html
<div *alert="alert(); timeout: 5000">
  **Auto-dismiss!** This alert will disappear after 5 seconds.
</div>

<div *alert="!alert(); timeout: {value: 5, unit: TimeoutUnit.SECOND}">
  **Auto-dismiss!** This alert will disappear  after 5 seconds too.
</div>
``` 

### Manually Dismissible Alert
```html
<div *alert="alert(); close: true; timeout: null">
  **Dismissible!** Click the × button to close this alert.
</div>
```

### Programmatic Control
```typescript 
export class MyComponent { 
  readonly alert = signal(false);
}
```
```html
<div *alert="alert()">
</div>
<button class="btn btn-primary" (click)="alert.update(last => !last)">Show Alert <button class="btn btn-secondary" (click)="hideAlert()">Hide Alert
``` 

## API Reference

### BAlertDirective

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `alert` | `boolean` | `false` | Controls alert visibility |
| `alertColor` | `string` | `'alert-danger'` | Bootstrap alert color variant |
| `alertClose` | `boolean` | `false` | Shows close button for manual dismissal |
| `alertTimeout` | `Timeout \| null` | `{value: 3, unit: 'second'}` | Auto-dismiss timeout configuration |

#### Color Options
- `primary` / `alert-primary`
- `secondary` / `alert-secondary` 
- `success` / `alert-success`
- `danger` / `alert-danger` // is default value
- `warning` / `alert-warning`
- `info` / `alert-info`
- `light` / `alert-light`
- `dark` / `alert-dark`

#### Timeout Configuration
```typescript 
// 5 seconds [alertTimeout]="{value: 5, unit: 'second'}"
// 2000 milliseconds [alertTimeout]="{value: 2000, unit: 'millisecond'}"
```


## Bootstrap Classes Support
This library generates and works with standard Bootstrap 5 alert classes:
- `alert` - Base alert class
- `alert-*` - Color variants (primary, secondary, success, danger, warning, info, light, dark)
- - For dismissible alerts `alert-dismissible`
- - For heading elements `alert-heading`
- - For styled links `alert-link`
- `fade`, `show` - Animation classes

## Integration with Other Modules
Works seamlessly with other @pmeig modules:
```typescript
import { PmeigComponentsMaterial } from '@pmeig/ngb-material';

@NgModule({
  imports: [
    PmeigComponentsMaterial // Includes AlertMaterial + other components
  ]
})
export class AppModule { }
```


## Dependencies
- **Angular**: >=20.2.1
- : >=20.2.1 **@angular/common**
- : ^0.0.1 **@pmeig/ngb-core**
- **tslib**: ^2.3.0

## Compatibility
- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)


## Troubleshooting
### Common Issues
**Alert not showing**
- Ensure `*alert="true"` is set
- Check that AlertMaterial is imported in your module

**Animations not working**
- Check for conflicting CSS that might disable transitions

**Auto-dismiss not working**
- Verify timeout configuration is correct
- Check that the timeout value and unit are properly set

**Links and headers not styled**
- Ensure elements are inside the alert container
- Check that the directives are properly imported

## License
This project is licensed under the MIT License.
## Support
For issues and questions, please open an issue on the GitHub repository.
