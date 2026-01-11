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


## Bootstrap Classes Support
This library enhances standard Bootstrap 5 form validation classes:
- `was-validated` - Applied automatically on form submission or hover
- `form-validation` - Added to all forms for enhanced styling
- `is-valid` / `is-invalid` - Works with existing Bootstrap validation
- `valid-feedback` / `invalid-feedback` - Display validation messages

## Dependencies
- Angular: >=20.2.1
- @angular/common: >=20.2.1
- @pmeig/ngb-core: ^0.0.1
- tslib: ^2.3.0

## Compatibility
- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)


## Documentation

- **Form Controls**: [https://getbootstrap.com/docs/5.3/forms/form-control](https://getbootstrap.com/docs/5.3/forms/form-control/)
- **Form Layout**: [https://getbootstrap.com/docs/5.3/forms/layout](https://getbootstrap.com/docs/5.3/forms/layout/)
- **Form Validation**: [https://getbootstrap.com/docs/5.3/forms/validation](https://getbootstrap.com/docs/5.3/forms/validation/)


## License
This project is licensed under the MIT License.
## Support
For issues and questions, please open an issue on the GitHub repository.

