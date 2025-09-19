# @pmeig/ngb-tooltip

A powerful Angular library that provides Bootstrap-styled tooltip and popover components with flexible positioning, interactive controls, and advanced content projection capabilities.

## Installation
```bash
  npm install @pmeig/ngb-tooltip
```
## Features

- 🎯 **TooltipMaterial Directive** - Lightweight tooltip directive with hover activation
- 📦 **PopoverMaterial Directive** - Rich popover component with click and hover triggers
- 🔄 **Flexible Positioning** - Top, bottom, start, end placement with fallback options
- ✨ **Interactive Content** - Template and string content support with HTML rendering
- 🎨 **Smart Positioning** - Automatic placement adjustment based on viewport
- 🔢 **Timeout Control** - Auto-dismiss functionality with configurable timing
- 📱 **Touch Support** - Mobile-friendly interaction patterns
- 🚀 Angular 20.2.1 support with signals
- ♿ Accessibility friendly with ARIA attributes
- 🛠️ Advanced mouse tracking and hover zones

## Usage

### Import the Module
```typescript
import { TooltipMaterial, PopoverMaterial } from '@pmeig/ngb-tooltip';
@Component({
imports: [TooltipMaterial, PopoverMaterial],
// ...
})
export class MyComponent { }
```
### Basic Tooltip
```html
<button class="btn btn-primary" tooltip="This is a helpful tooltip">
Hover me
</button>
```
### Tooltip with Different Placements
```html
<!-- Top placement (default) -->
<button class="btn btn-secondary" tooltip="Top tooltip" placement="top">
  Top
</button>

<!-- Bottom placement -->
<button class="btn btn-secondary" tooltip="Bottom tooltip" placement="bottom">
  Bottom
</button>

<!-- Start placement -->
<button class="btn btn-secondary" tooltip="Start tooltip" placement="start">
  Start
</button>

<!-- End placement -->
<button class="btn btn-secondary" tooltip="End tooltip" placement="end">
  End
</button>
```
### Tooltip with Fallback Placement
```html
<button class="btn btn-info" 
        tooltip="This tooltip will try top first, then bottom"
        placement="top"
        otherwise="bottom">
  Smart Positioning
</button>
```
### Tooltip with Custom ID and Timeout
```html
<button class="btn btn-warning" 
        tooltip="This tooltip disappears after 3 seconds"
        tooltip-id="custom-tooltip-1"
        [timeout]="3000">
  Auto-dismiss Tooltip
</button>
```
### Hover-enabled Tooltip
```html
<button class="btn btn-success" 
        tooltip="You can hover over this tooltip too!"
        tooltip-hover>
  Interactive Tooltip
</button>
```
### Basic Popover
```html
<button class="btn btn-primary" 
        pop-over="This is a basic popover with more content space">
  Click for Popover
</button>
```
### Popover with Title
```html
<button class="btn btn-info" 
        popover-title="Popover Title"
        pop-over="This popover has both a title and body content">
  Titled Popover
</button>
```
### Popover with Different Triggers
```html
<!-- Click trigger (default) -->
<button class="btn btn-secondary" 
        pop-over="Click to toggle"
        popover-click>
  Click Popover
</button>

<!-- Hover trigger -->
<button class="btn btn-secondary"
pop-over="Hover to show"
popover-hover>
Hover Popover
</button>

<!-- Both triggers -->
<button class="btn btn-secondary"
pop-over="Click or hover"
popover-click
popover-hover>
Multi-trigger
</button>
```
### Popover with Outside Click Dismiss
```html
<button class="btn btn-warning"
pop-over="Click outside to dismiss this popover"
popover-escape="false">
Dismissible Popover
</button>
```
### Template Content Tooltip
```html
<button class="btn btn-primary" [tooltip]="tooltipTemplate">
Rich Content Tooltip
</button>

<ng-template #tooltipTemplate>
  <div>
    <strong>Rich Content</strong><br>
    <small class="text-muted">With HTML formatting</small>
  </div>
</ng-template>
```
### Template Content Popover
```html
<button class="btn btn-info" 
        [popover-title]="titleTemplate"
        [pop-over]="contentTemplate">
  Complex Popover
</button>

<ng-template #titleTemplate>
<i class="bi bi-info-circle"></i> Information
</ng-template>

<ng-template #contentTemplate>
  <div>
    <p>This popover contains rich content:</p>
    <ul>
      <li>HTML formatting</li>
      <li>Multiple elements</li>
      <li>Icons and styling</li>
    </ul>
    <div class="mt-2">
      <button class="btn btn-sm btn-primary">Action</button>
    </div>
  </div>
</ng-template>
```
## API Reference

