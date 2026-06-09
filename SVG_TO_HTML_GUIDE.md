# 🎨 SVG to HTML/React Converter

Un script Node.js que convierte archivos SVG (desde Illustrator, Figma, etc.) a HTML y React components automáticamente.

---

## 📋 Cómo Usar

### Paso 1: Exportar SVG desde Illustrator

1. Abre tu diseño en **Adobe Illustrator**
2. Selecciona el elemento/artboard que quieres convertir
3. **Archivo > Exportar As > Formato: SVG**
4. Guarda el archivo (ej: `mi-diseño.svg`)

---

### Paso 2: Convertir SVG a HTML

Abre **PowerShell** o **Terminal** y ejecuta:

```powershell
cd "C:\Users\Diseño\Documents\ProyectosWeb\Arrendamientos-santafe"
node scripts/svg-to-html.js "C:\ruta\a\tu\archivo.svg"
```

**Ejemplos:**

```powershell
# Desde Desktop
node scripts/svg-to-html.js "C:\Users\Diseño\Desktop\logo.svg"

# Desde Downloads
node scripts/svg-to-html.js "C:\Users\Diseño\Downloads\banner.svg"

# Ruta relativa
node scripts/svg-to-html.js ./assets/mi-icono.svg
```

---

## 📤 Qué Genera el Script

El script genera **2 archivos** en la misma carpeta que tu SVG:

### 1️⃣ **Archivo HTML** (ej: `logo.html`)
```html
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
    <svg><!-- Tu diseño aquí --></svg>
  </body>
</html>
```

Abre este archivo en el navegador para **ver el SVG renderizado**.

---

### 2️⃣ **React Component** (ej: `logo.tsx`)
```typescript
export const Logo = () => (
  <svg viewBox="...">
    {/* Tu diseño SVG aquí */}
  </svg>
);
```

Puedes **copiar este código directamente** a tu proyecto React.

---

## 💻 Salida en Consola

Cuando ejecutes el script, verás algo así:

```
📖 Leyendo archivo SVG: C:\Users\Diseño\Desktop\banner.svg
🔄 Convirtiendo SVG a estructura...
✨ Generando HTML...
⚛️  Generando React component...

================================================================================
📋 HTML DIRECTO (puedes copiar y pegar):
================================================================================
<!DOCTYPE html>
<html lang="es">
...
[Tu HTML aquí]
...

================================================================================
⚛️  REACT COMPONENT:
================================================================================
'use client';

import React from 'react';

export const Banner = React.forwardRef<SVGSVGElement, BannerProps>(
...
[Tu React component aquí]
...

================================================================================
✅ Archivos generados:
   📄 HTML: C:\Users\Diseño\Desktop\banner.html
   ⚛️  React: C:\Users\Diseño\Desktop\banner.tsx
================================================================================
```

---

## 🚀 Casos de Uso

### 1. Convertir un icono de Illustrator
```powershell
node scripts/svg-to-html.js "C:\Users\Diseño\Desktop\icono-home.svg"
```
→ Obtienes `icono-home.html` y `icono-home.tsx`

### 2. Convertir un banner completo
```powershell
node scripts/svg-to-html.js "C:\Users\Diseño\Desktop\banner-hero.svg"
```
→ Obtienes un React component listo para usar

### 3. Convertir múltiples SVGs
```powershell
# Archivo 1
node scripts/svg-to-html.js "C:\Users\Diseño\Desktop\logo.svg"

# Archivo 2
node scripts/svg-to-html.js "C:\Users\Diseño\Desktop\icono.svg"

# Archivo 3
node scripts/svg-to-html.js "C:\Users\Diseño\Desktop\ilustración.svg"
```

---

## 📦 React Component Features

Los componentes generados incluyen:

✅ **Soporte TypeScript**
```typescript
interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}
```

✅ **Uso flexible**
```typescript
// Tamaño por defecto
<Logo />

// Tamaño personalizado
<Logo width={200} height={200} />

// Con estilos Tailwind
<Logo className="text-blue-500 hover:text-blue-600" />

// Con ref
<Logo ref={svgRef} />
```

✅ **Directive 'use client'**
Listo para usar en Next.js App Router

---

## 🎯 Flujo Completo

```
Illustrator
    ↓
  .svg file
    ↓
node scripts/svg-to-html.js
    ↓
    ├─ .html (para ver en navegador)
    └─ .tsx (para copiar a React)
    ↓
Pega en tu componente React ✅
```

---

## ⚙️ Requisitos

- ✅ Node.js instalado (ya lo tienes)
- ✅ Paquetes instalados: `svgson`, `svg2html`, `svgo`
- ✅ Archivo SVG exportado desde Illustrator

---

## 🔧 Solución de Problemas

### ❌ "node: command not found"
```powershell
# Usa la ruta completa
C:\Program Files\nodejs\node.exe scripts/svg-to-html.js "ruta\archivo.svg"
```

### ❌ "Archivo no encontrado"
```powershell
# Asegúrate de que la ruta es correcta
node scripts/svg-to-html.js "C:\Users\Diseño\Desktop\archivo.svg"
# (no: C:\Users\Diseño\Deskto\archivo.svg) ← typo
```

### ❌ "Error: Cannot find module 'svgson'"
```powershell
# Reinstala los paquetes
cd "C:\Users\Diseño\Documents\ProyectosWeb\Arrendamientos-santafe"
npm install svgson svg2html svgo --save-dev
```

---

## 💡 Tips

1. **Optimiza SVGs antes** (en Illustrator):
   - Agrupa elementos relacionados
   - Usa nombres descriptivos para capas
   - Remove unnecessary clipping paths

2. **Exporta con buena calidad**:
   - Responsive: ✅ 
   - Embed Raster Images: ✅
   - Preserve Illustrator Editing Capabilities: ❌

3. **Edita el componente React después**:
   - Ajusta colores dinámicamente
   - Agrega animaciones con Framer Motion
   - Intégralo con tus estilos Tailwind

---

## 📞 ¿Problemas?

Si algo no funciona, pásame el archivo SVG y:
1. Ejecuta: `node scripts/svg-to-html.js "tu-archivo.svg"`
2. Copia la salida de la consola
3. Pégala aquí para que te ayude

¡El script está listo para usar! 🚀
