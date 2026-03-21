# @pmeig/ngb-carousel

A powerful Angular library that provides Bootstrap-styled carousel components with advanced features like auto-sliding, fade transitions, loop control, and smart navigation management.

## Installation

```bash
  npm install @pmeig/ngb-carousel
```


## Features

- 🎯 **BCarouselDirective** - Smart carousel directive with automatic slide management
- 📦 **BCarouselItemTemplate** - Template-based carousel items with lifecycle management
- 🔄 **Auto-Slide** - Configurable automatic slide transitions with direction control
- ✨ **Fade Mode** - Optional fade animations instead of slide transitions
- 🎚️ **Loop Control** - Enable/disable infinite looping with smart navigation
- 🧭 **Smart Navigation** - Automatic prev/next buttons and indicators with accessibility
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 21.2.0 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly
- 🛠️ Advanced slide direction optimization

## Usage

### Import the Module
```typescript
import { CarouselMaterial } from '@pmeig/ngb-carousel';

@NgModule({
  imports: [
    CarouselMaterial
  ],
  // ...
})
export class AppModule { }
```


### Basic Carousel
```html
<carousel id="basic-carousel">
  <ng-template>
    <h3>First Slide</h3>
    <p>Content for the first slide</p>
  </ng-template>
  <ng-template>
    <h3>Second Slide</h3>
    <p>Content for the second slide</p>
  </ng-template>
  <ng-template>
    <h3>Third Slide</h3>
    <p>Content for the third slide</p>
  </ng-template>
</carousel>
```


### Auto-Sliding Carousel
```html
<!-- Auto-slide every 3 seconds -->
<carousel id="auto-carousel" [auto]="3000">
  <ng-template>
    <div class="carousel-slide">Auto Slide 1</div>
  </ng-template>
  <ng-template>
    <div class="carousel-slide">Auto Slide 2</div>
  </ng-template>
  <ng-template>
    <div class="carousel-slide">Auto Slide 3</div>
  </ng-template>
</carousel>

<!-- Auto-slide in reverse direction -->
<carousel id="reverse-auto" [auto]="5000" direction="prev">
  <ng-template>
    <div class="carousel-slide">Reverse Slide 1</div>
  </ng-template>
  <ng-template>
    <div class="carousel-slide">Reverse Slide 2</div>
  </ng-template>
</carousel>
```


### Controlled Carousel
```html
<carousel id="controlled-carousel" 
          [(index)]="currentSlide"
          [loop]="enableLoop"
          [indicators]="true">
  <ng-template>
    <div class="text-center p-5">
      <h2>Controlled Slide 1</h2>
    </div>
  </ng-template>
  <ng-template>
    <div class="text-center p-5">
      <h2>Controlled Slide 2</h2>
    </div>
  </ng-template>
</carousel>
```


### Non-Looping Carousel
```html
<carousel id="linear-carousel" loop="false">
  <ng-template>
    <div class="slide-content">First Slide (no prev button)</div>
  </ng-template>
  <ng-template>
    <div class="slide-content">Middle Slide</div>
  </ng-template>
  <ng-template>
    <div class="slide-content">Last Slide (no next button)</div>
  </ng-template>
</carousel>
```


## API Reference

### BCarouselDirective

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | `''` | Unique identifier for the carousel |
| `fade` | `boolean` | `false` | Enables fade animation instead of slide |
| `loop` | `boolean` | `true` | Enables infinite looping of slides |
| `index` | `number` | `0` | Current active slide index |
| `auto` | `Timeout` | `undefined` | Auto-slide interval in milliseconds |
| `prev` | `boolean` | `true` | Shows/hides previous navigation button |
| `next` | `boolean` | `true` | Shows/hides next navigation button |
| `indicators` | `boolean` | `false` | Shows/hides slide indicators |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `indexChange` | `number` | Emitted when active slide index changes |

### BCarouselItemTemplate

Applied to `ng-template` elements within carousel.

- Automatically manages template instantiation and destruction
- Handles slide lifecycle for optimal performance
- Only creates DOM elements when slide becomes active

### BCarouselLoopOptionsDirective

Applied automatically to `carousel:not([loop=false])` elements.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `shortcut` | `boolean` | `true` | Enables shortest path calculation for looped navigation |

### BCarouselAutoOptionsDirective

Applied automatically to `carousel[auto]` elements.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `direction` | `'next' \| 'prev'` | `'next'` | Direction of auto-slide progression |

## How It Works

### Automatic Slide Management
The carousel directive automatically:
1. **Creates carousel structure**: Generates Bootstrap carousel HTML structure
2. **Manages navigation**: Creates prev/next buttons and indicators with proper accessibility
3. **Handles animations**: Applies Bootstrap slide and fade animations
4. **Controls timing**: Manages auto-slide intervals and animation durations
5. **Optimizes performance**: Only instantiates templates when slides become active

### Smart Navigation Behavior
- **Loop mode**: Buttons remain visible, slides cycle infinitely
- **Linear mode**: Hides prev button on first slide, next button on last slide
- **Auto-slide**: Temporarily hides navigation during auto-progression
- **Indicators**: Automatically generated based on number of slides

### Animation System
- **Slide transitions**: Uses Bootstrap's slide animations with direction detection
- **Fade transitions**: Optional crossfade effect for image carousels
- **Smart direction**: Calculates shortest path in loop mode for better UX

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 carousel classes:
- `carousel` - Main carousel container
- `carousel-slide` - Applied to carousel wrapper
- `carousel-fade` - Fade animation variant
- `carousel-inner` - Inner container for slides
- `carousel-item` - Individual slide items
- `carousel-item-next`, `carousel-item-prev` - Animation direction classes
- `carousel-control-next`, `carousel-control-prev` - Navigation buttons
- `carousel-indicators` - Slide indicators container
- `active` - Currently active slide

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

**Slides not displaying correctly**
- Ensure each slide is wrapped in `<ng-template>`
- Check that carousel has a unique `id` attribute
- Verify Bootstrap CSS is properly loaded

**Auto-slide not working**
- Check that `[auto]` value is a valid number in milliseconds
- Ensure auto-slide isn't disabled by user interaction
- Verify the carousel isn't paused due to focus or hover states

**Navigation buttons not appearing**
- Check `[prev]` and `[next]` inputs aren't set to `false`
- In non-loop mode, buttons hide at first/last slides respectively
- Ensure carousel container has proper Bootstrap structure

**Animations not smooth**
- Verify Bootstrap CSS transitions are not overridden
- Check for conflicting CSS animations
- Ensure proper timing in custom animation modifications

**Performance issues with many slides**
- Templates are instantiated only when active - this is optimal
- Consider lazy loading images within templates
- Use fade animations for better performance with image-heavy carousels

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
