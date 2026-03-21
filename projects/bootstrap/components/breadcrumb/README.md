
# @pmeig/ngb-breadcrumb

A powerful Angular library that provides Bootstrap-styled breadcrumb navigation with advanced features like click handling, custom dividers, and accessibility support.

## Installation
```bash
  npm install @pmeig/ngb-breadcrumb
```
## Features

- 🎯 **BreadcrumbMaterial Directive** - Smart breadcrumb directive with automatic item management
- 🔗 **Click Navigation** - Built-in click handling for breadcrumb item selection
- ✨ **Custom Dividers** - Configurable breadcrumb separators
- 🎨 **Auto-styling** - Automatic Bootstrap breadcrumb styling for child elements
- 🔄 **Dynamic State Management** - Active item tracking with events
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 21.2.0 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly with ARIA support
- 🛠️ Event-driven navigation system

## Usage

### Import the Module
```typescript
import { BreadcrumbMaterial } from '@pmeig/ngb-breadcrumb';

@NgModule({
  imports: [
    BreadcrumbMaterial
  ],
  // ...
})
export class AppModule { }
```

### Basic Breadcrumb
```html
<nav>
  <ol breadcrumb id="main-breadcrumb">
    <li id="home">Home</li>
    <li id="products">Products</li>
    <li id="category">Electronics</li>
    <li id="item">Laptop</li>
  </ol>
</nav>
```

### Breadcrumb with Event Handling
```html
<nav>
  <ol breadcrumb 
      id="navigation"
      (breadcrumbChange)="onBreadcrumbChange($event)"
      (index)="onIndexChange($event)">
    <li>Dashboard</li>
    <li>Users</li>
    <li>Profile</li>
  </ol>
</nav>
```


### Breadcrumb with Custom Divider
```html
<!-- Arrow divider -->
<nav>
  <ol breadcrumb id="arrow-breadcrumb" divider="→">
    <li>Home</li>
    <li>Category</li>
    <li>Subcategory</li>
  </ol>
</nav>

<!-- Slash divider -->
<nav>
  <ol breadcrumb id="slash-breadcrumb" divider="/">
    <li>Root</li>
    <li>Folder</li>
    <li>Subfolder</li>
  </ol>
</nav>

<!-- Custom symbol -->
<nav>
  <ol breadcrumb id="custom-breadcrumb" divider="•">
    <li>Step 1</li>
    <li>Step 2</li>
    <li>Step 3</li>
  </ol>
</nav>
```


### Breadcrumb with Pre-selected Active Item
```html
<nav>
  <ol breadcrumb="preset-breadcrumb-1"
      id="preset-breadcrumb">
    <li>Home</li>
    <li>Products</li>
    <li>Current Page</li>
  </ol>
</nav>
```


## API Reference

### BreadcrumbMaterial Directive

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | **Required** | Unique identifier for the breadcrumb container |
| `breadcrumb` | `string` | `id + '-0'` | ID of the initially active breadcrumb item |
| `divider` | `string` | Bootstrap default | Custom divider character/symbol |
| `role` | `string` | `undefined` | ARIA role for accessibility |
| `ariaLabel` | `string` | `'breadcrumb'` | ARIA label for screen readers |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `breadcrumbChange` | `string` | Emitted when a breadcrumb item is clicked, returns the item's ID |
| `index` | `number` | Emitted when a breadcrumb item is clicked, returns the item's index |

## How It Works

### Automatic Item Management
The breadcrumb directive automatically:
1. **Applies Bootstrap classes**: Adds `breadcrumb` class to container and `breadcrumb-item` to children
2. **Manages active states**: Handles active item styling and ARIA attributes
3. **Generates IDs**: Auto-generates IDs for items that don't have them (`id-0`, `id-1`, etc.)
4. **Click handling**: Processes clicks and updates active states
5. **Accessibility**: Adds proper ARIA labels and current page indicators

### Click Navigation Behavior
When a breadcrumb item is clicked:
- Previous active item loses `active` class and `aria-current` attribute
- Clicked item gains `active` class and `aria-current="page"` attribute
- `breadcrumbChange` event emits the item's ID
- `index` event emits the item's position (0-based)

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 breadcrumb classes:
- `breadcrumb` - Applied to the container element
- `breadcrumb-item` - Applied to each child element
- `active` - Applied to the currently active item
- `border-0` - Removes default borders from items
- Custom CSS properties: `--bs-breadcrumb-divider` for custom separators



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

## Best Practices

### 1. Always Provide Required ID
```html
<!-- Good: ID is required -->
<ol breadcrumb id="my-breadcrumb">
  <li>Home</li>
  <li>Current Page</li>
</ol>
```


## Troubleshooting

### Common Issues

**Error: "Please set id for breadcrumb"**
- The `id` attribute is required for the breadcrumb container
- Ensure you've set a unique ID: `<ol breadcrumb id="unique-id">`

**Breadcrumb items not clickable**
- Verify that child elements are direct descendants of the breadcrumb container
- Check for CSS conflicts that might prevent click events

**Custom dividers not showing**
- Ensure Bootstrap CSS is loaded
- Check that the divider value is a valid string
- Use single quotes around the divider value

**Active states not updating**
- Verify that the click event is not being prevented by parent elements
- Check for JavaScript errors in event handlers

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
