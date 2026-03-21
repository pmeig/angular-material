# @pmeig/ngb-collapse

A powerful Angular library that provides Bootstrap-styled collapse components with advanced features like vertical and horizontal animations, element orchestration, and smart accessibility management.

## Installation

```bash
  npm install @pmeig/ngb-collapse
```


## Features

- 🎯 **CollapseMaterial Directive** - Smart collapse directive with automatic Bootstrap animations
- 📐 **Dual Animation Modes** - Support for both vertical and horizontal collapse animations
- 🎭 **Element Orchestration** - Link collapse behavior to external trigger elements
- 🔄 **Smart State Management** - Automatic show/hide state tracking with animations
- ♿ **Accessibility Support** - Built-in ARIA attributes and keyboard navigation
- ✨ **Dynamic Content Sizing** - Automatic height/width calculation for smooth animations
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 21.2.0 support with signals
- 📱 Responsive design
- 🛠️ Template-driven content projection

## Usage

### Import the Module
```typescript
import { CollapseMaterial } from '@pmeig/ngb-collapse';

@NgModule({
  imports: [
    CollapseMaterial
  ],
  // ...
})
export class AppModule { }
```


### Element-Triggered Collapse
```html
<!-- Collapse triggered by external element -->
<button #collapseBtn 
        class="btn btn-primary collapsed" 
        type="button">
  Click me to toggle content
</button>

<div *collapse="collapseBtn" id="collapseExample">
  <div class="card card-body">
    This collapse is controlled by the button above.
    The button automatically gets proper ARIA attributes
    and collapsed/expanded styling.
  </div>
</div>
```


### Horizontal Collapse
```html
<button #horizontalBtn 
        class="btn btn-primary collapsed" 
        type="button">
  Toggle Horizontal Collapse
</button>

<div *collapse="horizontalBtn; animation: 'horizontal'"
     id="horizontalCollapse">
  <div class="card card-body" style="width: 300px;">
    This content collapses horizontally instead of vertically.
    The width is animated rather than the height.
  </div>
</div>
```


### Programmatic Control
```html
<!-- Controlled collapse with component logic -->
<div class="btn-group mb-3">
  <button (click)="collapseState.set(true)" class="btn btn-success">Show</button>
  <button (click)="collapseState.set(false)" class="btn btn-danger">Hide</button>
</div>

<div *collapse="collapseState" id="programmaticCollapse">
  <div class="alert alert-info">
    <h5>Programmatically Controlled Content</h5>
    <p>This collapse is controlled through component methods.</p>
    <p>Current state: {{ collapseState ? 'Hidden' : 'Visible' }}</p>
  </div>
</div>
```

## API Reference

### CollapseMaterial Directive

Applied to elements with `[collapse]` attribute.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `collapse` | `boolean \| Element` | `false` | Controls collapse state or links to trigger element |
| `collapseAnimation` | `'vertical' \| 'horizontal'` | `'vertical'` | Animation direction for the collapse effect |

#### Behavior Modes

**Boolean Mode (`collapse="true/false"`)**
- Direct programmatic control over collapse state
- Use with component properties or expressions
- Ideal for controlled collapse scenarios

**Element Mode (`collapse="elementReference"`)**
- Links collapse to a trigger element (usually a button)
- Automatic click event handling on the trigger
- Built-in ARIA attribute management
- Trigger element gets `collapsed` class when content is hidden

## How It Works

### Automatic Animation Management
The collapse directive automatically:
1. **Calculates dimensions**: Measures actual content height/width for smooth animations
2. **Applies Bootstrap classes**: Manages `collapse`, `show`, `collapsing`, and `collapsed` classes
3. **Handles timing**: Uses Bootstrap's standard animation duration (350ms)
4. **Manages ARIA attributes**: Sets `aria-expanded` and `aria-controls` for accessibility
5. **Optimizes performance**: Uses efficient animation techniques

### Animation States
1. **Hidden State**: Content is not visible, trigger shows `collapsed` class
2. **Collapsing**: Transition animation in progress
3. **Visible State**: Content is fully visible with `show` class
4. **Expanding**: Reverse transition animation

### Accessibility Features
- **ARIA Expanded**: Automatically set on trigger elements
- **ARIA Controls**: Links trigger to collapsible content via ID
- **Keyboard Navigation**: Inherits standard button/link keyboard behavior
- **Screen Reader Support**: Proper announcement of state changes

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 collapse classes:
- `collapse` - Base collapse functionality
- `collapse-horizontal` - Horizontal collapse variant
- `collapsing` - Applied during animation transitions
- `show` - Indicates expanded/visible state
- `collapsed` - Applied to trigger elements when content is hidden

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

### 1. Use Meaningful Trigger Labels
```html
<!-- Good: Clear, descriptive trigger text -->
<button #detailsBtn class="btn btn-outline-primary">
  {{ detailsCollapsed ? 'Show Details' : 'Hide Details' }}
</button>

<div *collapse="detailsBtn">
  <div class="mt-3">
    <!-- Detailed content -->
  </div>
</div>
```


## Troubleshooting

### Common Issues

**Collapse animation not smooth**
- Ensure content doesn't have conflicting CSS transitions
- Verify no custom height/width CSS overrides are interfering

**ARIA attributes not updating**
- Ensure trigger element has a template reference (`#triggerBtn`)
- Check that the collapsible content has an `id` attribute
- Verify the element reference is passed correctly to `[collapse]`

**Content flashing during animation**
- This usually indicates missing Bootstrap CSS
- Check for CSS conflicts with custom styles
- Ensure proper initialization of collapsed state

**Horizontal collapse not working**
- Verify `collapseAnimation="horizontal"` is set
- Check that content has a defined width
- Ensure parent container doesn't constrain horizontal expansion

**Multiple collapses interfering**
- Each collapsible content should have a unique `id`
- Use separate trigger elements for each collapse
- Consider using accordion components for mutually exclusive behavior

## Integration with Other Components

The collapse module is commonly used with:
- **Accordion**: Provides the collapsing functionality for accordion panels
- **Navbar**: Handles responsive navigation menu collapse
- **Cards**: Creates expandable card content sections
- **Modals**: Can be used for expandable sections within modals

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
