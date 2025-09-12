
# @pmeig/ngb-accordion

A powerful Angular library that provides Bootstrap-styled accordion components with collapse functionality and automatic grouping behavior.

## Installation

```bash 
  npm install @pmeig/ngb-accordion
``` 

## Features

- 🎯 **BAccordionDirective** - Smart accordion directive with automatic grouping
- 📦 **BAccordionItemComponent** - Individual accordion items with collapse functionality  
- 🔄 **Automatic Grouping** - Intelligently groups adjacent accordion items
- ✨ **Flush Mode** - Optional flush styling for seamless design
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 20.2.1 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly
- 🛠️ Template-driven content projection

## Usage

### Import the Module
```typescript 
import { AccordionMaterial } from '@pmeig/ngb-accordion';
@NgModule({ imports: [ AccordionMaterial ], 
// ... 
}) export class AppModule { }
``` 

### Basic Accordion
```html
<accordion header="First Accordion Item">
  This is the content for the first accordion item.
</accordion>
<accordion header="Second Accordion Item">>
  This is the content for the second accordion item
</accordion>
``` 

### Accordion with Template Content
Best when body lifecycle management is required. Instance body only when collapsed
```html 
<accordion header="First Accordion Item">
  <ng-template>
    This is the content for the first accordion item.
  </ng-template>
</accordion>
``` 

### Flush Accordion
```html
<accordion header="First Accordion Item" flush>
  This is the content for the first accordion item.
</accordion>
```

## API Reference

### Accordion Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `flush` | `boolean` | `false` | Removes borders and rounded corners for flush accordion styling |
| `header` | `string` | The header text for the accordion item |

#### Content Projection
- **Default slot**: Main content area of the accordion body
- **`[header]` slot**: Custom header content (alternative to `header` input)
- **Template support**: Use `<ng-template>` for complex body content

## How It Works

### Automatic Grouping Behavior
The accordion directive automatically:
1. **Detects adjacent accordion items**: Groups consecutive `<accordion>` elements
2. **Creates wrapper containers**: Generates Bootstrap accordion structure
3. **Manages DOM manipulation**: Handles element repositioning and cleanup
4. **Applies styling**: Adds appropriate Bootstrap classes (`accordion`, `accordion-flush`)

### Collapse Integration
Each accordion item integrates with the collapse module:
- Uses `*collapse` directive for show/hide functionality
- Connects accordion buttons to collapsible content
- Maintains Bootstrap's expected accordion behavior

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 accordion classes:
- `accordion` - Main accordion container
- `accordion-flush` - Flush variant without borders
- `accordion-item` - Individual accordion items
- `accordion-header` - Header container
- `accordion-button` - Clickable header button
- `accordion-collapse` - Collapsible content wrapper
- `accordion-body` - Content area

## Integration with Other Modules

The accordion module depends on:
```typescript
 // Required dependency import { CollapseMaterial } from '@pmeig/ngb-collapse';
```

## Dependencies

- **Angular**: ^20.2.1
- **@angular/common**: ^20.2.1
- **@pmeig/ngb-collapse**: ^0.0.1
- **tslib**: ^2.3.0

## Compatibility

- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Best Practices

### 1. Group Related Items
```html
<!-- Good: Related accordion items grouped together -->
<accordion header="Account Settings">...</accordion>
<accordion header="Privacy Settings">...</accordion>
<accordion header="Notification Settings">...</accordion>
```
### 2. Use Semantic Headers
```html
<!-- Good: Clear, descriptive headers -->
<accordion header="How to Reset Your Password">...</accordion>
<accordion header="Billing and Payment Options">...</accordion>
```
### 3. Optimize for Mobile
```html
<accordion header="Mobile-Friendly Title">
  <div class="d-block d-md-flex">
    <div class="flex-fill">Content adapts to screen size</div>
  </div>
</accordion>
```

## Common Patterns
### FAQ Section
```html
<div class="container mt-4">
  <h2>Frequently Asked Questions</h2>
  <accordion header="What is this service?">
    <p>Detailed explanation of the service...</p>
  </accordion>
  
  <accordion header="How much does it cost?">
    <p>Pricing information and plans...</p>
  </accordion>
  
  <accordion header="How do I get started?">
    <p>Step-by-step getting started guide...</p>
  </accordion>
</div>
```
## Troubleshooting
### Common Issues
**Accordion items not grouping properly**
- Ensure accordion elements are adjacent in the DOM
- Check for any wrapper elements that might interfere

**Content not showing**
- Verify that the collapse module is properly imported
- Check for template syntax errors in projected content

**Styling issues**
- Ensure Bootstrap CSS is loaded
- Check for conflicting CSS rules

## License
This project is licensed under the MIT License.
## Support
For issues and questions, please open an issue on the GitHub repository.
