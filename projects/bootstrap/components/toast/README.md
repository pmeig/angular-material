# @pmeig/ngb-toast

A powerful Angular library that provides Bootstrap-styled toast notification components with flexible content projection, color theming, and smooth show/hide animations.

## Installation
```bash
  npm install @pmeig/ngb-toast
```
## Features

- 🎯 **ToastMaterial Component** - Full-featured toast component with Bootstrap styling
- 📦 **Content Projection** - Header and body content slots with template support
- 🔄 **Show/Hide Control** - Programmatic and observable-based visibility control
- ✨ **Color Theming** - Bootstrap color variants and custom color support
- 🎨 **Smooth Animations** - Fade in/out transitions with proper timing
- 📱 **Responsive Design** - Mobile-friendly toast notifications
- 🚀 Angular 20.2.1 support with signals
- ♿ Accessibility friendly with ARIA attributes
- 🛠️ Flexible positioning and stacking support
- 🎭 Template-driven content with lifecycle management

## Usage

### Import the Module
```typescript
import { ToastMaterial } from '@pmeig/ngb-toast';
@Component({
imports: [ToastMaterial],
// ...
})
export class MyComponent { }
```
### Basic Toast
```html
<toast [show]="showToast">
  <div>This is a basic toast notification.</div>
</toast>

<button class="btn btn-primary" (click)="showToast = !showToast">
  Toggle Toast
</button>
```

### Toast with Header
```html
<toast [show]="showSuccessToast" color="success">
  <ng-container header>
    <i class="bi bi-check-circle-fill me-2"></i>
    <strong class="me-auto">Success</strong>
    <small>2 seconds ago</small>
    <button type="button" class="btn-close ms-2" (click)="showSuccessToast = false"></button>
  </ng-container>
  
  <div>Your changes have been saved successfully!</div>
</toast>
```

### Colored Toast Notifications
```html
<!-- Success Toast -->
<toast [show]="showSuccess" color="success">
  <div>Operation completed successfully!</div>
</toast>

<!-- Error Toast -->
<toast [show]="showError" color="danger">
  <div>An error occurred while processing your request.</div>
</toast>

<!-- Warning Toast -->
<toast [show]="showWarning" color="warning">
  <div>Please review your input before continuing.</div>
</toast>

<!-- Info Toast -->
<toast [show]="showInfo" color="info">
  <div>New updates are available for download.</div>
</toast>
```

### Toast with Custom Content
```html
<toast [show]="showCustomToast" color="primary">
  <ng-template header>
    <div class="d-flex align-items-center w-100">
      <img src="/logo.png" width="20" height="20" class="me-2">
      <strong class="me-auto">App Notification</strong>
      <small class="text-muted">now</small>
      <button type="button" class="btn-close ms-2" (click)="closeCustomToast()"></button>
    </div>
  </ng-template>
  
  <div>
    <p class="mb-2">You have received a new message from John Doe.</p>
    <div class="d-flex gap-2">
      <button class="btn btn-sm btn-primary">View</button>
      <button class="btn btn-sm btn-outline-secondary" (click)="dismissToast()">Dismiss</button>
    </div>
  </div>
</toast>
```

### Toast with Observable Control
```html
<toast [orchestrator]="toastTrigger$" [show]="isToastVisible">
  <div>This toast is controlled by an observable.</div>
</toast>
```

```typescript
export class MyComponent {
  toastTrigger$ = new Subject<boolean>();
  isToastVisible = false;
  
  showToastFromObservable() {
    this.isToastVisible = true;
    this.toastTrigger$.next(true);
  }
}
```

### Stacked Toasts Container
```html
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <toast [show]="notifications.length > 0" color="success">
    <ng-container header>
      <strong class="me-auto">Notification</strong>
      <button type="button" class="btn-close" (click)="clearNotifications()"></button>
    </ng-container>
    <div>{{ notifications[0]?.message }}</div>
  </toast>
  
  <toast [show]="errors.length > 0" color="danger">
    <ng-container header>
      <strong class="me-auto">Error</strong>
      <button type="button" class="btn-close" (click)="clearErrors()"></button>
    </ng-container>
    <div>{{ errors[0]?.message }}</div>
  </toast>
</div>
```

## API Reference

### Toast Component Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `show` | `boolean` | `false` | Controls toast visibility |
| `color` | `ColorConfig \| ColorAttribute` | `undefined` | Toast color theme |
| `orchestrator` | `Element \| Observable<any>` | `undefined` | External control element or observable |

### Methods
| Method | Description |
|--------|-------------|
| `showing()` | Programmatically shows the toast |
| `hide()` | Programmatically hides the toast |

#### Content Projection Slots
- **Default slot**: Main toast body content
- **`[header]` slot**: Custom header content
- **Template support**: Use `<ng-template>` for complex content structures

## How It Works

### Toast Lifecycle
The toast component automatically:
1. **State Management**: Uses signals to track display, showing, and layout states
2. **Animation Control**: Manages CSS transitions for smooth show/hide effects
3. **Content Rendering**: Handles header and body content projection
4. **Event Handling**: Responds to show/hide triggers from various sources
5. **Accessibility**: Maintains proper ARIA roles and attributes

### Animation States
- **Layout**: Controls DOM presence of toast element
- **Showing**: Manages transition animations
- **Show**: Final visible state with full opacity

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 toast classes:
- `toast` - Base toast styling
- `toast-header` - Header section styling
- `toast-body` - Body content styling
- `fade` - Fade transition effect
- `show` - Visible state
- `text-bg-{color}` - Color variants with proper contrast
- Custom animation states: `showing`, `hide`

## Color Options

Available Bootstrap color variants:
- `primary`, `secondary`, `success`, `danger`
- `warning`, `info`, `light`, `dark`
- Custom CSS colors (hex, rgb, hsl, etc.)

## Dependencies

- **Angular**: ^20.2.1
- **@angular/common**: ^20.2.1
- **@pmeig/ngb-core**: ^0.0.1
- **tslib**: ^2.3.0

## Compatibility

- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Troubleshooting

### Common Issues

**Toast not appearing**
- Ensure `[show]="true"` is set when you want the toast visible
- Check that Bootstrap CSS is properly loaded
- Verify that the toast container has proper positioning

**Animations not working smoothly**
- Ensure sufficient time for animations to complete before state changes
- Check that CSS transitions are not being overridden
- Verify that the component lifecycle is properly managed

**Content not displaying correctly**
- Use appropriate content projection slots (`[header]` for headers)
- Check for template reference syntax errors
- Ensure content is properly nested within toast tags

**Colors not applying**
- Verify that Bootstrap color classes are available
- Check that color names are valid Bootstrap variants
- For custom colors, ensure proper CSS color syntax

**Stacking issues**
- Use proper z-index values for toast containers
- Ensure toast containers have fixed positioning
- Check for conflicting CSS that might affect layering

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
