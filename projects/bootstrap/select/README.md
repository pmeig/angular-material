# Bootstrap Select Module

A Bootstrap-styled select component library for Angular applications, part of the NGP Material design system.

## Overview

The Bootstrap Select module provides advanced select components and directives that follow Bootstrap design patterns while integrating seamlessly with Angular applications. This module offers single and multiple selection capabilities, custom option handling, and enhanced form integration.

## Installation

This module is part of the NGP Material monorepo. Install it using npm:

```bash
npm install @pmeig/ngb-select
```
## Features
- **Bootstrap Integration**: Styled according to Bootstrap design principles
- **Angular Support**: Built for Angular 20.2.1+ with TypeScript 5.8.3
- **Single & Multiple Selection**: Support for both single and multiple selection modes
- **Advanced Option Management**: Custom option directives and value handling
- **Form Integration**: Full support for Angular reactive and template-driven forms
- **Accessibility**: WCAG compliant select components with proper ARIA attributes
- **Customizable**: Extensible styling and behavior options
- **Type Safety**: Full TypeScript support

## Usage
### Import the Module
```typescript
import { SelectMaterial } from '@pmeig/ngb-select';

@NgModule({
  imports: [SelectMaterial],
  // ...
})
export class AppModule { }
```
### Basic Select Usage
```html
<!-- Basic single select -->
<select [(selection)]="selected"> 
  <option selected>Choose...</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
```
### Multiple Selection
```html
<!-- Multiple select -->
<select [(selection)]="selected"  multiple>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
  <option value="4">Four</option>
  <option value="5">Five</option>
</select>
```
### With Angular Reactive Forms
```typescript
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

export class MyComponent {
  form: FormGroup;
  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      singleSelect: [''],
      multipleSelect: this.fb.array([])
    });
  }
}
```

```html
<form [formGroup]="form">
  <!-- Single selection -->
  <div class="mb-3">
    <label for="singleSelect" class="form-label">Single Select</label>
    <select id="singleSelect" formControlName="singleSelect">
      <option value="">Choose...</option>
      @for(let option of options; track option.label) {
      <option [value]="option.value">
        {{ option.label }}
      </option>
      }
    </select>
  </div>
</form>
```

### Select Sizes
```html
<!-- Large select -->
<select tall="lg">
  <option>Large select</option>
</select>

<!-- Default select -->
<select>
  <option>Default select</option>
</select>

<!-- Small select -->
<select tall="sm">
  <option>Small select</option>
</select>
```


## Configuration
The module can be configured through the Angular build system and supports:
- **Development builds**: `tsconfig.lib.json`
- **Production builds**: `tsconfig.lib.prod.json`
- **Testing**: `tsconfig.spec.json`

## Dependencies
- **Angular**: 20.2.1+
- **Bootstrap**: 5.3.3+
- **RxJS**: 7.8.0+
- **TypeScript**: 5.8.3+

## Development
### Building
```bash
ng build b-select
```

## API Reference
### SelectMaterial Module
The main module that provides all select-related components and directives.
### Directives
- **bSelect**: Main select directive for enhanced functionality
- **bSelectParent**: Parent container directive for select management
- **bSelectMultiple**: Multiple selection support directive
- **bOption**: Option directive for custom option handling

### Components
- Bootstrap-styled select components
- Single and multiple selection support
- Form integration utilities
- Validation state management

## Accessibility
The select module ensures:
- Proper ARIA attributes for screen readers
- Keyboard navigation support (Arrow keys, Enter, Space)
- Focus management for multiple selections
- High contrast support
- Screen reader friendly option announcements

## Best Practices
1. **Always provide a default option** for single selects
2. **Use clear, descriptive option labels**
3. **Group related options** using `<optgroup>` when appropriate
4. **Limit multiple selection options** to avoid overwhelming users
5. **Provide validation feedback** for required fields
6. **Use appropriate select sizes** based on context

## Contributing
This module is part of the NGP Material design system. Please follow the established coding standards and testing practices when contributing.
## License
This project is licensed under the terms specified in the root LICENSE file.

## Support
For issues and questions related to this module, please refer to the main project repository or contact the development team.
