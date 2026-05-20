# Property Card Design Specifications

## Overview
The property card is a vertical layout component used in the "Propiedades destacadas" section on the home page. Each card displays property information with an image, amenities, and action buttons.

## Card Layout & Dimensions

### Overall Card
- **Width**: 280px (fixed)
- **Height**: 380px (fixed)
- **Border Radius**: 8px
- **Background**: White (#FFFFFF)
- **Border**: 1px solid #F0F0F0
- **Box Shadow**: 
  - Default: `0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)`
  - Hover: `0 8px 25px -5px rgba(0,0,0,0.12), 0 4px 10px -6px rgba(0,0,0,0.06)`

### Image Container
- **Width**: 280px (full card width)
- **Height**: 240px
- **Aspect Ratio**: 1:1 (square)
- **Border Radius**: 8px (top corners)
- **Object Fit**: Cover
- **Hover Effect**: Image scales to 1.05x over 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)

## Action Buttons (Top Right)

### Button Container
- **Position**: Absolute, top 12px, right 12px
- **Layout**: Vertical column with 8px gap
- **Alignment**: Flex column

### Individual Buttons
- **Default Size**: 24px × 24px (circle)
- **Hover Size**: 44px × 44px (circle)
- **Transition Duration**: 0.3s ease
- **Background Color**: #F32735 (brand red)
- **Border Radius**: 50% (circle)
- **Icon Size**:
  - Default: 12px × 12px
  - Hover: 20px × 20px
