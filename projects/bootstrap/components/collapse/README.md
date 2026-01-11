# @pmeig/ngb-collapse

A powerful Angular library that provides Bootstrap-styled collapse functionality with smooth animations and flexible control options.

## Installation
```bash
  npm install @pmeig/ngb-collapse
```
## Features

- 🎯 **CollapseMaterial Directive** - Smart collapse directive with animation support
- 📦 **Flexible Control** - Toggle via boolean values or element references  
- 🔄 **Animation Options** - Vertical and horizontal collapse animations
- ✨ **Bootstrap Integration** - Full Bootstrap 5.3.3 collapse behavior
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 20.2.1 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly with ARIA attributes
- 🛠️ Programmatic and template-driven control

## Usage

### Import the Module
```typescript 
import { CollapseMaterial } from '@pmeig/ngb-collapse';
@Component({
  imports: [CollapseMaterial],
  // ...
})
export class MyComponent { }
``` 

### Basic Collapse
```html
<button class="btn btn-primary" type="button" #collapseBtn>
  Toggle Collapse
</button>
<div *collapse="collapseBtn" class="mt-2">
  <div class="card card-body">
    This content will collapse and expand with smooth animations.
  </div>
</div>
```


### Boolean Control
```html
<button class="btn btn-primary" (click)="isCollapsed = !isCollapsed">
  Toggle Collapse
</button>
<div *collapse="isCollapsed" class="mt-2">
  <div class="card card-body">
    This content is controlled by a boolean variable.
  </div>
</div>
```


### Horizontal Collapse
```html
<button class="btn btn-primary" type="button" #horizontalBtn>
  Toggle Horizontal
</button>
<div style="min-height: 120px;">
  <div *collapse="horizontalBtn; animation: 'horizontal'">
    <div class="card card-body" style="width: 300px;">
      This content collapses horizontally instead of vertically.
    </div>
  </div>
</div>
```


## API Reference

### Collapse Directive Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `collapse` | `boolean \| Element` | `false` | Controls collapse state - boolean for programmatic control, Element reference for click-based control |
| `collapseAnimation` | `'vertical' \| 'horizontal'` | `'vertical'` | Animation direction for the collapse effect |

#### Control Methods
- **Boolean Control**: Pass `true`/`false` to programmatically show/hide content
- **Element Reference**: Pass button/trigger element reference for automatic click handling
- **Template Reference**: Use template reference variables for easy element binding

## How It Works

### Animation Behavior
The collapse directive automatically:
1. **Manages CSS Classes**: Applies Bootstrap collapse classes (`collapse`, `collapsing`, `show`)
2. **Handles Animations**: Smooth transitions between collapsed and expanded states
3. **Calculates Dimensions**: Dynamically measures content size for proper animations
4. **ARIA Support**: Automatically manages `aria-expanded` and `aria-controls` attributes

### State Management
- **Collapsed State**: Content is hidden with `display: none` equivalent
- **Collapsing State**: Transition animation is active with `collapsing` class
- **Expanded State**: Content is fully visible with `collapse show` classes

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 collapse classes:
- `collapse` - Base collapse styling
- `collapsing` - Applied during transition animations
- `show` - Indicates expanded state
- `collapse-horizontal` - Applied for horizontal collapse animations
- `collapsed` - Applied to trigger elements when content is collapsed

## Integration with Other Modules

The collapse module works seamlessly with:
```typescript
// Often used together
import { AccordionMaterial } from '@pmeig/ngb-accordion';
import { OffcanvasMaterial } from '@pmeig/ngb-offcanvas';
```


## Dependencies

- **Angular**: >=20.2.1
- **@angular/common**: >=20.2.1
- **@pmeig/ngb-core**: ^0.0.1
- **tslib**: ^2.3.0

## Compatibility

- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Best Practices

### 1. Use Semantic Controls
```html
<!-- Good: Clear trigger button -->
<button class="btn btn-outline-primary" 
        type="button" 
        aria-label="Toggle navigation menu"
        #menuToggle>
  Menu
</button>
<nav *collapse="menuToggle">
  <!-- Navigation content -->
</nav>
```

## Troubleshooting

### Common Issues

**Animation not working**
- Check that the element has measurable content for size calculations

**ARIA attributes not updating**
- Verify that trigger elements are properly referenced
- Check that the directive is applied to the collapsible content, not the trigger

**Horizontal collapse not working**
- Set explicit width on content for proper measurements

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
