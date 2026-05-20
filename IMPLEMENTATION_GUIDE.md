# Implementation Guide: Property Card & Home Page Updates

## Project Overview
This guide outlines the complete implementation process for redesigning the property card component and applying home page corrections to the Arrendamientos Santa Fe website.

---

## Documentation Structure

This project uses four key documentation files:

### 1. **DESIGN_SPECS.md** 
Contains all technical specifications for the property card including:
- Dimensions and layout (280x380px card, 280x240px image)
- Typography system (Avenir family fonts with multiple weights)
- Color palette (#F32735 brand red, #232222 dark gray, etc.)
- Interactive states and animations
- Responsive behavior
- Accessibility guidelines

**Use this file for**: Reference during Figma design and code implementation

### 2. **FIGMA_DESIGN_INSTRUCTIONS.md**
Step-by-step instructions to create the property card design in Figma:
- 13 detailed steps from frame creation to component setup
- Component creation and variant setup
- Interactive prototyping guidance
- Design system integration
- Testing checklist

**Use this file for**: Creating the visual design in Figma

### 3. **HOME_PAGE_CORRECTIONS.md**
Documents all corrections needed for the home page:
- Header navigation structure (6 sections)
- Hero section ("60 años guiando...")
- Property inquiry section updates
- CTA button specifications
- Featured properties subtitle (✅ Already updated)
- Service descriptions (new text provided)

**Use this file for**: Planning and tracking home page modifications

### 4. **This File (IMPLEMENTATION_GUIDE.md)**
High-level overview and coordination guide.

---

## Current Project Status

### ✅ Completed
- [x] Featured Section subtitle updated: "Inmuebles disponibles ahora. Consulta, agencia o pide asesoría."
- [x] PropertyCard.tsx component implemented with:
  - Vertical layout (280x380px)
  - Image container with hover scaling
  - 4 action buttons (Ver Más, Consultar, Agendar, Favorito)
  - Amenities grid (4 columns)
  - Reference code display
  - Favorite modal with login and WhatsApp options
- [x] Design specifications documented
- [x] Figma design instructions created
- [x] Home page corrections documented

### ⏳ In Progress
- [ ] Figma design creation (using provided instructions)
- [ ] Design pixel-perfect verification
- [ ] Code-to-design alignment validation

### 📋 Pending
- [ ] Additional home page header navigation implementation
- [ ] Hero section text hierarchy updates
- [ ] Service descriptions updates (4 service cards text replacement)
- [ ] CTA button refinements
- [ ] Full page responsive testing

---

## Implementation Workflow

### Phase 1: Figma Design (Current Priority)
**Duration**: 1-2 hours  
**Owner**: Design team

#### Tasks:
1. Open your Figma file: https://www.figma.com/design/NdVTQ9rGmlaG981csORkSZ/arjetas---Propiedades-Destacadas
2. Follow FIGMA_DESIGN_INSTRUCTIONS.md step-by-step:
   - Create main card frame (280x380px)
   - Add image container (280x240px)
   - Create 4 action buttons with red circles
   - Build content section with typography
   - Create 4-column amenities grid
   - Add reference code
   - Convert to component and create variants
3. Apply DESIGN_SPECS.md for all measurements and styles:
   - Colors: #F32735, #232222, #808080, #B0B0B0
   - Fonts: Avenir family with correct weights (55, 65, 85)
   - Spacing: 16px padding, 8px gaps
   - Shadows: Default and hover states
4. Test design against specifications
5. Share final Figma file link for dev handoff

#### Success Criteria:
- ✓ Card dimensions exactly 280x380px
- ✓ All colors match specification
- ✓ Typography matches (font families, sizes, weights)
- ✓ Spacing and alignment precise (±1px)
- ✓ Component created and ready for handoff
- ✓ Hover states documented

---

### Phase 2: Code Implementation (Next Priority)
**Duration**: 2-3 hours  
**Owner**: Development team

#### Tasks:
1. Review current PropertyCard.tsx in `/src/components/PropertyCard.tsx`
   - Current implementation already matches design intent
   - All visual elements properly positioned
   - Interactive functionality complete
   
2. Compare code against Figma design
   - Verify dimensions match (280x380px)
   - Check color values (#F32735 for buttons)
   - Confirm font specifications
   - Validate spacing and padding
   - Test hover animations (0.3s ease transitions)

3. Refine component if needed based on Figma
   - Adjust any spacing discrepancies
   - Update typography if measurements differ
   - Ensure animation timing matches design

4. Test in browser
   - Responsive layout check
   - Hover state functionality
   - Modal interaction
   - WhatsApp link generation

5. Performance optimization
   - Image lazy loading
   - SVG icon optimization
   - CSS optimization

#### Success Criteria:
- ✓ Code matches Figma design pixel-perfectly
- ✓ All animations work smoothly
- ✓ Responsive on mobile/tablet/desktop
- ✓ WhatsApp functionality operational
- ✓ Modal opens/closes correctly
- ✓ Accessibility meets WCAG AA standards

---

### Phase 3: Home Page Updates (Parallel)
**Duration**: 2-3 hours  
**Owner**: Development team

#### Tasks:
1. Header Navigation Update
   - Add navigation structure from HOME_PAGE_CORRECTIONS.md
   - Implement 6 sections: Inicio, Propiedades, Servicios, Nosotros, WhatsApp, Pagar en línea
   - Add dropdowns for Propiedades and Servicios

2. Hero Section
   - Update text hierarchy for "60 años guiando..."
   - Add visual emphasis (underline, color, weight variation)
   - Implement dynamic variable substitution

3. Property Inquiry Section
   - Replace text with "¿Tienes un inmueble para [VARIABLE]?"
   - Implement variable state management
   - Update CTA buttons (keep only specified ones)

4. Service Descriptions
   - Replace 4 service card texts with new descriptions:
     - Arrendamientos: "Encuentra tu próximo hogar o local..."
     - Ventas: "Vende al precio justo..."
     - Consignación: "Nosotros conseguimos el arrendatario..."
     - Administración: "Manejamos el cobro..."

5. Testing
   - Verify all text displays correctly
   - Test responsive behavior
   - Check color and typography

#### Success Criteria:
- ✓ All header navigation sections present
- ✓ Dynamic text variables working
- ✓ Service descriptions updated and displayed
- ✓ CTA buttons correct and functional
- ✓ Responsive on all screen sizes
- ✓ No broken links or missing content

---

## Code Files to Modify

### Immediate (Property Card)
- [x] `/src/components/PropertyCard.tsx` - Already implemented ✓
- [x] `/src/components/FeaturedSection.tsx` - Subtitle updated ✓

### Next (Home Page)
- [ ] `/src/components/Header.tsx` - Add navigation structure
- [ ] `/src/components/HeroSection.tsx` - Update text hierarchy
- [ ] `/src/components/PropertyInquirySection.tsx` - Add variable substitution
- [ ] `/src/components/ServicesSection.tsx` - Update descriptions
- [ ] `/src/data/properties.ts` - Already contains all property data ✓

### Configuration
- [ ] `/tailwind.config.ts` - Ensure color palette is defined
- [ ] `/src/styles/globals.css` - Verify font loading

---

## Design System Reference

### Color Palette
```
Primary Red:      #F32735 (brand color for CTAs and highlights)
Dark Gray:        #232222 (primary text)
Medium Gray:      #808080 (secondary text)
Light Gray:       #B0B0B0 (tertiary/disabled text)
Border Gray:      #E8E8E8 (borders and dividers)
White:            #FFFFFF (backgrounds)
Facebook Blue:    #1877F2 (social login)
WhatsApp Green:   #25D366 (messaging CTA)
```

### Typography Stack
```
Font Family: 'Avenir LT Pro 65 Medium', 'Avenir', system-ui, sans-serif

Weights:
- 55 Roman: Regular (400)
- 65 Medium: Regular/Medium (300-400)
- 85 Heavy: Bold/Heavy (800)
- Next Ultra Light: Ultra Light (100)

Key Sizes:
- Hero Title: 24-32px
- Section Title: 20-24px  
- Card Price: 18px
- Card Location: 13px
- Card Type: 12px
- Amenity Label: 11px
- Reference: 11px
- Body: 14-16px
```

### Spacing Scale
```
xs: 4px
sm: 8px (card gaps)
md: 12px (section gaps)
lg: 16px (card padding)
xl: 24px (modal padding)
2xl: 32px (section padding)
```

### Border Radius
```
Card: 8px
Buttons: 50% (circles) or 8px (square buttons)
Modal: 12px
```

### Shadows
```
Elevation 1 (default): 
  0 1px 3px 0 rgba(0,0,0,0.04), 
  0 1px 2px -1px rgba(0,0,0,0.03)

Elevation 2 (hover): 
  0 8px 25px -5px rgba(0,0,0,0.12), 
  0 4px 10px -6px rgba(0,0,0,0.06)
```

### Animations
```
Image Hover Zoom:
  Scale: 1 → 1.05
  Duration: 0.6s
  Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)

Button Scale:
  Size: 24px → 44px
  Duration: 0.3s
  Easing: ease

Button Icon Scale:
  Size: 12px → 20px
  Duration: 0.3s
  Easing: ease

Shadow Transition:
  Duration: 0.3s
  Easing: ease
```

---

## Testing Checklist

### Visual Testing
- [ ] Card dimensions match specification (280x380px)
- [ ] Image size correct (280x240px)
- [ ] All colors match hex values exactly
- [ ] Font sizes and weights correct
- [ ] Spacing and padding align (±1px tolerance)
- [ ] Button sizing and positioning accurate

### Interactive Testing
- [ ] Hover states work (card shadow, image zoom, button size)
- [ ] Buttons scale smoothly (0.3s transition)
- [ ] Favorito modal opens and closes
- [ ] Modal buttons functional
- [ ] WhatsApp links generate correct messages
- [ ] Links open in new tabs/windows

### Responsive Testing
- [ ] Desktop (≥1280px): Full design
- [ ] Tablet (768px-1279px): Proper scaling
- [ ] Mobile (320px-767px): Responsive layout
- [ ] Touch interactions work (buttons 44x44px minimum)
- [ ] Text readable at all sizes
- [ ] Modal responsive and accessible

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] ARIA labels present on buttons
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Screen reader compatible
- [ ] Focus states visible
- [ ] No keyboard traps

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Considerations

### Optimization Priority
1. **Image Loading**: Implement lazy loading in carousel
2. **SVG Icons**: Optimize icon file sizes
3. **CSS**: Minimize unused styles
4. **JavaScript**: Memoize callbacks in PropertyCard
5. **Animations**: Use GPU acceleration (transform, opacity)

### Metrics to Monitor
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.8s

---

## Deployment Steps

### 1. Local Testing
```bash
npm run dev
# Test at http://localhost:3000
# Verify all changes visually and functionally
```

### 2. Build Verification
```bash
npm run build
# Check for any build errors or warnings
npm run lint
# Ensure code quality standards
```

### 3. Staging Deployment
```bash
# Deploy to staging environment
# Run full QA testing
# Verify mobile and desktop
# Test all interactive features
```

### 4. Production Deployment
```bash
# Final review and approval
# Deploy to production
# Monitor for errors
# Verify live functionality
```

---

## Timeline Estimate

| Phase | Task | Duration | Status |
|-------|------|----------|--------|
| 1 | Figma design creation | 1-2h | Pending |
| 2 | Code review & validation | 30m | Pending |
| 2 | Component refinement | 1-2h | Pending |
| 3 | Header navigation | 1h | Pending |
| 3 | Hero section updates | 1h | Pending |
| 3 | Service descriptions | 30m | Pending |
| 3 | Testing & QA | 2-3h | Pending |
| - | **Total Estimated** | **8-10h** | - |

---

## Resources

### Key Files
- Property data: `/src/data/properties.ts`
- Main component: `/src/components/PropertyCard.tsx`
- Featured section: `/src/components/FeaturedSection.tsx`
- Styles: `/src/styles/globals.css`
- Config: `/tailwind.config.ts`

### External Tools
- Figma: https://www.figma.com/design/NdVTQ9rGmlaG981csORkSZ/arjetas---Propiedades-Destacadas
- Adobe Typekit: For Avenir font family
- WhatsApp API: For message generation

### References
- DESIGN_SPECS.md: Complete design specifications
- FIGMA_DESIGN_INSTRUCTIONS.md: Step-by-step Figma guide
- HOME_PAGE_CORRECTIONS.md: All page updates
- IMPLEMENTATION_GUIDE.md: This file

---

## Success Criteria (Overall Project)

- ✓ Figma design created and matches specification
- ✓ PropertyCard component displays identically to design
- ✓ All animations smooth and performant
- ✓ Interactive features functional (modals, links, etc.)
- ✓ Responsive on all device sizes
- ✓ Accessibility compliant (WCAG AA)
- ✓ Home page navigation updated
- ✓ Hero section redesigned
- ✓ Service descriptions updated
- ✓ CTA buttons finalized
- ✓ All testing passed (visual, interactive, responsive)
- ✓ Performance metrics met
- ✓ Zero console errors or warnings
- ✓ Ready for production deployment

---

## Next Immediate Action

### For Design Team:
1. Open Figma file
2. Follow FIGMA_DESIGN_INSTRUCTIONS.md
3. Create property card design
4. Share final design link for dev handoff

### For Development Team:
1. Review DESIGN_SPECS.md thoroughly
2. Keep PropertyCard.tsx implementation ready
3. Prepare to implement home page corrections
4. Set up testing environment
5. Plan deployment schedule

---

## Support & Troubleshooting

### Common Issues & Solutions

**Issue**: Fonts not displaying correctly
- **Solution**: Verify Adobe Typekit integration in Figma, install Avenir locally, check font loading in CSS

**Issue**: Colors appearing different
- **Solution**: Use exact hex values (#F32735, #232222), verify monitor color profile, test in multiple browsers

**Issue**: Spacing or alignment off by pixels
- **Solution**: Use Figma's measurement tools, check pixel grid snapping, zoom to 100% for accurate checking

**Issue**: Animations stuttering
- **Solution**: Use CSS transforms/opacity, enable GPU acceleration, test on different devices

**Issue**: Modal not appearing
- **Solution**: Check z-index value (50), verify overlay display, test mouse/touch interactions

---

## Contact & Questions

For questions about:
- **Design specifications**: See DESIGN_SPECS.md
- **Figma process**: See FIGMA_DESIGN_INSTRUCTIONS.md  
- **Home page changes**: See HOME_PAGE_CORRECTIONS.md
- **Implementation**: See code comments in components

---

**Document Version**: 1.0  
**Last Updated**: 2026-05-20  
**Status**: Ready for Implementation  
**Next Review**: After Phase 1 (Figma design completion)

