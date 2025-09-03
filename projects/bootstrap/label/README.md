# Bootstrap Label Module

A Bootstrap-styled label component library for Angular applications, part of the NGP Material design system.

## Overview

The Bootstrap Label module provides label components and directives that follow Bootstrap design patterns while integrating seamlessly with Angular applications. This module is designed to offer consistent, accessible, and customizable label controls that work perfectly with form inputs and other interactive elements.

## Installation

This module is part of the NGP Material monorepo. Install it using npm:

```bash
npm install @pmeig/ngb-label
```

## Features
- **Bootstrap Integration**: Styled according to Bootstrap design principles
- **Angular Support**: Built for Angular 20.2.1+ with TypeScript 5.8.3
- **Form Integration**: Seamless integration with Angular forms and input controls
- **Accessibility**: WCAG compliant label components with proper ARIA attributes
- **Customizable**: Extensible styling and behavior options
- **Type Safety**: Full TypeScript support
- **Responsive**: Mobile-first responsive design

## Usage
### Import the Module
```typescript
import { LabelMaterial } from '@pmeig/ngb-label';

@NgModule({
  imports: [LabelMaterial],
  // ...
})
export class AppModule { }
```
### Basic Label Usage
```html

<input type="email" class="form-control" label="Email Address" id="email">
<input type="text" floating="false" label-position="end" label="First Name" id="firstName">
```

## Integration with Other Modules
The Label module is designed to work seamlessly with other NGP Material modules:
### With Input Module
```html
<div class="mb-3">
  <label for="textInput" class="form-label">Text Input</label>
  <input type="text" class="form-control" id="textInput">
</div>
```
## Configuration
The module can be configured through the Angular build system and supports:
- **Development builds**: `tsconfig.lib.json`
- **Production builds**: `tsconfig.lib.prod.json`
- **Testing**: `tsconfig.spec.json`

## Dependencies
- **Angular**: 20.2.1+
- **Bootstrap**: 5.3.3+
- **TypeScript**: 5.8.3+

## Development
### Building
```bash
ng build label
```

## API Reference
### LabelMaterial Module
The main module that provides all label-related components and directives.
### Components
- Bootstrap-styled label components
- Accessibility enhancements

### Directives
- Label behavior directives

## Accessibility
The label module ensures:
- Proper label-input associations using attribute `for`
- ARIA attributes for screen readers
- Keyboard navigation support
- High contrast support
- Screen reader friendly validation messages

## Best Practices
1. **Always associate labels with inputs** using the attribute `for`
2. **Use descriptive label text** that clearly indicates the expected input
3. **Include required field indicators** using visual cues like asterisks
4. **Provide validation feedback** close to the associated input
5. **Use consistent label styling** throughout your application

## Contributing
This module is part of the NGP Material design system. Please follow the established coding standards and testing practices when contributing.
## License
This project is licensed under the terms specified in the root LICENSE file.

## Support
For issues and questions related to this module, please refer to the main project repository or contact the development team.
