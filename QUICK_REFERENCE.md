# Quick Reference Checklist

## 🎯 Project Goals
- [x] Design property card component
- [x] Create complete design specifications
- [x] Document home page corrections
- [x] Update FeaturedSection subtitle
- [ ] Create Figma design (NEXT PRIORITY)
- [ ] Verify code implementation
- [ ] Deploy updates

---

## 📊 Quick Status

### Completed ✅
- [x] PropertyCard.tsx component (fully implemented)
- [x] FeaturedSection.tsx subtitle updated
- [x] Design specifications documented (DESIGN_SPECS.md)
- [x] Figma instructions created (FIGMA_DESIGN_INSTRUCTIONS.md)
- [x] Home page corrections documented (HOME_PAGE_CORRECTIONS.md)
- [x] Implementation guide created (IMPLEMENTATION_GUIDE.md)

### In Progress ⏳
- [ ] Figma design creation
- [ ] Design verification

### Pending 📋
- [ ] Home page header updates
- [ ] Hero section modifications
- [ ] Service descriptions updates
- [ ] CTA button refinements

---

## 🎨 Figma Design Dimensions

```
Card:      280px × 380px
Image:     280px × 240px
Buttons:   24px × 24px (default) → 44px × 44px (hover)
Icons:     12px × 12px (default) → 20px × 20px (hover)
Padding:   16px (card content)
Gaps:      8px (button spacing, grid columns)
```

---

## 🎯 Key Design Values

### Colors
- Brand Red: `#F32735`
- Dark Gray: `#232222`
- Medium Gray: `#808080`
- Light Gray: `#B0B0B0`
- Border Gray: `#E8E8E8`

### Typography
- Font Family: Avenir (55 Roman, 65 Medium, 85 Heavy)
- Price: 18px, weight 800
- Location: 13px, weight 400
- Type: 12px, weight 300
- Amenities: 11px, weight 500
- Reference: 11px, weight 300

### Spacing
- Card padding: 16px
- Grid gap: 8px
- Button gap: 8px
- Section spacing: 12-24px

---

## 🔧 Component Files

```
/src/components/
├── PropertyCard.tsx          ✅ (Complete, ready)
├── FeaturedSection.tsx       ✅ (Updated subtitle)
├── InfiniteCarousel.tsx      ✓ (No changes needed)
├── Header.tsx                📝 (Needs nav updates)
├── HeroSection.tsx           📝 (Needs text updates)
└── ServicesSection.tsx       📝 (Needs description updates)

/src/data/
└── properties.ts             ✓ (Complete, has all data)
```

---

## 📋 Home Page Corrections Summary

| Section | Status | Details |
|---------|--------|---------|
| Header Navigation | Pending | Add 6 sections: Inicio, Propiedades, Servicios, Nosotros, WhatsApp, Pagar en línea |
| Hero "60 años..." | Pending | Update text hierarchy with visual emphasis |
| Property Inquiry | Pending | Add variable: "¿Tienes un inmueble para [VARIABLE]?" |
| CTA Buttons | Pending | Keep only: "Ver propiedades disponibles" and "Hablar con un asesor" |
| Featured Subtitle | ✅ Done | "Inmuebles disponibles ahora. Consulta, agencia o pide asesoría." |
| Service Descriptions | Pending | Update 4 services with new text (see HOME_PAGE_CORRECTIONS.md) |

---

## 🚀 Next Steps (Priority Order)

### Step 1: Figma Design
- [ ] Open Figma file: https://www.figma.com/design/NdVTQ9rGmlaG981csORkSZ/arjetas---Propiedades-Destacadas
- [ ] Follow FIGMA_DESIGN_INSTRUCTIONS.md (13 steps)
- [ ] Use DESIGN_SPECS.md as reference
- [ ] Complete in 1-2 hours
- [ ] Share final design link

### Step 2: Code Verification
- [ ] Review PropertyCard.tsx vs Figma design
- [ ] Check all measurements match
- [ ] Verify colors and typography
- [ ] Test in browser
- [ ] Complete in 30 minutes

### Step 3: Home Page Updates
- [ ] Update Header.tsx navigation
- [ ] Modify HeroSection.tsx text
- [ ] Add variables for dynamic text
- [ ] Update ServicesSection.tsx descriptions
- [ ] Update CTA buttons
- [ ] Complete in 2-3 hours

### Step 4: Testing & QA
- [ ] Visual testing (all screen sizes)
- [ ] Interactive testing (all features)
- [ ] Responsive testing (mobile/tablet/desktop)
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] Complete in 2-3 hours

### Step 5: Deployment
- [ ] Build verification (`npm run build`)
- [ ] Staging deployment
- [ ] Final QA
- [ ] Production deployment
- [ ] Monitor for issues

---

## 🎨 Figma Step Summary

1. Create main card frame (280×380px)
2. Add image container (280×240px)
3. Position 4 action buttons (top-right)
4. Create content section with padding
5. Add price text (18px, heavy)
6. Add location/type text (13px + 12px)
7. Create 4-column amenities grid
8. Add reference code (11px, light gray)
9. Convert to component
10. Create variants
11. Set up prototyping
12. Add design system styles
13. Final review & testing

**Estimated Time**: 60-90 minutes

---

## 🧪 Testing Checklist

### Visual ✓
- [ ] Card: 280×380px
- [ ] Image: 280×240px
- [ ] Colors match hex values
- [ ] Fonts: Avenir, correct weights
- [ ] Spacing: ±1px tolerance

