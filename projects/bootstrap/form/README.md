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
- 🚀 Angular 21.2.0 support with signals
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

### BValidatorDirective

Applied to elements with `error`, `valid` or `decorator`, and to `[formControl]` / `[formControlName]` (not to `ngModel`).

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `error` | `string` | `''` | Message of an `invalid-feedback` element added after the field |
| `valid` | `string` | `''` | Message of a `valid-feedback` element added after the field |
| `is-valid` | `boolean` | `undefined` | Forces the state: `false` sets a custom validity (`:invalid`), `true` clears it; `undefined` follows the reactive control |
| `tooltip` | `boolean` | `false` | `invalid-tooltip` / `valid-tooltip` instead of `-feedback` |
| `decorator` | `boolean` | `true` | `false` adds `decorator-none` (no Bootstrap validation icon) |

The messages only show inside a form that has `was-validated` (after a submit, or while the mouse is over a submit
button, see `status-hover`): it is the `:invalid` / `:valid` CSS of Bootstrap. A field without any constraint is
`:valid`, so a submitted form shows **every** field green: put `is-valid` only where you want a state, or
`[unvalidated]="true"` on a form whose fields are validated by your own code.

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
- Angular: >=21.2
- @angular/common: >=21.2
- @pmeig/ngb-core: ^2.0.0
- tslib: ^2.3.0

## Compatibility
- Angular: 21.2+
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


## Accessibility (since 2.0.2)

`BValidatorDirective` tells the assistive technologies what Bootstrap shows with CSS:
- `aria-invalid="true"` while the field is invalid, and `aria-describedby` points to the **error** message
  (`<id>-invalid`) while it is invalid, to the **valid** message (`<id>-valid`) while it is valid. Only the message that
  applies is linked.
- A validator is announced once the user went through the field (blur or input): an empty required field is not an error
  before. A forced `is-valid="false"` is announced at once.
- A field without `id` gets its messages named with a generated id (`ngb-field-3-invalid`): in 2.0.0 and 2.0.1 two fields
  without id shared the id `-invalid`.
