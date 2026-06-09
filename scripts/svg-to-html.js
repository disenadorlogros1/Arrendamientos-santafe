#!/usr/bin/env node

/**
 * SVG to HTML/React Converter
 *
 * Uso:
 * node scripts/svg-to-html.js <ruta-al-archivo.svg>
 *
 * Ejemplo:
 * node scripts/svg-to-html.js ~/Downloads/mi-diseño.svg
 */

const fs = require('fs');
const path = require('path');
const svgson = require('svgson');

async function convertSvgToHtml(filePath) {
  try {
    // Validar que el archivo existe
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: Archivo no encontrado: ${filePath}`);
      process.exit(1);
    }

    // Leer el archivo SVG
    console.log(`📖 Leyendo archivo SVG: ${filePath}`);
    const svgContent = fs.readFileSync(filePath, 'utf-8');

    // Parsear SVG a JSON
    console.log(`🔄 Convirtiendo SVG a estructura...`);
    const svgData = await svgson.parse(svgContent);

    // Crear HTML
    console.log(`✨ Generando HTML...`);
    const htmlOutput = generateHtmlFromSvg(svgData, svgContent);

    // Crear React component
    console.log(`⚛️  Generando React component...`);
    const reactOutput = generateReactFromSvg(svgData, svgContent, path.basename(filePath, '.svg'));

    // Mostrar resultados
    console.log('\n' + '='.repeat(80));
    console.log('📋 HTML DIRECTO (puedes copiar y pegar):');
    console.log('='.repeat(80));
    console.log(htmlOutput);

    console.log('\n' + '='.repeat(80));
    console.log('⚛️  REACT COMPONENT:');
    console.log('='.repeat(80));
    console.log(reactOutput);

    // Guardar archivos
    const outputDir = path.dirname(filePath);
    const baseName = path.basename(filePath, '.svg');

    const htmlPath = path.join(outputDir, `${baseName}.html`);
    const reactPath = path.join(outputDir, `${baseName}.tsx`);

    fs.writeFileSync(htmlPath, htmlOutput);
    fs.writeFileSync(reactPath, reactOutput);

    console.log('\n' + '='.repeat(80));
    console.log('✅ Archivos generados:');
    console.log(`   📄 HTML: ${htmlPath}`);
    console.log(`   ⚛️  React: ${reactPath}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Error durante la conversión:', error.message);
    process.exit(1);
  }
}

/**
 * Genera HTML a partir del SVG
 */
function generateHtmlFromSvg(svgData, originalSvg) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG Convertido</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            max-width: 1200px;
            width: 100%;
        }

        svg {
            width: 100%;
            height: auto;
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        ${originalSvg}
    </div>
</body>
</html>`;
}

/**
 * Genera React component a partir del SVG
 */
function generateReactFromSvg(svgData, originalSvg, componentName) {
  // Convertir nombre a PascalCase
  const pascalName = componentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Preparar SVG limpio (remover xmlns si no es necesario, etc)
  let cleanSvg = originalSvg
    .replace(/xmlns="[^"]*"/g, '')
    .replace(/xmlns:xlink="[^"]*"/g, '')
    .trim();

  // Si hay declaración XML, removerla
  cleanSvg = cleanSvg.replace(/<\?xml[^?]*\?>/g, '').trim();

  return `'use client';

import React from 'react';

interface ${pascalName}Props {
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * ${pascalName} Component
 *
 * Generado automáticamente desde archivo SVG
 * Puedes personalizar tamaño, color y estilos usando props
 */
export const ${pascalName} = React.forwardRef<SVGSVGElement, ${pascalName}Props>(
  ({ className = '', width = '100%', height = 'auto' }, ref) => (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox="${svgData.attributes.viewBox || '0 0 100 100'}"
      className={\`\${className}\`}
      style={{ display: 'block' }}
    >
      {/* Contenido SVG */}
${cleanSvg.split('\n').slice(1).map(line => '      ' + line).join('\n')}
    </svg>
  )
);

${pascalName}.displayName = '${pascalName}';

export default ${pascalName};
`;
}

// Ejecutar el script
const filePath = process.argv[2];

if (!filePath) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║         SVG to HTML/React Converter                          ║
╚══════════════════════════════════════════════════════════════╝

Uso:
  node scripts/svg-to-html.js <ruta-archivo.svg>

Ejemplos:
  node scripts/svg-to-html.js ~/Downloads/logo.svg
  node scripts/svg-to-html.js ./assets/icon.svg
  node scripts/svg-to-html.js C:\\Users\\Diseño\\desktop\\design.svg

El script generará:
  ✅ Salida HTML en consola (copia y pega)
  ✅ Archivo .html con el SVG renderizado
  ✅ Archivo .tsx con React component

  `);
  process.exit(0);
}

convertSvgToHtml(filePath);
