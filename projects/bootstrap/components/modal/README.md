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
- ♿ Accessibility friendly with ARIA attributes
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
```html
<modal #customModal>
  <ng-template header>
    <h4 class="modal-title">Custom Header</h4>
  </ng-template>
  
  <div>
    <p>Modal body content goes here.</p>
    <p>You can include any HTML content.</p>
  </div>
  
  <ng-template footer>
    <button type="button" class="btn btn-secondary" (click)="customModal.close()">
      Cancel
    </button>
    <button type="button" class="btn btn-primary">
      Save Changes
    </button>
  </ng-template>
</modal>
```


### Controlled Modal
```html
<modal [show]="isModalOpen" 
       title="Controlled Modal"
       (close)="isModalOpen = false">
  <p>This modal is controlled by a component property.</p>
</modal>

<button class="btn btn-primary" (click)="isModalOpen = true">
  Open Controlled Modal
</button>
```


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
| `show` | `boolean` | `false` | Controls modal visibility |
| `animation` | `'zoom' \| 'fade'` | `'zoom'` | Animation type for show/hide transitions |
| `cross` | `boolean` | `true` | Shows close button (×) in header |
| `backdrop` | `boolean` | `true` | Shows backdrop overlay |
| `closeOutside` | `boolean` | `true` | Allows closing by clicking outside modal |
| `fullscreen` | `boolean \| string` | `false` | Fullscreen mode or size breakpoint |
| `timeout` | `number` | `undefined` | Auto-close timeout in milliseconds |
| `sizeAttribute` | `'sm' \| 'lg' \| 'xl'` | `undefined` | Modal size variant |
| `center` | `boolean` | `true` | Centers modal vertically |
| `scrollable` | `boolean` | `true` | Makes modal body scrollable |

### Modal Interface Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `open()` | `void` | Opens the modal |
| `close()` | `void` | Closes the modal |
| `visible` | `Signal<boolean>` | Signal indicating modal visibility state |
| `reference` | `string` | Unique reference identifier for the modal |

#### Content Projection Slots
- **Default slot**: Main modal body content
- **`[header]` slot**: Custom header content
- **`[footer]` slot**: Custom footer content
- **`[btn]` slot**: Custom button content in header

## How It Works

### Modal Lifecycle
The modal component automatically:
1. **State Management**: Uses signals to track visibility and animation states
2. **DOM Manipulation**: Dynamically shows/hides modal and backdrop elements
3. **Animation Handling**: Manages CSS transitions between states
4. **Event Management**: Handles click events for backdrop and close actions
5. **Timeout Management**: Automatically closes modal when timeout is set

### Accessibility Features
- **ARIA Attributes**: Automatically manages `aria-expanded` and `aria-controls`
- **Focus Management**: Maintains proper focus within modal
- **Keyboard Support**: ESC key support for closing (via backdrop click handling)
- **Screen Reader Support**: Proper markup structure for assistive technologies

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
- **@pmeig/ngb-button**: ^0.0.1
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
- Check that `closeOutside` is set to `true` (default)
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
