# @pmeig/ngb-list

A powerful Angular library that provides Bootstrap-styled list group components with interactive functionality, customizable styling, and action support.

## Installation
```bash
  npm install @pmeig/ngb-list
```
## Features

- 🎯 **BListGroupDirective** - Smart list group directive with comprehensive styling options
- 📦 **ListGroupActionDirective** - Interactive action support for buttons and links
- 🔄 **Direction Support** - Vertical and horizontal list layouts
- ✨ **Flush Mode** - Optional flush styling for seamless design
- 🎨 **Color Theming** - Bootstrap color variants and custom background colors
- 🔢 **Numbered Lists** - Automatic numbering for ordered lists
- 📱 **Striped Styling** - Alternating row colors for better readability
- 🚀 Angular 20.2.1 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly
- 🛠️ Interactive action elements

## Usage

### Import the Module
```typescript
import { ListMaterial } from '@pmeig/ngb-list';
@NgModule({
imports: [ ListMaterial ],
// ...
})
export class AppModule { }
```
### Basic List Group
```html
<list-group>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
  <li>Fourth item</li>
</list-group>
```
### Interactive Action List
```html
<list-group>
  <button type="button">Clickable item with button</button>
  <button type="button">Second clickable item</button>
  <a href="#">Clickable item with link</a>
  <button type="button" disabled>Disabled item</button>
</list-group>
```
### Horizontal List Group
```html
<list-group direction="horizontal">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</list-group>
```
### Flush List Group
```html
<list-group flush>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</list-group>
```
### Numbered List Group
```html
<list-group numbered>
  <li>First numbered item</li>
  <li>Second numbered item</li>
  <li>Third numbered item</li>
</list-group>
```
### Colored List Group
```html
<list-group background="primary">
  <li>Primary background item</li>
  <li>Another primary item</li>
</list-group>

<list-group background="danger">
  <li>Danger background item</li>
  <li>Another danger item</li>
</list-group>
```
### Striped List Group
```html
<list-group background="light" stripped>
  <li>First item (colored)</li>
  <li>Second item (transparent)</li>
  <li>Third item (colored)</li>
  <li>Fourth item (transparent)</li>
</list-group>
```
## API Reference

### List Group Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction of the list group |
| `flush` | `boolean` | `false` | Removes borders and rounded corners for flush styling |
| `numbered` | `boolean` | `false` | Adds automatic numbering to list items |
| `background` | `string` | `''` | Background color using Bootstrap color variants or custom CSS colors |
| `stripped` | `boolean` | `false` | Applies alternating background colors to list items |

#### Content Projection
- **Default slot**: List items (`<li>`, `<button>`, `<a>` elements)
- **Interactive elements**: Buttons and links automatically become actionable items

### Action Directive
The `ListGroupActionDirective` automatically applies to `<button>` and `<a>` elements within list groups:
- Adds `list-group-item-action` class
- Provides click functionality with active state toggling
- Removes conflicting button styling classes

## How It Works

### Automatic Item Styling
The list group directive automatically:
1. **Applies base classes**: Adds `list-group` to container and `list-group-item` to children
2. **Manages layout**: Handles horizontal/vertical orientations
3. **Colors items**: Applies background colors and striping patterns
4. **Handles actions**: Integrates with action directive for interactive elements

### Interactive Behavior
- **Active states**: Click to toggle active state on action items
- **Button styling**: Automatically removes conflicting button classes
- **Accessibility**: Maintains proper ARIA attributes and keyboard navigation

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 list group classes:
- `list-group` - Main list group container
- `list-group-item` - Individual list items
- `list-group-horizontal` - Horizontal layout variant
- `list-group-flush` - Flush variant without borders
- `list-group-numbered` - Numbered list variant
- `list-group-item-action` - Interactive action items
- `list-group-item-{color}` - Color variants (primary, secondary, success, etc.)

## Color Variants

Supports all Bootstrap color variants:
- `primary`, `secondary`, `success`, `danger`
- `warning`, `info`, `light`, `dark`
- Custom CSS color values (hex, rgb, hsl, etc.)

## Dependencies

- **Angular**: >=20.2.1
- **@angular/common**: >=20.2.1
- **@pmeig/ngb-core**: ^0.0.1
- **@pmeig/ng-material-core**: ^0.0.1
- **tslib**: ^2.3.0

## Compatibility

- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Common Patterns

### Navigation Menu
```html
<list-group>
  <a href="/dashboard">
    <i class="bi bi-house"></i> Dashboard
  </a>
  <a href="/profile">
    <i class="bi bi-person"></i> Profile
  </a>
  <a href="/settings">
    <i class="bi bi-gear"></i> Settings
  </a>
</list-group>
```


### Task List
```html
<list-group numbered>
  <button type="button" class="d-flex justify-content-between align-items-center">
    Review code changes
    <span class="badge bg-primary rounded-pill">2</span>
  </button>
  <button type="button" class="d-flex justify-content-between align-items-center">
    Update documentation
    <span class="badge bg-secondary rounded-pill">1</span>
  </button>
  <button type="button" class="d-flex justify-content-between align-items-center">
    Deploy to staging
    <span class="badge bg-success rounded-pill">5</span>
  </button>
</list-group>
```


### Status Dashboard
```html
<list-group>
  <li class="d-flex justify-content-between align-items-center list-group-item-success">
    API Server
    <span class="badge bg-success">Online</span>
  </li>
  <li class="d-flex justify-content-between align-items-center list-group-item-warning">
    Database
    <span class="badge bg-warning">Warning</span>
  </li>
  <li class="d-flex justify-content-between align-items-center list-group-item-danger">
    Cache Server
    <span class="badge bg-danger">Offline</span>
  </li>
</list-group>
```


### Settings Panel
```html
<list-group flush>
  <button type="button" class="d-flex justify-content-between align-items-center">
    <div>
      <div class="fw-bold">Email notifications</div>
      <div class="text-muted small">Receive updates via email</div>
    </div>
    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" checked>
    </div>
  </button>
  
  <button type="button" class="d-flex justify-content-between align-items-center">
    <div>
      <div class="fw-bold">Push notifications</div>
      <div class="text-muted small">Receive browser notifications</div>
    </div>
    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox">
    </div>
  </button>
</list-group>
```


## Troubleshooting

### Common Issues

**List items not styling properly**
- Ensure list items are direct children of the `list-group` element
- Verify that conflicting CSS rules aren't overriding styles

**Action items not responding to clicks**
- Confirm that interactive elements are `<button>` or `<a>` tags
- Check that the elements are not disabled
- Verify that the `ListGroupActionDirective` is properly imported

**Colors not applying correctly**
- Use valid Bootstrap color variant names (primary, success, etc.)
- For custom colors, ensure they are valid CSS color values
- Check that the `background` attribute is properly set

**Striping not working**
- Ensure both `background` and `stripped` attributes are set
- Verify that there are multiple list items for the effect to be visible

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
