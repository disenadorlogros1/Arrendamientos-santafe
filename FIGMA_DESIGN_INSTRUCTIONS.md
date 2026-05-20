# Figma Design Instructions: Property Card

## Overview
This document provides step-by-step instructions to create the property card design in your Figma file: https://www.figma.com/design/NdVTQ9rGmlaG981csORkSZ/arjetas---Propiedades-Destacadas

---

## Prerequisites
- Figma account with edit access to the project
- Adobe Typekit integration enabled (or Avenir family fonts installed)
- Reference: Design Specifications in DESIGN_SPECS.md

---

## Step 1: Create Main Card Frame

1. **Create Frame**
   - Name: "Property Card"
   - Width: 280px
   - Height: 380px
   - Fill: White (#FFFFFF)
   - Stroke: 1px solid #F0F0F0
   - Corner Radius: 8px
   - Shadow: 
     - Default: `0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)`

---

## Step 2: Create Image Container

1. **Create Rectangle for Image**
   - Name: "Image"
   - Parent: Property Card frame
   - Width: 280px
   - Height: 240px
   - Y position: 0
   - Fill: Placeholder color #E5E5E5
   - Corner Radius: 8px
   - Stroke: 1px solid #D0D0D0 (for visibility in design)

2. **Image Placeholder Text** (optional for design phase)
   - Add text "Image (280x240)" centered
   - Font: Avenir, 14px, gray
   - This will be replaced with actual image in code

---

## Step 3: Create Action Buttons Container

1. **Create Frame for Buttons**
   - Name: "Action Buttons"
   - Parent: Image frame (as child, absolute positioned)
   - Width: Auto or 160px
   - Height: Auto or 40px
   - Position: Top 12px, Right 12px
   - Layout: Vertical stack, gap 8px
   - No fill/stroke

2. **Create Four Button Circles**
   
   ### Button 1: Ver Más
   - Name: "Button Ver Más"
   - Type: Ellipse
   - Width: 24px
   - Height: 24px
   - Fill: #F32735 (brand red)
   - Add SVG Icon: Arrow right (points: 9 18, 15 12, 9 6)
   - Stroke: None
   - Add component note: "Hovers to 44x44px with 20x20px icon"

   ### Button 2: Consultar
   - Name: "Button Consultar"
   - Type: Ellipse
   - Width: 24px
   - Height: 24px
   - Fill: #F32735 (brand red)
   - Add SVG Icon: Chat bubble
   - Stroke: None
   - Add component note: "Links to WhatsApp"

   ### Button 3: Agendar
   - Name: "Button Agendar"
   - Type: Ellipse
   - Width: 24px
   - Height: 24px
   - Fill: #F32735 (brand red)
   - Add SVG Icon: Calendar grid
   - Stroke: None
   - Add component note: "Schedule action button"

   ### Button 4: Favorito
   - Name: "Button Favorito"
   - Type: Ellipse
   - Width: 24px
   - Height: 24px
   - Fill: #F32735 (brand red)
   - Add SVG Icon: Heart (outline)
   - Stroke: None
   - Add component note: "Opens modal on click"

---

## Step 4: Create Content Section Frame

1. **Create Frame for Content**
   - Name: "Content"
   - Parent: Property Card frame
   - Position: Y = 240px
   - Width: 280px
   - Height: 140px
   - Padding: 16px (all sides)
   - Layout: Vertical, space-between
   - No fill/stroke (transparent)

---

## Step 5: Create Price Text

1. **Create Text Layer**
   - Name: "Price"
   - Parent: Content frame
   - Content: "$1'200,000" (example)
   - Font: Avenir LT Pro 85 Heavy
   - Font Size: 18px
   - Font Weight: 800
   - Line Height: 1.3
   - Color: #232222
   - Margin Bottom: 4px
   - Letter Spacing: 0

---

## Step 6: Create Location and Type Section

1. **Create Frame for Location/Type**
   - Name: "Location & Type"
   - Parent: Content frame
   - Layout: Vertical, gap 2px
   - No fill/stroke

2. **Location Text**
   - Name: "Location"
   - Content: "Poblado" (example)
   - Font: Avenir LT Pro 55 Roman
   - Font Size: 13px
   - Font Weight: 400
   - Line Height: 1.4
   - Color: #232222
   - Margin Bottom: 2px

3. **Type Text**
   - Name: "Type"
   - Content: "Apartamento" (example)
   - Font: Avenir LT Pro 65 Medium
   - Font Size: 12px
   - Font Weight: 300
   - Line Height: 1.4
   - Color: #808080
   - Margin Bottom: 8px

---

## Step 7: Create Amenities Grid

1. **Create Grid Frame**
   - Name: "Amenities"
   - Parent: Content frame
   - Width: 248px (280px - 32px padding)
   - Height: 50px
   - Layout: Grid
   - Columns: 4
   - Column Gap: 8px
   - Row Gap: 8px
   - Padding Top: 12px
   - Border Top: 1px solid #E8E8E8
   - Add divider line above grid

2. **Create Amenity Item 1: Area**
   - Name: "Amenity Area"
   - Layout: Vertical, centered
   - Icon: Grid/ruler 16x16px, stroke #F32735, 2px width
   - Label: "Área"
   - Value: "65 M²" (example)
   - Value Font: 11px, weight 500, color #232222

3. **Create Amenity Item 2: Bedrooms**
   - Name: "Amenity Bedrooms"
   - Layout: Vertical, centered
   - Icon: House icon 16x16px, stroke #F32735, 2px width
   - Label: "Habitaciones"
   - Value: "2" (example)
   - Value Font: 11px, weight 500, color #232222

4. **Create Amenity Item 3: Bathrooms**
   - Name: "Amenity Bathrooms"
   - Layout: Vertical, centered
   - Icon: Bathtub icon 16x16px, stroke #F32735, 2px width
   - Label: "Baños"
   - Value: "1" (example)
   - Value Font: 11px, weight 500, color #232222

5. **Create Amenity Item 4: Parking/Pool**
   - Name: "Amenity Parking"
   - Layout: Vertical, centered
   - Icon: Parking icon 16x16px, stroke #F32735, 2px width (or pool icon if applicable)
   - Label: "Parqueadero"
   - Value: "1" (example, or "✓" for pool, or "-" for neither)
   - Value Font: 11px, weight 500, color #232222

---

## Step 8: Create Reference Code

1. **Create Text Layer**
   - Name: "Reference"
   - Parent: Content frame
   - Content: "Ref. V8676" (example)
   - Font: Avenir LT Pro 65 Medium
   - Font Size: 11px
   - Font Weight: 300
   - Line Height: 1.4
   - Color: #B0B0B0
   - Margin Top: 8px

---

## Step 9: Create Component and Variants

1. **Convert to Component**
   - Select Property Card frame
   - Right-click → "Create component"
   - Name: "Property Card"
   - Set as main component

2. **Create Variants** (Optional but recommended)
   - State 1: Default (normal state)
   - State 2: Hover (with shadow elevated)
   - State 3: Active/Selected (if needed)

---

## Step 10: Add Interactive Prototyping (Optional)

1. **Button Actions** (in Prototype panel)
   - Ver Más button: Link to details page
   - Consultar button: Link to WhatsApp or contact
   - Agendar button: Link to calendar/booking
   - Favorito button: Open modal prototype

2. **Modal Frame** (separate frame)
   - Name: "Favorite Modal"
   - Create dark overlay rectangle
   - Create white modal with:
     - Title: "Guardar propiedad"
     - 3 buttons: Google, Facebook, Cancel
     - WhatsApp share option
     - See HOME_PAGE_CORRECTIONS.md for styling

---

## Step 11: Design System Integration

1. **Create Color Styles**
   - Brand Red: #F32735
   - Dark Gray: #232222
   - Medium Gray: #808080
   - Light Gray: #B0B0B0
   - Border Gray: #E8E8E8

2. **Create Typography Styles**
   - Heading: 18px, 800 weight, Avenir Heavy
   - Body Large: 13px, 400 weight, Avenir Roman
   - Body: 12px, 300 weight, Avenir Medium
   - Small: 11px, 300 weight, Avenir Medium
   - Tiny: 11px, 300 weight, Avenir Medium

3. **Create Shadow Styles**
   - Elevation 1: 0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)
   - Elevation 2: 0 8px 25px -5px rgba(0,0,0,0.12), 0 4px 10px -6px rgba(0,0,0,0.06)

