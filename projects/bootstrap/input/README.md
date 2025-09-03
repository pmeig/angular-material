# Bootstrap Input Module

A Bootstrap-styled input component library for Angular applications, part of the NGP Material design system.

## Overview

The Bootstrap Input module provides a collection of input components and directives that follow Bootstrap design patterns while integrating seamlessly with Angular applications. This module is designed to offer consistent, accessible, and customizable input controls.

## Installation

This module is part of the NGP Material monorepo. Install it using npm:

```bash
npm install @pmeig/ngb-input
```

## Features
- **Bootstrap Integration**: Styled according to Bootstrap design principles
- **Angular Support**: Built for Angular 20.2.1+ with TypeScript 5.8.3
- **Reactive Forms**: Full support for Angular reactive forms
- **Accessibility**: WCAG compliant input components
- **Customizable**: Extensible styling and behavior
- **Type Safety**: Full TypeScript support

## Usage
### Import the Module
```typescript
import { InputMaterial } from '@pmeig/ngb-input';

@NgModule({
  imports: [InputMaterial],
  // ...
})
export class AppModule { }
```
### Basic Input Usage
```html
<!-- Basic text input -->
<input type="text" placeholder="Enter text">

<!-- With validation -->
<input type="email"
       [class.is-invalid]="emailControl.invalid && emailControl.touched"
       formControlName="email">
```

### Date Input Usage
convert string date from input to date object
* ts-date: Date object
* ngp-date: structure {year, month, day, hour, minute, second, millisecond, date: {year, month, day}, time: {hour, minute, second, millisecond}}}

```html
<input type="date" [date-type]="ngp-date" />
<input type="datetime-local" [date-type]="ngp-date" />
<input type="month" [date-type]="ts-date" />
```

### With Angular Forms
```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class MyComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
}
```

### Input Group

```html
<input-group>
  <label>Username</label>
  <input type="text" placeholder="Enter text">
</input-group>
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
ng build input
```
## API Reference
### Components
- Input components with Bootstrap styling
- Form validation integration
- Accessibility features

### Directives
- Custom input directives for enhanced functionality
- Validation state management
- Bootstrap class integration

### Services
- Input mapping utilities
- Form state management helpers

## Contributing
This module is part of the NGP Material design system. Please follow the established coding standards and testing practices when contributing.
## License
This project is licensed under the terms specified in the root LICENSE file.
## Related Modules
- Form components `@pmeig/ngb-form`
- Label components `@pmeig/ngb-label`
- Select components `@pmeig/ngb-select`
- Button components `@pmeig/ngb-button`

## Support
For issues and questions related to this module, please refer to the main project repository or contact the development team.
