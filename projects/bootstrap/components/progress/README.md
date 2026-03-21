# @pmeig/ngb-progress

A powerful Angular library that provides Bootstrap-styled progress components with HTTP request integration, animated load bars, and advanced color configuration options.

## Installation
```bash
  npm install @pmeig/ngb-progress
```
## Features

- 🎯 **BProgressComponent** - Full-featured progress bar with Bootstrap styling
- 📦 **BLoadBarComponent** - Animated loading bars with customizable movement patterns
- 🔄 **HTTP Integration** - Automatic progress tracking for HTTP requests
- ✨ **Color Theming** - Bootstrap color variants and custom color configurations
- 🎨 **Striped & Animated** - Visual enhancements with striped and animated patterns
- 🔢 **Dynamic Colors** - Change colors based on progress percentage
- 📱 **Observable Support** - Real-time progress updates via RxJS observables
- 🚀 Angular 21.2.0 support with signals
- ♿ Accessibility friendly with ARIA attributes
- 🛠️ Flexible configuration options

## Usage

### Import the Module
```typescript 
import { ProgressMaterial } from '@pmeig/ngb-progress';
@Component({
  imports: [ProgressMaterial],
  // ...
})
export class MyComponent { }
``` 

### Basic Progress Bar
```html
<progressbar observer="75" color="primary">
</progressbar>
```

### Progress Bar with Label
```html
<progressbar [observer]="currentProgress" label-enabled="false" color="success">
</progressbar>
```

### Striped Progress Bar
```html
<progressbar [observer]="uploadProgress" color="info" striped>
</progressbar>
```

### Animated Progress Bar
```html
<progressbar [observer]="loadingProgress" color="warning" striped animated>
</progressbar>
```

### HTTP Request Progress
```html
<progressbar [observer]="httpRequest$" color="primary">
</progressbar>
```
 

### Basic Progress Bar
```html
<progressbar observer="75" color="primary">
</progressbar>
```


### Progress Bar without Label
```html
<progressbar [observer]="currentProgress" label-enabled="false" color="success">
</progressbar>
```


### Striped Progress Bar
```html
<progressbar [observer]="uploadProgress" color="info" striped>
</progressbar>
```


### Animated Progress Bar
```html
<progressbar [observer]="loadingProgress" color="warning" animated>
</progressbar>
```


### HTTP Request Progress
```html
<progressbar [observer]="httpRequest$" color="primary">
</progressbar>
```

```typescript
export class MyComponent {
  httpRequest$: Observable<HttpEvent<any>>;

  constructor(private readonly http: HttpClient) {}

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.httpRequest$ = this.http.post('/api/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
```


### Dynamic Color Based on Progress
```html
<progressbar 
  [observer]="currentProgress" 
  color="danger"
  [various]="{
    30: 'warning',
    70: 'success'
  }">
</progressbar>
```


### Load Bar (Indeterminate Progress)
```html
<load-bar color="primary" speed="3" round>
</load-bar>
```


### Load Bar Without Circle Animation
```html
<load-bar color="info" [circle]="false" [speed]="5">
</load-bar>
```


## API Reference

### Progress Bar Component Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `observer` | `Observable<HttpEvent> \| number \| string` | `0` | Progress source - HTTP observable, number (0-100), or string percentage |
| `color` | `ColorConfig \| ColorAttribute` | `{style: ''}` | Progress bar color configuration |
| `various` | `Record<string, ColorAttribute>` | `{}` | Color changes based on progress percentage |
| `striped` | `boolean` | `false` | Adds striped pattern to progress bar |
| `animated` | `boolean` | `false` | Animates striped pattern (requires striped=true) |
| `label` | `boolean` | `true` | Shows progress percentage text |

### Load Bar Component Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `ColorAttribute` | `'primary'` | Load bar color |
| `speed` | `number` | `5` | Animation speed (lower = faster) |
| `round` | `boolean` | `true` | Rounded corners on progress bar |
| `circle` | `boolean` | `true` | Circular animation pattern vs linear |

#### Observer Input Types
- **Number**: Static percentage (0-100)
- **String**: Percentage string (e.g., "75%")
- **HTTP Observable**: Automatically tracks upload/download progress
- **Custom Observable**: Any observable emitting HttpEvent objects

## How It Works

### Progress Tracking
The progress component automatically:
1. **Value Processing**: Handles different input types (numbers, strings, observables)
2. **HTTP Integration**: Listens to HTTP events for upload/download progress
3. **Percentage Calculation**: Converts loaded/total bytes to percentage
4. **Color Management**: Applies colors based on current progress value
5. **ARIA Updates**: Maintains accessibility attributes

### Load Bar Animation
The load bar provides:
- **Continuous Animation**: Smooth, ongoing progress indication
- **Pattern Control**: Circular or linear animation patterns
- **Speed Configuration**: Adjustable animation timing
- **Visual Feedback**: For operations without definite progress

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 progress classes:
- `progress` - Main progress container
- `progress-bar` - Progress bar element
- `progress-bar-striped` - Striped pattern
- `progress-bar-animated` - Animated striped pattern
- `progress-stacked` - Stacked progress bars
- `bg-primary`, `bg-success`, etc. - Color variants

## Color Options

### Bootstrap Color Variants
- `primary`, `secondary`, `success`, `danger`
- `warning`, `info`, `light`, `dark`

### Custom Colors
- **CSS Colors**: Hex, RGB, HSL values
- **CSS Classes**: Custom background classes
- **Dynamic Colors**: Different colors for different progress ranges

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

**Progress not updating**
- Ensure the observer value is changing
- Check that the observable is emitting HttpEvent objects
- Verify that percentage values are within 0-100 range

**HTTP progress not working**
- Confirm that `reportProgress: true` is set in HTTP options
- Check that the server supports progress reporting
- Verify that `observe: 'events'` is included in HTTP request options

**Colors not applying**
- Ensure Bootstrap CSS is properly loaded
- Check that color names are valid Bootstrap variants
- Verify custom color syntax for hex/rgb values

**Animations not working**
- Ensure both `striped` and `animated` are set to true for animated stripes
- Check that Bootstrap animation CSS is loaded
- Verify that the browser supports CSS animations

**Load bar not animating**
- Check that the component is properly initialized
- Verify that speed value is a positive number
- Ensure there are no conflicting CSS styles

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on the GitHub repository.
