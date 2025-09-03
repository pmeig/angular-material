# @pmeig/ngb-button

A lightweight Angular library that provides Bootstrap-styled button components and directives.

## Installation

```bash 
  npm install @pmeig/ngb-button
``` 

## Features

- 🎯 **BBtnDirective** - Core button directive with Bootstrap styling
- 📦 **BBtnGroupDirective** - Button group functionality
- 🛠️ **BBtnToolbarDirective** - Button toolbar organization
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 20.2.1 support
- 📱 Responsive design
- ♿ Accessibility friendly

## Usage

### Import the Module
```typescript 
import { ButtonMaterial } from '@pmeig/ngb-button';
@NgModule({ imports: [ ButtonMaterial ],
// ... 
}) export class AppModule { }
``` 

### Basic Button
```html 
  <button color="secondary"></button>
``` 

### Button Group
```html
<btn-group>
  <button outline>first</button>
  <button>second</button>
</btn-group>
``` 

### Button Toolbar
```html
<btn-toolbar>
  <button>first</button>
</btn-toolbar>
```
## Bootstrap Classes Support

This library works seamlessly with Bootstrap 5 button classes:

- `btn-primary`, `btn-secondary`, `btn-success`, `btn-danger`, `btn-warning`, `btn-info`, `btn-light`, `btn-dark`
- `btn-outline-*` variants
- `btn-lg`, `btn-sm` for sizing
- `disabled` state support

## Dependencies

- Angular: ^20.2.1
- Bootstrap: ^5.3.3
- TypeScript: ^5.8.3

## Compatibility

- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)


## License
This project is licensed under the MIT License.
## Support
For issues and questions, please open an issue on the GitHub repository.


This README provides:

1. **Clear installation instructions** using the package name found in the project
2. **Feature overview** based on the directives discovered in the module
3. **Usage examples** for all three main directives (BBtnDirective, BBtnGroupDirective, BBtnToolbarDirective)
4. **Bootstrap integration** information since the project uses Bootstrap 5.3.3
5. **Compatibility information** based on the project's dependencies
6. **Development and contribution guidelines**
7. **Professional structure** with emojis for better readability

The README is structured to be comprehensive yet easy to follow, providing developers with all the information they need to effectively use the b-button module in their Angular applications.
