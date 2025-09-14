# @pmeig/ngb-navbar

A powerful Angular library that provides Bootstrap-styled navigation bar components with responsive behavior, collapse integration, and offcanvas support.

## Installation
```bash
  npm install @pmeig/ngb-navbar
```
## Features

- 🎯 **BNavbarComponent** - Full-featured navbar with responsive collapse and offcanvas support
- 📦 **BNavDirective** - Flexible nav component with pills, tabs, and underline styles
- 🔄 **Responsive Toggler** - Automatic breakpoint-based collapse behavior
- ✨ **Offcanvas Integration** - Seamless mobile navigation with sidebar support
- 🎨 **Brand Support** - Text and custom brand content projection
- 🔢 **Content Slots** - Header, navigation, and auxiliary content areas
- 📱 **Responsive Design** - Mobile-first approach with configurable breakpoints
- 🚀 Angular 20.2.1 support with signals
- ♿ Accessibility friendly with ARIA attributes
- 🛠️ Scrollable navigation support

## Usage

### Import the Module
```typescript
import { NavbarMaterial } from '@pmeig/ngb-navbar';
@Component({
imports: [NavbarMaterial],
// ...
})
export class MyComponent { }
```
### Basic Navbar
```html
<navbar brand="My App">
<a href="#" class="nav-link">Home</a>
<a href="#" class="nav-link">About</a>
<a href="#" class="nav-link">Contact</a>
</navbar>
```
### Navbar with Custom Brand
```html
<navbar>
<ng-container brand>
<img src="/logo.png" alt="Logo" width="30" height="30" class="me-2">
<span class="fw-bold">My Application</span>
</ng-container>

<a href="#" class="nav-link">Dashboard</a>
<a href="#" class="nav-link">Projects</a>
<a href="#" class="nav-link">Settings</a>
</navbar>
```
### Responsive Navbar with Toggler
```html
<navbar brand="My App" toggler="lg">
<a href="#" class="nav-link">Home</a>
<a href="#" class="nav-link">Products</a>
<a href="#" class="nav-link">Services</a>
<a href="#" class="nav-link">Contact</a>

  <div next class="d-flex">
    <button class="btn btn-outline-primary">Login</button>
  </div>
</navbar>
```
### Navbar with Offcanvas
```html
<navbar brand="My App" [offcanvas]="true" toggler="md">
  <div header>
    <h5 class="offcanvas-title">Navigation Menu</h5>
  </div>

<a href="#" class="nav-link">Home</a>
<a href="#" class="nav-link">About</a>
<a href="#" class="nav-link">Services</a>
<a href="#" class="nav-link">Portfolio</a>
<a href="#" class="nav-link">Contact</a>
</navbar>
```
### Navigation with Different Styles
```html
<!-- Pills Navigation -->
<nav format="pills">
  <a href="#" class="nav-link active">Active</a>
  <a href="#" class="nav-link">Link</a>
  <a href="#" class="nav-link">Another Link</a>
</nav>

<!-- Tabs Navigation -->
<nav format="tabs">
  <a href="#" class="nav-link active">Active</a>
  <a href="#" class="nav-link">Link</a>
  <a href="#" class="nav-link">Disabled</a>
</nav>

<!-- Underline Navigation -->
<nav format="underline">
  <a href="#" class="nav-link active">Active</a>
  <a href="#" class="nav-link">Link</a>
  <a href="#" class="nav-link">Another Link</a>
</nav>
```
### Vertical Navigation
```html
<nav direction="vertical" format="pills">
  <a href="#" class="nav-link active">Home</a>
  <a href="#" class="nav-link">Profile</a>
  <a href="#" class="nav-link">Messages</a>
  <a href="#" class="nav-link">Settings</a>
</nav>
```
## API Reference

### Navbar Component Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `brand` | `string` | `undefined` | Brand text displayed in navbar |
| `offcanvas` | `boolean` | `false` | Use offcanvas instead of collapse for mobile navigation |
| `toggler` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'lg'` | Breakpoint at which navbar collapses |
| `scroll` | `string` | `undefined` | CSS size for scrollable navigation area |

### Nav Directive Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `format` | `'pills' \| 'tabs' \| 'underline'` | `''` | Visual style of navigation items |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of navigation |
| `spaces` | `'fill' \| 'justified'` | `''` | Space distribution of navigation items |
| `name` | `string` | `''` | Identifier for the navigation component |
| `navigator` | `string` | `'page'` | Navigation context identifier |

#### Content Projection Slots
- **Default slot**: Main navigation links and content
- **`[brand]` slot**: Custom brand content
- **`[header]` slot**: Header content for offcanvas mode
- **`[next]` slot**: Additional content (buttons, forms, etc.)

### Events
- `togglerClicked`: Emitted when mobile toggler button is clicked

## How It Works

### Responsive Behavior
The navbar component automatically:
1. **Breakpoint Detection**: Monitors screen size and shows/hides toggler button
2. **Collapse Integration**: Uses collapse directive for smooth transitions
3. **Offcanvas Support**: Switches to sidebar navigation on mobile when enabled
4. **Content Organization**: Organizes navigation items and auxiliary content

### Navigation Styling
The nav directive provides:
- **Automatic item wrapping**: Wraps content in appropriate nav structure
- **Dynamic styling**: Applies Bootstrap classes based on format and direction
- **Flexible layouts**: Supports both list-based and div-based navigation

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 navbar classes:
- `navbar` - Main navbar container
- `navbar-brand` - Brand area
- `navbar-toggler` - Mobile toggle button
- `navbar-collapse` - Collapsible content area
- `navbar-nav` - Navigation list
- `navbar-expand-{breakpoint}` - Responsive breakpoints
- `nav` - Base navigation styling
- `nav-pills`, `nav-tabs`, `nav-underline` - Style variants
- `nav-fill`, `nav-justified` - Space distribution
- `nav-link` - Navigation link styling
- `nav-item` - Navigation item container

## Breakpoint Options

Available responsive breakpoints:
- **Small**: `toggler="sm"` - Collapses below 576px
- **Medium**: `toggler="md"` - Collapses below 768px
- **Large**: `toggler="lg"` - Collapses below 992px (default)
- **Extra Large**: `toggler="xl"` - Collapses below 1200px
- **XXL**: `toggler="xxl"` - Collapses below 1400px

## Dependencies

- **Angular**: ^20.2.1
- **@angular/common**: ^20.2.1
- **@pmeig/ngb-collapse**: ^0.0.1
- **@pmeig/ngb-offcanvas**: ^0.0.1
- **tslib**: ^2.3.0

## Compatibility

- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Troubleshooting

### Common Issues

**Navbar not collapsing properly**
- Ensure the correct breakpoint is set with `toggler` attribute

**Offcanvas not working**
- Confirm that `@pmeig/ngb-offcanvas` is installed and imported
- Check that `[offcanvas]="true"` is set
- Verify that header content is provided for offcanvas mode

**Brand not displaying**
- Use either `brand="text"` attribute or `[brand]` content projection, not both
- Check for conflicting CSS that might hide the brand area
- Ensure proper template syntax for content projection

**Navigation links not styling correctly**
- Add `nav-link` class to anchor elements
- Use proper nav structure with nav directive
- Check that Bootstrap navigation CSS is loaded

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