### Tooltip Directive Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tooltip` | `string \| TemplateRef<any>` | `undefined` | Tooltip content |
| `placement` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | Preferred tooltip position |
| `otherwise` | `'top' \| 'bottom' \| 'start' \| 'end'` | `undefined` | Fallback position if preferred doesn't fit |
| `tooltip-id` | `string` | `undefined` | Custom ID for the tooltip element |
| `tooltip-hover` | `boolean` | `false` | Allow hovering over the tooltip itself |
| `timeout` | `number` | `undefined` | Auto-dismiss timeout in milliseconds |

### Popover Directive Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `pop-over` | `string \| TemplateRef<any>` | `undefined` | Popover body content |
| `popover-title` | `string \| TemplateRef<any>` | `undefined` | Popover title content |
| `placement` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | Preferred popover position |
| `otherwise` | `'top' \| 'bottom' \| 'start' \| 'end'` | `undefined` | Fallback position if preferred doesn't fit |
| `popover-id` | `string` | `undefined` | Custom ID for the popover element |
| `popover-hover` | `boolean` | `false` | Show on hover |
| `popover-click` | `boolean` | `true` | Show on click |
| `popover-escape` | `boolean` | `false` | Dismiss when clicking outside |
| `timeout` | `number` | `undefined` | Auto-dismiss timeout in milliseconds |

#### Placement Options
- **Top**: `placement="top"` - Above the trigger element
- **Bottom**: `placement="bottom"` - Below the trigger element
- **Start**: `placement="start"` - To the left of the trigger element (LTR)
- **End**: `placement="end"` - To the right of the trigger element (LTR)

## How It Works

### Positioning System
The tooltip/popover components automatically:
1. **Calculate Optimal Position**: Analyzes viewport space and element boundaries
2. **Apply Fallback Logic**: Uses `otherwise` placement if preferred position doesn't fit
3. **Dynamic Adjustment**: Repositions based on scroll and resize events
4. **Smart Collision Detection**: Prevents tooltips from appearing outside viewport
5. **Mouse Tracking**: Advanced hover zone detection for interactive tooltips

### Lifecycle Management
- **Lazy Creation**: Tooltip/popover elements created only when needed
- **Memory Management**: Automatic cleanup when component is destroyed
- **Event Handling**: Efficient mouse and click event management
- **Timeout Control**: Configurable auto-dismiss with cleanup

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 tooltip and popover classes:
- `tooltip` - Base tooltip styling
- `popover` - Base popover styling
- `tooltip-inner` - Tooltip content area
- `popover-header` - Popover title section
- `popover-body` - Popover content area
- `bs-tooltip-{placement}` - Placement-specific tooltip classes
- `bs-popover-{placement}` - Placement-specific popover classes

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

**Tooltip not appearing**
- Ensure Bootstrap CSS is properly loaded
- Check that the tooltip content is not empty
- Verify that the trigger element is visible and interactive

**Positioning issues**
- Use `otherwise` attribute for fallback positioning
- Check for parent containers with `overflow: hidden`
- Ensure adequate space around trigger elements

**Content not displaying correctly**
- For template content, verify template references are correct
- Check for HTML entities in string content
- Ensure proper escaping for special characters

**Interactive tooltips not working**
- Set `tooltip-hover="true"` to enable tooltip hovering
- Check that mouse events are not being prevented
- Verify timeout settings aren't too aggressive

**Popovers not dismissing**
- Use `popover-escape` for outside-click dismissal
- Ensure click events on trigger elements are not prevented
- Check for competing event handlers

**Performance issues**
- Avoid creating too many tooltips simultaneously
- Use lazy loading for complex template content
- Consider using timeout for auto-dismiss on heavy pages

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