---

## Step 12: Testing the Design

1. **Check Dimensions**
   - Card: 280x380px ✓
   - Image: 280x240px ✓
   - Content: 280x140px ✓

2. **Verify Spacing**
   - Content padding: 16px ✓
   - Grid gap: 8px ✓
   - Button gap: 8px ✓

3. **Confirm Typography**
   - All font families match Avenir ✓
   - Font sizes match spec ✓
   - Font weights correct ✓
   - Line heights applied ✓

4. **Check Colors**
   - Brand red used correctly ✓
   - Text colors match spec ✓
   - Sufficient contrast ✓

5. **Test Interactions**
   - Hover states visible ✓
   - Button scaling works ✓
   - Modal interaction works ✓

---

## Step 13: Export & Documentation

1. **Add Annotations**
   - Document responsive behavior
   - Note animation specs
   - Link to dev spec file

2. **Export Assets**
   - Export icons as SVG
   - Document icon names
   - Create icon usage guide

3. **Create Dev Handoff**
   - Right-click component → "Copy Figma link"
   - Share link with development team
   - Include DESIGN_SPECS.md reference

---

## Example Data (for Design Testing)

Use these example values to populate the design:

```
Property 1:
- Price: $1'200,000
- Location: Poblado
- Type: Apartamento
- Size: 65 M²
- Bedrooms: 2
- Bathrooms: 1
- Parking: 1
- Pool: Yes
- Reference: Ref. V8676

Property 2:
- Price: $1'800,000
- Location: Envigado
- Type: Casa
- Size: 120 M²
- Bedrooms: 3
- Bathrooms: 2
- Parking: 2
- Pool: Yes
- Reference: Ref. V8677

Property 3:
- Price: $950,000
- Location: Laureles
- Type: Apartamento
- Size: 50 M²
- Bedrooms: 1
- Bathrooms: 1
- Parking: 1
- Pool: No
- Reference: Ref. V8678
```

