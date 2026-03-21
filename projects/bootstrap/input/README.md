# @pmeig/ngb-input

A powerful Angular library that provides Bootstrap-styled input components with advanced features like automatic type detection, date handling, input groups, and smart value mapping.

## Installation
```bash
  npm install @pmeig/ngb-input
```
## Features

- 🎯 **BInputDirective** - Smart input directive with automatic Bootstrap styling
- 📅 **BInputDateDirective** - Advanced date input handling with multiple date formats
- 📦 **BInputGroupDirective** - Bootstrap input group functionality with automatic text styling
- 🔄 **Smart Value Mapping** - Automatic conversion between different data types
- ✨ **Type Detection** - Automatic styling based on input type
- 📝 **Describe Support** - Built-in help text functionality
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 21.2.0 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly
- 🛠️ Smart parent element management

## Usage

### Import the Module
```typescript
import { InputMaterial } from '@pmeig/ngb-input';

@NgModule({
imports: [
InputMaterial
],
// ...
})
export class AppModule { }
```
### Basic Input Usage
```html
<!-- Text input -->
<input type="text" placeholder="Enter your name">
```
### Input with Description
```html
<!-- String description -->
<input type="email" 
       describe="We'll never share your email with anyone else."
       placeholder="Enter email">

<!-- Template description -->
<input type="password"
[describe]="passwordHelp"
placeholder="Enter password">

<ng-template #passwordHelp>
Password must contain at least <strong>8 characters</strong> including numbers and symbols.
</ng-template>
```
### Different Input Types with Automatic Styling
```html
<!-- Regular text input (gets form-control) -->
<input type="text" placeholder="Text input">

<!-- Checkbox input (gets form-check-input) -->
<input type="checkbox" value="option1">

<!-- Radio input (gets form-check-input) -->
<input type="radio" name="options" value="option1">

<!-- Range input (gets form-range) -->
<input type="range" min="0" max="100" value="50">
```
### Date Inputs with Type Conversion
```html
<!-- Date input with TypeScript Date object -->
<input type="date" [date-type]="'ts-date'" [(value)]="selectedDate">

<!-- Date input with NGP Date structure -->
<input type="date" [date-type]="'ngp-date'" [(value)]="ngpDateObject">

<!-- DateTime input with NGP DateTime -->
<input type="datetime-local" [date-type]="'ngp-date'" [(value)]="dateTimeObject">

<!-- Month input -->
<input type="month" [date-type]="'ts-date'" [(value)]="selectedMonth">

<!-- Time input -->
<input type="time" [date-type]="'ngp-date'" [(value)]="selectedTime">

<!-- Week input -->
<input type="week" [date-type]="'ngp-date'" [(value)]="selectedWeek">
```
### Input Groups
```html
<!-- Basic input group -->
<input-group>
  <span>@</span>
  <input type="text" placeholder="Username">
</input-group>

<!-- Input group with size -->
<input-group size="lg">
  <span>$</span>
  <input type="number" placeholder="0.00">
  <span>.00</span>
</input-group>

<!-- Small input group -->
<input-group size="sm">
  <input type="text" placeholder="Small input">
  <button type="button">Go</button>
</input-group>
```

### Readonly and Disabled States
```html
<!-- Readonly input -->
<input type="text" 
       value="Read-only value" 
       [readonly]="true">

<!-- Disabled through form control -->
<input type="text"
placeholder="Controlled input"
formControlName="disabledField">
```
## API Reference

### BInputDirective

Applied automatically to most input types (excludes date inputs).

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `describe` | `string \| TemplateRef` | `undefined` | Help text or template for the input |
| `value` | `InputValue` | `undefined` | Input value with smart type conversion |
| `type` | `string` | `'text'` | Input type attribute |
| `readonly` | `boolean` | `false` | Makes the input read-only |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `valueChange` | `InputValue \| null` | Emitted when input value changes with converted type |

### BInputDateDirective

Applied automatically to date-related input types.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `date-type` | `'ts-date' \| 'ngp-date'` | `'ts-date'` | Date conversion format |

### BInputGroupDirective

Applied to `input-group` elements and `[input-group]` attribute.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `undefined` | Input group size |
| `input-group` | `'sm' \| 'md' \| 'lg'` | `'md'` | Alternative size specification |

## Date Type Conversion

### TypeScript Date (`ts-date`)
Returns standard JavaScript `Date` objects:
```typescript
selectedDate: Date = new Date();
```
### NGP Date (`ngp-date`)  
Returns structured date objects:
```typescript
interface NgpDate {
year: number;
month: number;  // 1-12
day: number;
date: { year: number; month: number; day: number };
}

interface NgpDateTime extends NgpDate {
hour: number;
minute: number;
second: number;
millisecond: number;
time: { hour: number; minute: number; second: number; millisecond: number };
}
```
## How It Works

### Automatic Type Detection
The input directives automatically:
1. **Detect input types**: Examines the input element's type attribute
2. **Apply appropriate classes**: Uses `form-control`, `form-check-input`, or `form-range`
3. **Manage parent containers**: Creates form-check containers for checkboxes/radios
4. **Handle value conversion**: Converts between different data types based on input type

### Smart Value Mapping
- **String inputs**: Direct value mapping
- **Date inputs**: Converts between Date objects and input string formats
- **Number inputs**: Automatic number conversion
- **Boolean inputs**: Checkbox/radio value handling

### Input Group Behavior
- **Text conversion**: Non-form elements become `input-group-text`
- **Label handling**: Repositions labels appropriately
- **Size management**: Applies Bootstrap sizing classes
- **Button integration**: Handles buttons within input groups

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 input classes:
- `form-control` - Applied to text, email, password, number, etc.
- `form-check-input` - Applied to checkbox and radio inputs
- `form-range` - Applied to range inputs
- `form-text` - Applied to description elements
- `input-group` - Container for input groups
- `input-group-text` - Text elements within input groups
- `input-group-sm`, `input-group-lg` - Size variants

## Dependencies

- **Angular**: >=21.2
- **@angular/common**: >=21.2
- **@pmeig/ngb-core**: ^0.0.1
- **tslib**: ^2.3.0

## Compatibility

- Angular: 21.2
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)


## Troubleshooting

### Common Issues

**Input styling not applying correctly**
- Check that the input type is correctly detected
- Verify form-control classes are being applied

**Date conversion not working**
- Ensure the correct `date-type` is specified
- Check that the input value matches the expected format
- Verify NgpDatePipe is properly configured

**Input groups not displaying correctly**
- Check that child elements are direct descendants
- Ensure proper Bootstrap structure is maintained
- Verify size attributes are valid

**Value changes not emitting**
- Check that the input is not readonly or disabled
- Ensure proper event binding syntax
- Verify form control state

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