- **Icon Color**: White (#FFFFFF)
- **Icon Stroke Width**: 2px

### Button Functions (Top to Bottom)
1. **Ver Más (Arrow Right)**
   - SVG: Polyline arrow pointing right
   - Points: 9 18, 15 12, 9 6

2. **Consultar (Chat Message)**
   - SVG: Chat bubble icon
   - Links to WhatsApp with company number: 573006557529

3. **Agendar (Calendar)**
   - SVG: Calendar grid icon
   - Rect: x=3, y=4, width=18, height=18, rx=2, ry=2
   - Lines: Dates and grid lines

4. **Favorito (Heart)**
   - SVG: Heart icon (outline, filled on hover)
   - Fill: White when hovering, none by default

## Content Section

### Container
- **Padding**: 16px (all sides)
- **Layout**: Flex column, space-between
- **Height**: Fills remaining space (140px)

### Price
- **Font**: Avenir LT Pro 85 Heavy
- **Font Weight**: 800
- **Font Size**: 18px
- **Line Height**: 1.3
- **Color**: #232222 (dark gray/black)
- **Margin Bottom**: 4px

### Location
- **Font**: Avenir LT Pro 55 Roman
- **Font Weight**: 400
- **Font Size**: 13px
- **Line Height**: 1.4
- **Color**: #232222
- **Margin Bottom**: 2px

### Type
- **Font**: Avenir LT Pro 65 Medium
- **Font Weight**: 300
- **Font Size**: 12px
- **Line Height**: 1.4
- **Color**: #808080 (medium gray)
- **Margin Bottom**: 8px

## Amenities Grid

### Grid Container
- **Layout**: CSS Grid, 4 columns
- **Gap**: 8px (between items)
- **Padding Top**: 12px
- **Border Top**: 1px solid #E8E8E8
- **Margin Top**: 12px

### Amenity Item
- **Display**: Flex column, centered
- **Width**: Auto (flex)
- **Items**: 4 total (Area, Bedrooms, Bathrooms, Parking/Pool)

### Icon
- **Size**: 16px × 16px
- **Stroke Color**: #F32735 (brand red)
- **Stroke Width**: 2px

### Label/Value
- **Font Size**: 11px
- **Font Weight**: 500
- **Color**: #232222 (for values) or #B0B0B0 (for missing)
- **Text Alignment**: Center

### Amenity Items Details

1. **Area (Área)**
   - Icon: Grid/ruler
   - Value: Property size (e.g., "65 M²")

2. **Bedrooms (Habitaciones)**
   - Icon: House with window
   - Value: Number (e.g., "2")

3. **Bathrooms (Baños)**
   - Icon: Bathtub
   - Value: Number (e.g., "1")

4. **Parking or Pool (Parqueadero/Piscina)**
   - If parking exists:
     - Icon: Car/parking
     - Value: Number of spaces
   - If no parking but pool:
     - Icon: Pool symbol
     - Value: ✓
   - If neither:
     - Value: - (dash)
     - Color: #B0B0B0 (gray)

## Reference Code

- **Position**: Bottom of content section
- **Font**: Avenir LT Pro 65 Medium
- **Font Weight**: 300
- **Font Size**: 11px
- **Line Height**: 1.4
- **Color**: #B0B0B0 (light gray)
- **Margin Top**: 8px
- **Format**: "Ref. XXXXX" (e.g., "Ref. V8676")

## Interactive Modal (Favorito/Save Property)

### Modal Overlay
- **Position**: Fixed, full viewport
- **Background**: rgba(0, 0, 0, 0.5) (50% black overlay)
- **Display**: Flex, centered
- **Z-Index**: 50

### Modal Content
- **Width**: 90% max, max 400px
- **Background**: White (#FFFFFF)
- **Border Radius**: 12px
- **Padding**: 24px
- **Box Shadow**: Standard elevation shadow

### Modal Header
- **Text**: "Guardar propiedad"
- **Font Size**: 18px
- **Font Weight**: 600
- **Color**: #232222
- **Margin Bottom**: 16px

### Modal Buttons

#### Google Login
- **Background**: #F32735 (brand red)
- **Text**: "Iniciar sesión con Google"
- **Width**: 100%
- **Padding**: 12px 16px
- **Border Radius**: 8px
- **Font Weight**: 600
- **Font Size**: 14px
- **Margin Bottom**: 12px

#### Facebook Login
- **Background**: #1877F2 (Facebook blue)
- **Text**: "Iniciar sesión con Facebook"
- **Width**: 100%
- **Padding**: 12px 16px
- **Border Radius**: 8px
- **Font Weight**: 600
- **Font Size**: 14px
- **Margin Bottom**: 16px

#### Divider Text
- **Text**: "O comparte por WhatsApp"
- **Color**: #808080
- **Font Size**: 14px
- **Text Align**: Center
- **Margin Bottom**: 16px

#### WhatsApp Share
- **Background**: #25D366 (WhatsApp green)
- **Text**: "Compartir en WhatsApp"
- **Width**: 100%
- **Padding**: 12px 16px
- **Border Radius**: 8px
- **Font Weight**: 600
- **Font Size**: 14px

#### Cancel Button
- **Background**: Transparent
- **Border**: 1px solid #E0E0E0
- **Text Color**: #808080
- **Text**: "Cancelar"
- **Width**: 100%
- **Padding**: 12px 16px
- **Border Radius**: 8px
- **Font Weight**: 600
- **Font Size**: 14px
- **Margin Top**: 12px

### WhatsApp Message Format

#### Favorite Share Message
```
Mira esta propiedad en [BARRIO]
Comodidades: [HABITACIONES] habitación/habitaciones, [BAÑOS] baño/baños, [PARQUEADERO], [PISCINA], etc.

es una de mis favoritas en arrendamiento Santa Fe
```

#### Consultation Message
```
Hola, quisiera consultar disponibilidad del inmueble [REFERENCE] ([LOCATION]).
```

## Responsive Behavior

### Desktop (≥768px)
- Card width: 280px
- Maintains full design with all features

### Tablet (≥640px, <768px)
- Card width: 280px (in carousel context)
- Font sizes: Slightly reduced if needed

### Mobile (<640px)
- Card width: Full width with margins
- Responsive typography scaling
- Touch-friendly button sizing

## Typography System

### Font Family Stack
Primary: `'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif`

### Font Weights Available
- **Avenir LT Pro 55 Roman**: Weight 400 (Regular)
- **Avenir LT Pro 65 Medium**: Weight 300/400 (Medium/Regular)
- **Avenir LT Pro 85 Heavy**: Weight 800 (Heavy/Bold)
- **Avenir Next Ultra Light**: Weight 100 (Ultra Light)

### Font Size Scale
- Price: 18px
- Location: 13px
- Type: 12px
- Amenity Labels: 11px
- Reference: 11px

## Color Palette

- **Brand Red**: #F32735
- **Dark Gray/Black**: #232222
- **Medium Gray**: #808080
- **Light Gray**: #B0B0B0
- **Border Gray**: #E8E8E8, #F0F0F0
- **White**: #FFFFFF
- **Facebook Blue**: #1877F2
- **WhatsApp Green**: #25D366

## Animation & Transition

- **Image Hover**: Scale 1 → 1.05, duration 0.6s, cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Button Hover**: Size 24px → 44px, duration 0.3s ease
- **Button Icon**: Size 12px → 20px, duration 0.3s ease
- **Box Shadow**: Default → Hover, duration 0.3s ease
- **All Transitions**: Smooth easing with explicit duration

## Accessibility

- **ARIA Labels**: All buttons have meaningful aria-labels
- **Color Contrast**: All text meets WCAG AA standards
- **Focus States**: Interactive elements should have visible focus indicators
- **Touch Targets**: Minimum 44px × 44px for buttons

## Data Structure

```typescript
interface Property {
  id: number;
  title: string;
  price: string;           // e.g., "$1'200,000"
  location: string;        // e.g., "Poblado"
  type: string;           // e.g., "Apartamento"
  size: string;           // e.g., "65 M²"
  reference: string;      // e.g., "Ref. V8676"
  image: string;          // Image URL or path
  bedrooms: number;       // e.g., 2
  bathrooms: number;      // e.g., 1
  parking?: number;       // Optional: e.g., 1
  pool?: boolean;         // Optional: e.g., true
  featured?: boolean;     // Optional: for featured section
}
```

---

## Notes for Implementation

1. **Fonts**: Ensure Avenir family is loaded via Adobe Typekit
2. **Hover States**: Use CSS transitions, not JavaScript animations where possible
3. **Images**: Implement lazy loading for carousel performance
4. **Accessibility**: Test with screen readers and keyboard navigation
5. **Performance**: Optimize SVG icons for web, consider sprite sheets
6. **Testing**: Verify on multiple devices and screen sizes

---

Last Updated: 2026-05-20