### Interactive ✓
- [ ] Hover: shadow + image zoom
- [ ] Buttons: scale 24→44px smoothly
- [ ] Modal: opens/closes correctly
- [ ] Links: WhatsApp works
- [ ] Animations: smooth 0.3-0.6s

### Responsive ✓
- [ ] Desktop (≥1280px): full design
- [ ] Tablet (768-1279px): scales properly
- [ ] Mobile (<768px): stacks correctly
- [ ] Touch: buttons 44×44px minimum

### Accessibility ✓
- [ ] Keyboard navigation
- [ ] ARIA labels on buttons
- [ ] Color contrast (4.5:1)
- [ ] Screen reader compatible
- [ ] Focus states visible

---

## 📦 Files Created (Reference)

1. **DESIGN_SPECS.md** - Technical specifications (13 sections)
2. **FIGMA_DESIGN_INSTRUCTIONS.md** - Step-by-step guide (13 steps)
3. **HOME_PAGE_CORRECTIONS.md** - All page updates (8 sections)
4. **IMPLEMENTATION_GUIDE.md** - Overall coordination (7 sections)
5. **QUICK_REFERENCE.md** - This file (quick lookup)

---

## 🔗 Key Links

### Figma
- Design File: https://www.figma.com/design/NdVTQ9rGmlaG981csORkSZ/arjetas---Propiedades-Destacadas
- Instructions: See FIGMA_DESIGN_INSTRUCTIONS.md

### Code
- PropertyCard Component: `/src/components/PropertyCard.tsx`
- Featured Section: `/src/components/FeaturedSection.tsx`
- Properties Data: `/src/data/properties.ts`

### Documentation
- Design Spec: `/DESIGN_SPECS.md`
- Home Corrections: `/HOME_PAGE_CORRECTIONS.md`
- Implementation: `/IMPLEMENTATION_GUIDE.md`

---

## 💡 Pro Tips

1. **For Figma Design**
   - Use grid snapping for precise alignment
   - Create styles for colors and typography
   - Test with sample data from properties.ts
   - Zoom to 100% for pixel-perfect checking

2. **For Code Implementation**
   - PropertyCard.tsx already well-structured
   - Use DESIGN_SPECS.md as reference
   - Test hover states thoroughly
   - Verify WhatsApp message generation

3. **For Testing**
   - Use Chrome DevTools for responsive testing
   - Test on actual mobile devices when possible
   - Check accessibility with axe DevTools
   - Monitor performance with Lighthouse

4. **For Deployment**
   - Always test staging first
   - Keep backup of current production version
   - Monitor error logs after deployment
   - Have rollback plan ready

---

## 🎯 Success Metrics

### Design
- ✓ Figma file created and approved
- ✓ 280×380px card dimensions exact
- ✓ All colors match (#F32735, #232222, etc.)
- ✓ Typography correct (Avenir weights)
- ✓ Spacing precise (16px padding, 8px gaps)
- ✓ Component ready for handoff

### Code
- ✓ PropertyCard matches Figma design
- ✓ All animations smooth (0.3-0.6s)
- ✓ Responsive on all screen sizes
- ✓ Accessibility WCAG AA compliant
- ✓ No console errors/warnings
- ✓ Performance metrics met

### Page
- ✓ Header navigation complete
- ✓ Hero section redesigned
- ✓ Service descriptions updated
- ✓ CTA buttons functional
- ✓ All links working
- ✓ Responsive layout verified

---

## 📅 Timeline

| Phase | Task | Duration | Est. Completion |
|-------|------|----------|-----------------|
| 1 | Figma Design | 1-2h | This week |
| 2 | Code Verification | 30m | This week |
| 3 | Home Page Updates | 2-3h | This week |
| 4 | Testing & QA | 2-3h | Next few days |
| 5 | Deployment | 1-2h | Next week |
| **Total** | **All Phases** | **~8-10 hours** | **Production ready** |

---

## 🚨 Common Mistakes to Avoid

❌ **Don't:**
- Use wrong hex colors (#232222 is exact, not similar)
- Forget padding/spacing (16px card, 8px gaps)
- Miss font weight specifications (300, 400, 800 matter)
- Ignore responsive behavior
- Skip accessibility testing
- Use different icon sizes
- Forget about hover states
- Neglect animation timing (0.3s vs 0.6s)

✅ **Do:**
- Match specification exactly
- Test on multiple devices
- Verify with browser tools
- Document any changes
- Test interactive features
- Get peer review
- Monitor performance
- Keep backup of working version

---

## 📞 Quick Reference (At a Glance)

**Card Size**: 280×380px  
**Image Size**: 280×240px  
**Button Color**: #F32735  
**Text Color**: #232222  
**Font**: Avenir (55/65/85)  
**Padding**: 16px  
**Gap**: 8px  
**Hover Time**: 0.3-0.6s  
**Subtitle**: "Inmuebles disponibles ahora. Consulta, agencia o pide asesoría."

---

## 🎁 Bonus: Figma to Code Checklist

When moving from Figma to Code:
- [ ] Copy exact color hex values
- [ ] Verify font families and weights
- [ ] Check spacing/padding measurements
- [ ] Confirm button sizes (default + hover)
- [ ] Test animations in browser
- [ ] Validate responsive breakpoints
- [ ] Check accessibility attributes
- [ ] Review shadow values
- [ ] Test on real devices
- [ ] Performance profile with Lighthouse

---

**Last Updated**: 2026-05-20  
**Status**: 🟡 In Progress (Awaiting Figma Design)  
**Next Action**: Create Figma design following FIGMA_DESIGN_INSTRUCTIONS.md