---

## Checklist for Completion

- [ ] Card frame created (280x380px)
- [ ] Image container created (280x240px)
- [ ] Action buttons positioned and styled (4 buttons, 24x24px default, #F32735)
- [ ] Price text created (18px, 800 weight, Avenir Heavy)
- [ ] Location text created (13px, 400 weight, Avenir Roman)
- [ ] Type text created (12px, 300 weight, Avenir Medium, gray)
- [ ] Amenities grid created (4 columns, 8px gap)
- [ ] All amenity icons added with correct colors
- [ ] Reference code added (11px, light gray)
- [ ] Component created and main component set
- [ ] Shadows applied
- [ ] Border colors correct
- [ ] Typography styles created
- [ ] Color styles created
- [ ] Responsive behavior documented
- [ ] Interactive prototype created (optional)
- [ ] Design reviewed for accuracy vs spec
- [ ] Ready for code implementation

---

## Troubleshooting

### Fonts Not Showing?
- Ensure Adobe Typekit is enabled in Figma
- Install Avenir family fonts locally
- Use fallback: Select fonts from system if Avenir unavailable

### Colors Look Different?
- Verify hex colors (#F32735, #232222, etc.)
- Check that RGB values match hex
- Ensure no color filters applied

### Spacing Doesn't Match?
- Double-check all padding values (16px for content)
- Verify gap values (8px in grids)
- Use Figma's measurement tools

### Icons Look Blurry?
- Ensure icon sizes are whole numbers (16px, not 16.5px)
- Stroke width set to 2px
- Use pixel grid snapping

---

## Next Steps

1. **Complete the Figma design** following these instructions
2. **Share the Figma link** with the development team
3. **Verify pixel-perfect accuracy** by comparing screenshots
4. **Export design tokens** for implementation
5. **Create dev handoff document** with all specifications
6. **Begin code implementation** using PropertyCard.tsx component

---

**Design Version**: 1.0  
**Last Updated**: 2026-05-20  
**Status**: Ready for Implementation

