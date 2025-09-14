# @pmeig/ngb-table

A powerful Angular library that provides Bootstrap-styled table components with advanced styling options, responsive behavior, and flexible color theming for data presentation.

## Installation
```bash
  npm install @pmeig/ngb-table
```
## Features

- 🎯 **BTableDirective** - Enhanced table directive with Bootstrap styling and responsive wrapper
- 📦 **BTableColorDirective** - Color theming for tables, rows, and cells
- 🔄 **Striped Patterns** - Row and column striping options
- ✨ **Hover Effects** - Interactive row highlighting on hover
- 🎨 **Border Control** - Configurable table borders and borderless options
- 🔢 **Size Variants** - Compact table sizing for dense layouts
- 📱 **Responsive Tables** - Automatic responsive wrapper with breakpoint control
- 🚀 Angular 20.2.1 support with signals
- ♿ Accessibility friendly with proper table semantics
- 🛠️ Caption positioning and group dividers

## Usage

### Import the Module
```typescript
import { TableMaterial } from '@pmeig/ngb-table';
@Component({
imports: [TableMaterial],
// ...
})
export class MyComponent { }
```
### Basic Table
```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td>Developer</td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>jane@example.com</td>
      <td>Designer</td>
    </tr>
  </tbody>
</table>
```
### Striped Table
```html
<!-- Row Striping -->
<table striped>
  <thead>
    <tr>
      <th>ID</th>
      <th>Product</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Laptop</td>
      <td>$999</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Mouse</td>
      <td>$25</td>
    </tr>
  </tbody>
</table>

<!-- Column Striping -->
<table striped="column">
  <thead>
    <tr>
      <th>Q1</th>
      <th>Q2</th>
      <th>Q3</th>
      <th>Q4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>$100K</td>
      <td>$120K</td>
      <td>$110K</td>
      <td>$130K</td>
    </tr>
  </tbody>
</table>
```
### Table with Hover Effect
```html
<table hover striped>
  <thead>
    <tr>
      <th>User</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice Johnson</td>
      <td>Active</td>
      <td>
        <button class="btn btn-sm btn-primary">Edit</button>
      </td>
    </tr>
  </tbody>
</table>
```
### Bordered and Borderless Tables
```html
<!-- Bordered Table -->
<table border>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>

<!-- Borderless Table -->
<table border="false">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```
### Small/Compact Table
```html
<table small striped>
  <thead>
    <tr>
      <th>Compact</th>
      <th>Table</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dense</td>
      <td>Layout</td>
      <td>Data</td>
    </tr>
  </tbody>
</table>
```
### Responsive Table
```html
<!-- Always Responsive -->
<table responsive>
  <thead>
    <tr>
      <th>Very Long Header Name</th>
      <th>Another Long Header</th>
      <th>Third Long Header</th>
      <th>Fourth Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Long content that might overflow</td>
      <td>More long content here</td>
      <td>Even more content</td>
      <td>Final column</td>
    </tr>
  </tbody>
</table>

<!-- Responsive at specific breakpoint -->
<table responsive="md">
  <!-- Table content -->
</table>
```
### Colored Table Elements
```html
<table>
  <thead color="dark">
    <tr>
      <th>Dark Header</th>
      <th>Another Header</th>
    </tr>
  </thead>
  <tbody>
    <tr color="success">
      <td>Success row</td>
      <td>Green background</td>
    </tr>
    <tr color="warning">
      <td>Warning row</td>
      <td>Yellow background</td>
    </tr>
    <tr>
      <td color="danger">Danger cell</td>
      <td>Normal cell</td>
    </tr>
  </tbody>
</table>
```
### Table with Caption
```html
<table>
  <caption top>Users Overview</caption>
  <thead>
    <tr>
      <th>Name</th>
      <th>Department</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>Engineering</td>
    </tr>
  </tbody>
</table>
```
### Table with Group Dividers
```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>95</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>87</td>
    </tr>
  </tbody>
  <tbody divider>
    <tr>
      <td>Charlie</td>
      <td>92</td>
    </tr>
    <tr>
      <td>David</td>
      <td>88</td>
    </tr>
  </tbody>
</table>
```
## API Reference

### Table Directive Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `striped` | `'row' \| 'column'` | `''` | Striping pattern - rows or columns |
| `hover` | `boolean` | `true` | Enable hover effect on rows |
| `border` | `boolean` | `undefined` | Table border style - true for bordered, false for borderless |
| `small` | `boolean` | `false` | Compact table sizing |
| `responsive` | `string \| boolean` | `'table-responsive'` | Responsive behavior and breakpoint |

### Color Directive Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `Color` | `''` | Bootstrap color variant for table elements |

### Caption Directive Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `top` | `boolean` | `false` | Position caption at top of table |

### Divider Directive
- **`divider`**: Applied to `tbody` elements to add visual separation between groups

#### Responsive Breakpoints
- **Always**: `responsive` or `responsive=""` - Always responsive
- **Small**: `responsive="sm"` - Responsive above 576px
- **Medium**: `responsive="md"` - Responsive above 768px
- **Large**: `responsive="lg"` - Responsive above 992px
- **Extra Large**: `responsive="xl"` - Responsive above 1200px
- **XXL**: `responsive="xxl"` - Responsive above 1400px

## How It Works

### Table Enhancement
The table directive automatically:
1. **Bootstrap Integration**: Applies base `.table` class and variants
2. **Responsive Wrapper**: Creates responsive container when needed
3. **Color Management**: Handles color classes for table elements
4. **State Management**: Uses signals to track and update table properties
5. **Accessibility**: Maintains proper table semantics and ARIA attributes

### Responsive Behavior
- **Wrapper Creation**: Automatically wraps table in responsive container
- **Breakpoint Control**: Shows horizontal scrollbar below specified breakpoint
- **Performance**: Only creates wrapper when responsive feature is enabled

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 table classes:
- `table` - Base table styling
- `table-striped` - Row striping
- `table-striped-columns` - Column striping
- `table-hover` - Hover effects
- `table-bordered` - Table borders
- `table-borderless` - No borders
- `table-sm` - Compact sizing
- `table-responsive` - Responsive wrapper
- `table-responsive-{breakpoint}` - Breakpoint-specific responsive
- `table-{color}` - Color variants
- `caption-top` - Caption positioning
- `table-group-divider` - Group separators

## Color Options

Available Bootstrap color variants:
- `primary`, `secondary`, `success`, `danger`
- `warning`, `info`, `light`, `dark`

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

**Table not responsive**
- Ensure `responsive` attribute is properly set
- Check that Bootstrap CSS includes responsive table styles
- Verify that the table has enough content to require scrolling

**Striping not working**
- Confirm `striped` attribute is correctly applied
- Check for conflicting CSS that might override striping
- Ensure proper table structure with `tbody` elements

**Colors not applying**
- Verify Bootstrap color classes are available
- Check that color names are valid Bootstrap variants
- Ensure elements support the color directive (table, tr, th, td, etc.)

**Hover effects not working**
- Confirm `[hover]="true"` is set on the table
- Check for CSS that might prevent hover states
- Verify that Bootstrap hover styles are loaded

**Caption positioning issues**
- Use `[top]="true"` on caption element, not table
- Ensure caption is direct child of table element
- Check for conflicting CSS affecting caption position

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
