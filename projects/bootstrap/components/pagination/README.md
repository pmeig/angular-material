# @pmeig/ngb-pagination

A powerful Angular library that provides Bootstrap-styled pagination components with intelligent page management, customizable navigation, and advanced configuration options.

## Installation
```bash
  npm install @pmeig/ngb-pagination
```
## Features

- 🎯 **PaginationMaterial Component** - Full-featured pagination with Bootstrap styling
- 📦 **Intelligent Page Management** - Smart page range display with ellipsis support
- 🔄 **Configurable Navigation** - Icons, labels, or custom navigation buttons
- ✨ **Size Variants** - Small, default, and large pagination sizes
- 🎨 **Alignment Options** - Left, center, and right alignment support
- 🔢 **Disabled Pages** - Support for disabling specific pages
- 📱 **Responsive Design** - Mobile-friendly pagination controls
- 🚀 Angular 21.2.0 support with signals
- ♿ Accessibility friendly with proper ARIA attributes
- 🛠️ Flexible configuration with between-page ranges

## Usage

### Import the Module
```typescript
import { PaginationMaterial } from '@pmeig/ngb-pagination';
@Component({
imports: [PaginationMaterial],
// ...
})
export class MyComponent { }
```
### Basic Pagination
```html
<pagination
[total]="50"
[(page)]="currentPage">
</pagination>
```

```typescript
import { signal, effect } from '@angular/core';

export class MyComponent {
  currentPage = signal(1);

  constructor() {
    effect(() => this.loadData(this.currentPage());
  }
}
```
### Configuration-Based Pagination
```html
<pagination
[config]="paginationConfig"
(pageChange)="onPageChange($event)">
</pagination>
```
```typescript
export class MyComponent {
  paginationConfig = {
    page: 1,
    total: 100
  };
  
  onPageChange(page: number) {
    this.paginationConfig.page = page;
    this.loadData(page);
  }
}
```


### Pagination with Page Range
```html
<pagination 
  [total]="200"
  [(page)]="currentPage"
  [between]="{previous: 3, next: 3}">
</pagination>
```


### Different Sizes
```html
<!-- Small Pagination -->
<pagination 
  [total]="25" 
  [(page)]="currentPage" 
  size="sm">
</pagination>

<!-- Large Pagination -->
<pagination 
  [total]="25" 
  [(page)]="currentPage" 
  size="lg">
</pagination>
```


### Aligned Pagination
```html
<!-- Center Aligned -->
<pagination 
  [total]="30" 
  [(page)]="currentPage" 
  align="center">
</pagination>

<!-- Right Aligned -->
<pagination 
  [total]="30" 
  [(page)]="currentPage" 
  align="end">
</pagination>
```


### Custom Navigation Labels
```html
<pagination 
  [total]="40" 
  [(page)]="currentPage" 
  navigation="label">
</pagination>
```


### Disabled Pages
```html
<pagination 
  [total]="20" 
  [(page)]="currentPage" 
  [page-disabled]="[5, 10, 15]">
</pagination>
```


### No Navigation Arrows
```html
<pagination 
  [total]="15" 
  [(page)]="currentPage" 
  [navigation]="false">
</pagination>
```


## API Reference

### Pagination Component Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `total` | `number` | `0` | Total number of pages |
| `page` | `number` | `1` | Current active page |
| `size` | `'sm' \| 'lg'` | `undefined` | Pagination size variant |
| `align` | `'start' \| 'center' \| 'end'` | `undefined` | Pagination alignment |
| `navigation` | `'icons' \| 'label' \| false \| PipeTransform` | `'icons'` | Navigation button style |
| `between` | `{previous: number, next: number} \| number` | `{previous: 0, next: 0}` | Number of pages to show around current page |
| `config` | `{page: number, total: number}` | `{page: 1, total: 0}` | Configuration object for page and total |
| `page-disabled` | `number[] \| string \| number` | `[]` | Pages to disable (comma-separated string or array) |

### Events
| Event | Type | Description |
|-------|------|-------------|
| `pageChange` | `number` | Emitted when page changes |

#### Navigation Options
- **Icons**: `navigation="icons"` - Shows « and » symbols
- **Labels**: `navigation="label"` - Shows "Previous" and "Next" text
- **Custom**: `navigation="customPipe"` - Uses custom pipe transform
- **None**: `navigation="false"` - No navigation arrows

## How It Works

### Intelligent Page Display
The pagination component automatically:
1. **Range Management**: Shows appropriate page ranges around current page
2. **Ellipsis Handling**: Displays "..." when there are gaps in page sequence
3. **Navigation Logic**: Handles previous/next navigation with disabled page skipping
4. **State Synchronization**: Maintains current page state and emits changes

### Page Range Logic
- **Between Configuration**: Controls how many pages to show before and after current page
- **Dynamic Adjustment**: Automatically adjusts ranges near beginning or end of pagination
- **Ellipsis Insertion**: Shows dots when there are gaps in the page sequence

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 pagination classes:
- `pagination` - Base pagination styling
- `pagination-sm` - Small pagination variant
- `pagination-lg` - Large pagination variant
- `justify-content-start`, `justify-content-center`, `justify-content-end` - Alignment classes
- `page-item` - Individual page item container
- `page-link` - Page link styling
- `active` - Current page indicator
- `disabled` - Disabled page state

## Size Options

Available pagination sizes:
- **Small**: `size="sm"` - Compact pagination for dense layouts
- **Default**: No size attribute - Standard pagination size
- **Large**: `size="lg"` - Larger pagination for prominent placement

## Alignment Options

Control pagination alignment:
- **Start**: `align="start"` - Left-aligned (default)
- **Center**: `align="center"` - Center-aligned
- **End**: `align="end"` - Right-aligned

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

**Pagination not updating**
- Ensure `pageChange` event is properly handled
- Check that `page` input is being updated correctly
- Verify that component change detection is triggered

**Page numbers not displaying correctly**
- Check that `total` is set to the correct number of pages
- Verify that `between` configuration is appropriate for your data size
- Ensure page calculations are correct in your component

**Navigation arrows not working**
- Confirm that `navigation` is not set to `false`
- Check that pages are not disabled when navigating
- Verify that proper page bounds are respected

**Disabled pages not working**
- Ensure `page-disabled` format is correct (array of numbers or comma-separated string)
- Check that disabled pages are within the valid page range
- Verify that navigation skips disabled pages correctly

**Styling issues**
- Ensure Bootstrap CSS is properly loaded
- Check for conflicting CSS that might override pagination styles
- Verify that size and alignment classes are applied correctly

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
