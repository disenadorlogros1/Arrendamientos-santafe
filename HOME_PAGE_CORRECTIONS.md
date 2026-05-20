# Home Page Corrections

## Document Reference
Source: "Algunas correcciones respecto al home.docx"
Last Updated: 2026-05-20

---

## 1. Header Navigation Update

### Current State
Header requires adjustments to navigation sections.

### Changes Required
Update header with the following navigation sections:
- **Inicio** (Home)
- **Propiedades** (Properties)
  - Buscar propiedades (Search properties)
  - Arrendar (Rent)
  - Comprar (Buy)
- **Servicios** (Services)
  - Todos los servicios (All services)
  - Solicitud de arrendamiento (Rental request)
  - Reportar reparación (Report repair)
- **Nosotros** (About Us)
- **WhatsApp** (Direct contact)
- **Pagar en línea** (Pay online)

---

## 2. Hero Section: "60 años guiando tus decisiones inmobiliarias"

### Current State
Hero section with background image and text.

### Changes Required

#### Main Text Formatting
Replace current text with proper hierarchy:

**Line 1:** "60 años acompañando (primera línea)"
- Font: Bold/Heavy
- Size: Larger

**Line 2:** "decisiones que importan"
- Font: Regular/Medium
- Styling: "decisiones que importan" text with variation
  - "decisiones que importan" should have underline/highlight in red or brand color

#### Alternative Format
The text should display as:
```
60 años acompañando
decisiones que importan
(with secondary line, "el decisiones que importan" can vary
gruesa y subrayar con barra roja)
```

---

## 3. Property Inquiry Section: "¿Tienes un inmueble para arrendar o vender?"

### Current State
CTA section with user input or selection.

### Changes Required

#### Text Formatting
Replace with dynamic text using variable placeholder:
```
"¿Tienes un inmueble para [VARIABLE: arrendar o vender]?"
```

**Additional Notes:**
- Text should use a variable that substitutes dynamically (gruesa y subrayar con barra blanca)
- Maintain text in red color
- Keep the sign of interrogation formatting (¿ al inicio, ? al final)

#### Helper Text
Below the main question, add:
```
Por favor, utilizar una variable gruesa y subrayar con 
barra blanca, manteniendo el texto en rojo, aún el del 
signo de interrogación (queremos ver cómo se ve)
```

---

## 4. Property Inquiry CTA Buttons

### Current State
Multiple buttons on hero section.

### Changes Required

**Only keep these CTA buttons:**
- **"Ver propiedades disponibles"** (replaces "Buscar inmueble")
- **"Hablar con un asesor"** (replaces or adds as secondary)

**Secondary Button Structure:**
```
○ Buscar inmueble (hidden/removed)
● "Consulta con nuestros asesores" (blue button)
```

---

## 5. Featured Properties Section: "Propiedades destacadas"

### Current State
Section with featured property carousel.

### Required Updates

#### Subtitle
**Replace current subtitle with:**
```
"Inmuebles disponibles ahora. Consulta, agencia o pide asesoría."
```

**Note:** Changed from "Consulta, agenda o..." to "Consulta, agencia o..."

---

## 6. Services Section: "Servicios principales"

### Current State
6-column service card layout with service descriptions.

### Changes Required

#### Service Descriptions
Update the following service text descriptions:

##### Arrendamientos (Rentals)
**Current:** [To be replaced]
**New:**
```
Encuentra tu próximo hogar o local. 
Te acompañamos desde la búsqueda hasta la firma.
```

##### Ventas (Sales)
**Current:** [To be replaced]
**New:**
```
Vende al precio justo. 
Valoramos tu inmueble con criterio de mercado.
```

##### Consignación (Consignment)
**Current:** [To be replaced]
**New:**
```
Nosotros conseguimos el arrendatario. 
Tú recibes el pago.
```

##### Administración (Administration)
**Current:** [To be replaced]
**New:**
```
Manejamos el cobro, los contratos 
y las reparaciones por ti.
```

---

## 7. Featured Properties: "Propiedades destacadas"

### Current State
Carousel component showing property cards.

### Required Updates

#### Subtitle Text
**Replace with:**
```
Inmuebles disponibles ahora. Consulta, agencia o pide asesoría.
```

This subtitle was previously updated to include "agencia" instead of "agenda".

---

## 8. Featured Properties - Ownership Section

### Current State
Section titled "Propiedades destacadas" with description and "Ver más" button.

### Changes Required

#### Subtitle Replacement
**From:**
```
Inmuebles disponibles ahora. Consulta, agenda o pide asesoría.
```

**To:**
```
Inmuebles disponibles ahora. Consulta, agencia o pide asesoría.
```

---

## Implementation Checklist

- [ ] Update header navigation menu structure
- [ ] Modify hero section text hierarchy and formatting
- [ ] Update property inquiry section with dynamic variable
- [ ] Adjust CTA buttons (keep only specified ones)
- [ ] Update featured properties subtitle throughout the page
- [ ] Replace service descriptions with new text
- [ ] Verify text formatting and hierarchy
- [ ] Test responsive design on mobile/tablet
- [ ] Ensure color consistency (brand red for CTA elements)
- [ ] Validate accessibility of all text changes

---

## Design Considerations

### Typography Hierarchy
- Hero section should have clear visual hierarchy
- Subtitle text should be consistently styled across sections
- Service descriptions should be readable and concise

### Color Scheme
- Brand Red (#F32735) for CTAs and highlights
- Dark Gray (#232222) for primary text
- Medium Gray (#808080) for secondary text
- Ensure proper contrast ratios for accessibility

### Spacing & Layout
- Maintain consistent padding/margins
- Ensure proper whitespace around text blocks
- Keep card-based layout for services

---

## Notes for Development Team

1. **Variables in Text**: Consider using React state/context for dynamic text substitution in the property inquiry section
2. **Button Styling**: Ensure all CTA buttons follow the updated specification
3. **Service Cards**: May need to adjust card height/width for new text
4. **Testing**: Verify all text changes display correctly at different screen sizes
5. **Copy Updates**: These changes should be reflected in content management system (if applicable)

---

## Status

- **Header Navigation**: Pending
- **Hero Section**: Pending
- **Property Inquiry Section**: Pending
- **CTA Buttons**: Pending  
- **Featured Properties Subtitle**: ✅ Updated in FeaturedSection.tsx
- **Service Descriptions**: Pending
- **Overall Page Review**: Pending

