
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
- 🚀 **Angular 21.2.0 support** with signals
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

<div *alert="alert(); timeout: fiveSeconds"> <!-- fiveSeconds = { value: 5, unit: TimeoutUnit.SECOND } in the component -->
  **Auto-dismiss!** This alert will disappear  after 5 seconds too.
</div>
``` 

### Manually Dismissible Alert
```html
<div *alert="alert(); close: true; timeout: null">
  **Dismissible!** Click the × button to close this alert.
</div>
```
With `timeout: null` the close button is **always** added (`close: false` is ignored): an alert cannot stay without
either a timeout or a close button.

### Programmatic Control
```typescript 
export class MyComponent { 
  readonly alert = signal(false);
}
```
```html
<div *alert="alert()">Saved!</div>
<button color="primary" (click)="alert.set(true)">Show Alert</button>
<button color="secondary" (click)="alert.set(false)">Hide Alert</button>
```
The alert hides itself (timeout, close button) without telling the parent: `alert()` stays `true`, and setting it to
`true` again does not show it again. Set it to `false` first (or use a value that changes, such as a message).

`*alert` (empty) and `*alert="''"` are **hidden**: pass `true` or a condition.

## API Reference

### BAlertDirective

| Property | Type | Default | Description |
|----------|------|---------|-------------|
In the microsyntax, `color:`, `close:` and `timeout:` set `alertColor`, `alertClose` and `alertTimeout`.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `alert` | `boolean` | `false` | Shows (`true`) / hides (`false`) the alert when it changes |
| `alertColor` (`color:`) | `ColorAttribute` | `'danger'` | Bootstrap color name |
| `alertClose` (`close:`) | `boolean` | `false` | Shows a close button (always shown when there is no timeout) |
| `alertTimeout` (`timeout:`) | `number \| Timeout \| null` | 3 seconds | Auto-dismiss: a number is in milliseconds; `null` = never |

#### Color Options
`primary`, `secondary`, `success`, `danger` (default), `warning`, `info`, `light`, `dark`. Write the color name only:
`'alert-primary'` is not recognized (it is read as a custom color and gives no class).

#### Timeout Configuration
```html
<div *alert="shown(); timeout: 5000">5 seconds (a number is in milliseconds)</div>
<div *alert="shown(); timeout: fiveSeconds">5 seconds, with fiveSeconds = { value: 5, unit: TimeoutUnit.SECOND }</div>
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
import { PmeigFormsMaterial } from '@pmeig/ngb-material';

@NgModule({
  imports: [
    PmeigFormsMaterial // AlertMaterial + inputs, labels, buttons, selects, forms, dropdown, progress, tooltip, toast, spinner
  ]
})
export class AppModule { }
```


## Dependencies
- **Angular**: >=21.2.0
- **@angular/common**: >=21.2.0
- **@pmeig/ngb-core**: ^2.0.0
- **tslib**: ^2.3.0

## Compatibility
- Angular: 21.2.0+
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
