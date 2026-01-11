
# @pmeig/ngb-badge

A powerful Angular library that provides Bootstrap-styled badge components with advanced formatting options, annotation positioning, and dynamic color management.

## Installation
```bash 
  npm install @pmeig/ngb-badge
``` 

## Features

- 🎯 **BadgeMaterial Directive** - Smart badge directive with automatic styling
- 🎨 **All Bootstrap Colors** - Support for all Bootstrap color variants  
- 🔄 **Multiple Formats** - Default, pill, and circle badge shapes
- 📍 **Annotation Mode** - Notification badges with automatic positioning
- ✨ **Dynamic Color Management** - Automatic color switching and cleanup
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 20.2.1 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly
- 🛠️ Smart parent element positioning

## Usage

### Import the Module
```typescript 
import { BadgeMaterial } from '@pmeig/ngb-badge';
@NgModule({ imports: [ BadgeMaterial ], 
// ... 
}) export class AppModule { }
``` 

### Basic Badge
```html
  <badge>Badge Text</badge>
``` 

### Badge with Different Colors
```html
  <badge color="primary">Primary</badge>
  <badge color="success">Success</badge>
``` 

### Badge Formats
```html
  <badge format="pill">Pill</badge>
  <badge format="circle">Circle</badge>
```

## API Reference

### BadgeMaterial Directive

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string \| ColorAttribute` | `'text-bg-secondary'` | Bootstrap color variant for the badge |
| `format` | `'pill' \| 'circle' \| 'default'` | `'default'` | Badge shape format |
| `annotate` | `boolean` | `false` | Enables annotation/notification mode with absolute positioning |

#### Color Options
- `primary` → `text-bg-primary`
- `secondary` → `text-bg-secondary` 
- `success` → `text-bg-success`
- `danger` → `text-bg-danger`
- `warning` → `text-bg-warning`
- `info` → `text-bg-info`
- `light` → `text-bg-light`
- `dark` → `text-bg-dark`

#### Format Options
- `default` - Standard rectangular badge
- `pill` - Rounded pill-shaped badge
- `circle` - Circular badge (best for numbers/icons)

## How It Works

### Automatic Styling Management
The badge directive automatically:
1. **Applies base classes**: Adds `badge` class on initialization
2. **Manages color transitions**: Handles color switching with proper cleanup
3. **Format control**: Applies appropriate shape classes based on format
4. **Annotation positioning**: Automatically positions badges as notifications
5. **Parent element styling**: Adds necessary positioning classes to parent elements

### Annotation Mode Behavior
When `annotate="true"`:
- Adds absolute positioning classes
- Automatically switches to danger color if no color is specified
- Adds accessibility attributes for screen readers
- Modifies parent element positioning
- Handles empty badges with visual indicators

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 badge classes:
- `badge` - Base badge class
- `text-bg-*` - Bootstrap 5.3+ background and text color utilities
- `rounded-pill` - Pill-shaped badges
- `rounded-circle` - Circular badges
- `position-absolute`, `top-0`, `start-100`, `translate-middle` - Annotation positioning
- `position-relative` - Applied to parent elements for annotation badges

## TypeScript Support

Full TypeScript support with proper typing:
```
typescript import { BadgeMaterial } from '@pmeig/ngb-badge';
@Component({ template: `<badge [color]="badgeColor" [format]="badgeFormat" [annotate]="isAnnotation"> {{ content }} </badge> `}) export class MyBadgeComponent { badgeColor: 'success' | 'danger' | 'warning' | 'info' = 'success'; badgeFormat: 'pill' | 'circle' | 'default' = 'default'; isAnnotation = false; content = 'Badge Text'; }
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

## Troubleshooting
### Common Issues
**Badge not displaying colors**
- Check that color values are valid Bootstrap color names

**Annotation badges not positioning correctly**
- Verify parent element has proper structure
- Check for conflicting CSS position rules

**Format changes not applying**
- Ensure format values are one of: 'default', 'pill', 'circle'
- Check for CSS conflicts with border-radius

**Accessibility concerns**
- Always provide meaningful text content
- Use visually-hidden spans for screen readers when using icon-only badges

## License
This project is licensed under the MIT License.
## Support
For issues and questions, please open an issue on the GitHub repository.
