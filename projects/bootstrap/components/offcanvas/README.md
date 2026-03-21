# @pmeig/ngb-offcanvas

A powerful Angular library that provides Bootstrap-styled offcanvas sidebar components with flexible positioning, responsive behavior, and advanced interaction controls.

## Installation
```bash
  npm install @pmeig/ngb-offcanvas
```
## Features

- 🎯 **OffcanvasMaterial Component** - Full-featured offcanvas with Bootstrap styling
- 📦 **Position Control** - Start, end, top, and bottom positioning options
- 🔄 **Responsive Behavior** - Breakpoint-based visibility with responsive classes
- ✨ **Backdrop Options** - Customizable backdrop and click-outside behavior
- 🎨 **Static Mode** - Non-dismissible offcanvas for persistent sidebars
- 📱 **Scrollable Content** - Optional body scrolling when offcanvas is open
- 🚀 Angular 21.2.0 support with signals
- ♿ Accessibility friendly with ARIA attributes
- 🛠️ Element and programmatic control options
- 🎭 Smooth animations with show/hide transitions

## Usage

### Import the Module
```typescript
import { OffcanvasMaterial } from '@pmeig/ngb-offcanvas';
@Component({
imports: [OffcanvasMaterial],
// ...
})
export class MyComponent { }
```
### Basic Offcanvas
```html
<offcanvas #sidebar title="Sidebar Menu">
  <ul class="nav flex-column">
    <li class="nav-item">
      <a class="nav-link" href="#">Home</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">About</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Contact</a>
    </li>
  </ul>
</offcanvas>

<button class="btn btn-primary" (click)="sidebar.open(true)">
Open Sidebar
</button>
```
### Element-Triggered Offcanvas
```html
<button #triggerBtn class="btn btn-primary" type="button">
Toggle Offcanvas
</button>

<offcanvas [show]="triggerBtn" title="Navigation">
  <nav class="nav flex-column">
    <a class="nav-link active" href="#">Active Link</a>
    <a class="nav-link" href="#">Link</a>
    <a class="nav-link" href="#">Another Link</a>
  </nav>
</offcanvas>
```
### Different Positions
```html
<!-- Left Side (Start) -->
<offcanvas position="start" title="Left Sidebar">
  <p>Content slides in from the left.</p>
</offcanvas>

<!-- Right Side (End) -->
<offcanvas position="end" title="Right Sidebar">
  <p>Content slides in from the right.</p>
</offcanvas>

<!-- Top -->
<offcanvas position="top" title="Top Panel">
  <p>Content slides down from the top.</p>
</offcanvas>

<!-- Bottom -->
<offcanvas position="bottom" title="Bottom Panel">
  <p>Content slides up from the bottom.</p>
</offcanvas>
```
### Responsive Offcanvas
```html
<!-- Only show offcanvas below large breakpoint -->
<offcanvas responsive="lg" title="Responsive Menu">
  <nav class="nav flex-column">
    <a class="nav-link" href="#">Home</a>
    <a class="nav-link" href="#">Products</a>
    <a class="nav-link" href="#">Services</a>
  </nav>
</offcanvas>
```
### Custom Header Content
```html
<offcanvas position="end">
  <ng-container header>
    <div class="d-flex align-items-center">
      <img src="/logo.png" width="32" height="32" class="me-2">
      <h5 class="offcanvas-title mb-0">Custom Header</h5>
    </div>
  </ng-container>

  <div>
    <p>Custom header content with logo and styling.</p>
  </div>
</offcanvas>
```
### Static Offcanvas (Non-dismissible)
```html
<offcanvas static backdrop="false" close="false" title="Persistent Sidebar">
  <p>This offcanvas cannot be dismissed by clicking outside or using the close button.</p>
  <button class="btn btn-primary" (click)="closeOffcanvas()">
    Close Programmatically
  </button>
</offcanvas>
```
## API Reference

### Offcanvas Component Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `show` | `boolean \| Element` | `false` | Controls visibility - boolean for programmatic control, Element for trigger-based |
| `position` | `'start' \| 'end' \| 'top' \| 'bottom'` | `'start'` | Position where offcanvas appears from |
| `responsive` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'offcanvas'` | Breakpoint below which offcanvas is hidden |
| `backdrop` | `boolean` | `true` | Shows backdrop overlay |
| `scrollable` | `boolean` | `false` | Allows body scrolling when offcanvas is open |
| `static` | `boolean` | `false` | Prevents dismissing by clicking outside |
| `close` | `boolean` | `true` | Shows close button in header |
| `title` | `string` | `undefined` | Title text for the header |

### Events
| Event | Type | Description |
|-------|------|-------------|
| `showChange` | `boolean` | Emitted when offcanvas visibility changes |

### Methods
| Method | Parameters | Description |
|--------|------------|-------------|
| `open()` | `show: boolean` | Programmatically opens or closes the offcanvas |

#### Content Projection Slots
- **Default slot**: Main offcanvas body content
- **`[header]` slot**: Custom header content

## How It Works

### Animation and State Management
The offcanvas component automatically:
1. **State Tracking**: Uses signals to manage visibility, animation, and DOM states
2. **Smooth Transitions**: Handles CSS transitions with proper timing
3. **Body Scrolling**: Controls body overflow when offcanvas is open
4. **Backdrop Management**: Dynamically inserts/removes backdrop elements
5. **Click Handling**: Manages outside clicks and backdrop dismissal

### Responsive Behavior
- **Breakpoint Control**: Shows/hides based on screen size
- **Position Awareness**: Handles click detection based on position
- **Touch Support**: Works with touch interactions on mobile devices

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 offcanvas classes:
- `offcanvas` - Base offcanvas styling
- `offcanvas-start`, `offcanvas-end` - Horizontal positioning
- `offcanvas-top`, `offcanvas-bottom` - Vertical positioning
- `offcanvas-sm`, `offcanvas-md`, `offcanvas-lg`, etc. - Responsive variants
- `offcanvas-header` - Header section styling
- `offcanvas-title` - Title element styling
- `offcanvas-body` - Content area styling
- `offcanvas-backdrop` - Backdrop overlay
- `show`, `showing`, `hiding` - Animation states

## Position Options

Available positioning configurations:
- **Start**: `position="start"` - Slides in from left (default)
- **End**: `position="end"` - Slides in from right
- **Top**: `position="top"` - Slides down from top
- **Bottom**: `position="bottom"` - Slides up from bottom

## Responsive Breakpoints

Control when offcanvas is hidden:
- **Small**: `responsive="sm"` - Hidden above 576px
- **Medium**: `responsive="md"` - Hidden above 768px
- **Large**: `responsive="lg"` - Hidden above 992px
- **Extra Large**: `responsive="xl"` - Hidden above 1200px
- **XXL**: `responsive="xxl"` - Hidden above 1400px

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

**Offcanvas not appearing**
- Check that the trigger element or show property is properly set
- Verify that there are no conflicting z-index styles

**Backdrop not working correctly**
- Confirm `backdrop` is set to `true`
- Check that `static` is not preventing dismissal
- Ensure click events are not being prevented

**Scrolling issues**
- Use `scrollable="true"` to allow body scrolling
- Check for fixed positioning conflicts
- Verify that content height is appropriate

**Responsive behavior not working**
- Ensure correct breakpoint value is used
- Check that responsive CSS is loaded
- Verify screen size detection is working

**Animation glitches**
- Allow sufficient time for animations to complete
- Check for conflicting CSS transitions
- Ensure proper cleanup of animation classes

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
