# @pmeig/ngb-form

A powerful Angular library that provides Bootstrap-styled form validation with advanced features like hover validation and smart form state management.

## Installation

```bash
  npm install @pmeig/ngb-form
```

## Features
- 🎯 **Smart Form Validation** - Automatic Bootstrap validation styling
- ✨ **Hover Validation** - Show validation states on submit button hover
- 🔄 **Dynamic State Management** - Reactive form validation states
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 20.2.1 support with signals
- ♿ Accessibility friendly
- 📱 Responsive design

## Usage
### Import the Module
```typescript
import { FormMaterial } from '@pmeig/ngb-form';

@NgModule({
  imports: [
    FormMaterial
  ],
  // ...
})
export class AppModule { }
```
### Basic Form Validation
The directive automatically applies to all forms and FormGroup elements:
```html
<!-- Template-driven forms -->
<form>
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input 
      type="email" 
      class="form-control" 
      id="email" 
      name="email"
      [(ngModel)]="email"
      error="Please provide a valid email."
      valid="Nice you have a valid email!"
      required 
      email>
  </div>
  <button type="submit">Submit</button>
</form>

<!-- Reactive forms -->
<form [formGroup]="myForm" (ngSubmit)="onSubmit()">
  <div class="mb-3">
    <input 
      type="text"
      id="username"
      formControlName="username" error="Username is required." is-valid="false"> <!-- force to print error message -->
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```
### Advanced Features
#### Disable Validation
```html
<form [unvalidated]="true">
  <!-- Form content -->
</form>
```

#### Custom Hover Elements
```html
<!-- Specify custom elements for hover validation -->
<form [status-hover]="customElements">
  <!-- Form content -->
  <button type="button" #submitBtn class="btn btn-primary">Custom Submit</button>
</form>
```

```typescript
export class MyComponent {
  @ViewChild('submitBtn') submitBtn!: ElementRef;
  
  get customElements() {
    return [this.submitBtn.nativeElement];
  }
}
```
#### Disable Hover Validation
```html
<form [status-hover]="false">
  <!-- Form content -->
</form>
```
## Directive Properties
### BFormDirective

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `unvalidated` | `boolean` | `false` | Disables automatic validation styling |
| `status-hover` | `Element[]` | `boolean` | `true` | Controls hover validation behavior |

## How It Works
### Automatic Validation States
The directive automatically:
1. **Applies Bootstrap classes**: Adds `form-validation` class on initialization
2. **Manages validation states**: Toggles `was-validated` class based on form submission
3. **Handles hover validation**: Shows validation states when hovering over submit buttons
4. **Reactive updates**: Uses Angular signals for efficient state management

### Validation Flow
1. **Initial State**: Form loads without validation classes
2. **Hover State**: When hovering over submit buttons, validation classes are applied
3. **Submitted State**: After form submission, validation persists
4. **Dynamic Updates**: Validation states update reactively based on form changes

## Integration with Other Modules
This module works seamlessly with other @pmeig modules:
```typescript
import { PmeigFormsMaterial } from '@pmeig/ngb-material';

@NgModule({
  imports: [
    PmeigFormsMaterial // Includes FormMaterial + other form-related modules
  ]
})
export class AppModule { }
```
### Exclude Specific Modules
```typescript
import { PmeigFormsMaterial, AlertMaterial, TooltipMaterial } from '@pmeig/ngb-material';

@NgModule({
  imports: [
    PmeigFormsMaterial.excludes(AlertMaterial, TooltipMaterial)
  ]
})
export class AppModule { }
```
## Bootstrap Classes Support
This library enhances standard Bootstrap 5 form validation classes:
- `was-validated` - Applied automatically on form submission or hover
- `form-validation` - Added to all forms for enhanced styling
- `is-valid` / `is-invalid` - Works with existing Bootstrap validation
- `valid-feedback` / `invalid-feedback` - Display validation messages

## TypeScript Support
Full TypeScript support with proper typing:
```typescript
import { BFormDirective } from '@pmeig/ngb-form';

@Component({
  template: `
    <form [unvalidated]="isUnvalidated" [status-hover]="hoverElements">
      <!-- form content -->
    </form>
  `
})
export class MyComponent {
  isUnvalidated = false;
  hoverElements: Element[] = [];
}
```
## Dependencies
- Angular: ^20.2.1
- @angular/common: ^20.2.1
- @pmeig/ngb-core: ^0.0.1
- tslib: ^2.3.0

## Compatibility
- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Best Practices
### 1. Version bootstrap
```html
<form class="needs-validation" novalidate>
  <div class="mb-3">
    <input type="email" class="form-control" required>
    <div class="invalid-feedback">Invalid email</div>
  </div>
</form>
```
### 2. Version reactive forms with angular
```html
<form [formGroup]="myForm">
  <div class="mb-3">
    <input 
      type="email" 
      class="form-control"
      formControlName="field"
      error="Invalid email"
  </div>
</form>
```
### 3. Handle Dynamic Forms
```typescript
export class DynamicFormComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
}
```


## Documentation

- **Form Controls**: [https://getbootstrap.com/docs/5.3/forms/form-control](https://getbootstrap.com/docs/5.3/forms/form-control/)
- **Form Layout**: [https://getbootstrap.com/docs/5.3/forms/layout](https://getbootstrap.com/docs/5.3/forms/layout/)
- **Form Validation**: [https://getbootstrap.com/docs/5.3/forms/validation](https://getbootstrap.com/docs/5.3/forms/validation/)


## License
This project is licensed under the MIT License.
## Support
For issues and questions, please open an issue on the GitHub repository.
``` 

This README provides:

1. **Clear overview** of the form validation capabilities
2. **Comprehensive usage examples** showing both template-driven and reactive forms
3. **Advanced features documentation** including hover validation and custom configurations
4. **Property reference table** for all directive inputs
5. **Integration examples** with other modules in the ecosystem
6. **Bootstrap compatibility** information
7. **TypeScript support** examples
8. **Best practices** for different use cases
9. **Technical details** about how the validation flow works

The documentation focuses on the unique features of this form module, particularly the innovative hover validation system and smart state management that sets it apart from standard Bootstrap form validation.
```
