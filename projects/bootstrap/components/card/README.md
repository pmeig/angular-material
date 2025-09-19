# @pmeig/ngb-card

A powerful Angular library that provides Bootstrap-styled card components with advanced features like overlay mode, content projection slots, and automatic styling for images and navigation elements.

## Installation
```bash
  npm install @pmeig/ngb-card
```
## Features

- 🎯 **BCardComponent** - Smart card component with flexible content projection
- 🖼️ **BCardImgTopDirective** - Automatic styling for card top images
- 🧭 **BCardTabDirective** - Smart navigation styling within card headers
- 📦 **Content Projection** - Multiple slots for header, body, footer, and images
- ✨ **Overlay Mode** - Dark overlay styling for image backgrounds
- 🎨 Bootstrap 5.3.3 compatible styling
- 🚀 Angular 20.2.1 support with signals
- 📱 Responsive design
- ♿ Accessibility friendly
- 🛠️ Template-driven content projection

## Usage

### Import the Module
```typescript
import { CardMaterial } from '@pmeig/ngb-card';

@NgModule({
  imports: [
    CardMaterial
  ],
  // ...
})
export class AppModule { }
```


### Basic Card
```html
<card>
  <div header>Card Header</div>
  <p>This is the main card content in the body.</p>
  <div footer>Card Footer</div>
</card>
```


### Card with Image
```html
<card>
  <img src="image.jpg" alt="Card image" top>
  <div header>Card with Image</div>
  <p>Card content goes here...</p>
</card>
```


### Card with Overlay Mode
```html
<card overlay>
  <img src="background.jpg" alt="Background" image>
  <h5>Card Title</h5>
  <p>This text will appear over the image with dark overlay styling.</p>
</card>
```


### Card with Navigation
```html
<card>
  <div header>
    <nav class="nav nav-tabs">
      <a class="nav-link active" href="#">Tab 1</a>
      <a class="nav-link" href="#">Tab 2</a>
    </nav>
  </div>
  <p>Tab content goes here...</p>
</card>
```


## API Reference

### BCardComponent

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `overlay` | `boolean` | `false` | Enables overlay mode with dark background for text over images |

#### Content Projection Slots
- **`[header]`**: Header content area
- **`[image]`**: Image content area
- **`[footer]`**: Footer content area
- **`.list-group`**: List group content (positioned between body and footer)
- **Default slot**: Main card body content

### BCardImgTopDirective

Applied automatically to `img[top]` elements within cards.

- Adds `card-img-top` class for proper Bootstrap styling
- Only applies when used within a `card` component

### BCardTabDirective

Applied automatically to `nav` elements and `.nav` classes within card headers.

- Adds `card-header-tabs` class for tab navigation
- Adds `card-header-pills` class for pill navigation
- Only applies when navigation is within a card header

## How It Works

### Automatic Content Organization
The card component automatically:
1. **Organizes content slots**: Places header, image, body, list groups, and footer in correct order
2. **Applies Bootstrap classes**: Adds appropriate card classes (`card`, `card-header`, `card-body`, etc.)
3. **Handles overlay mode**: Switches between `card-body` and `card-img` classes based on overlay setting
4. **Manages conditional rendering**: Only renders sections when content is projected

### Smart Image Handling
- **Top images**: Automatically styled with `card-img-top` class
- **Overlay images**: Used as background with text overlay in overlay mode
- **Responsive behavior**: Images scale appropriately within card boundaries

### Navigation Integration
- **Tab styling**: Automatically applies `card-header-tabs` for tab navigation
- **Pill styling**: Applies `card-header-pills` for pill navigation
- **Context awareness**: Only applies styling when navigation is in card header

## Bootstrap Classes Support

This library generates and works with standard Bootstrap 5 card classes:
- `card` - Main card container
- `card-header` - Header area
- `card-body` - Main content area
- `card-footer` - Footer area
- `card-img-top` - Top positioned images
- `card-img` - Overlay images
- `card-header-tabs` - Tab navigation in header
- `card-header-pills` - Pill navigation in header
- `text-bg-dark` - Dark overlay styling

## Dependencies

- **Angular**: ^20.2.1
- **@angular/common**: ^20.2.1
- **@pmeig/ngb-core**: ^0.0.1
- **tslib**: ^2.3.0

## Compatibility

- Angular: 20.2.1+
- Bootstrap: 5.3.3+
- TypeScript: 5.8.3+
- Modern browsers (Chrome, Firefox, Safari, Edge)


## Troubleshooting

### Common Issues

**Images not displaying correctly**
- Ensure `image` attribute is added to img elements
- Check that images have proper `alt` attributes for accessibility
- Verify image paths are correct and accessible

**Content not appearing in correct sections**
- Check that content projection selectors match (`[header]`, `[footer]`, etc.)
- Ensure content is properly nested within the card component
- Verify that conditional rendering is working (sections only show when content exists)

**Overlay mode not working**
- Ensure `overlay="true"` or `overlay` is set on the card component
- Check that images are projected with `image` attribute
- Verify Bootstrap CSS is loaded for overlay styling

**Navigation styling not applying**
- Ensure navigation elements are within the card header slot
- Check that proper Bootstrap nav classes are applied
- Verify navigation structure follows Bootstrap conventions

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
