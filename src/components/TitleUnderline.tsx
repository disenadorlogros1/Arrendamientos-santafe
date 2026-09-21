'use client';

import type { CSSProperties, ReactNode, Ref } from 'react';

interface TitleUnderlineProps {
  children: ReactNode;
  /** true = barra visible (hover en desktop, siempre en mobile según cada título) */
  active?: boolean;
  /** Sin transición (se usa cuando la barra se anima por fuera, ej. GSAP) */
  barRef?: Ref<HTMLSpanElement>;
  style?: CSSProperties;
  transition?: string;
}

const RED = '#f32735';

/**
 * Subrayado rojo de títulos: banda gruesa que va pegada al pie del texto
 * (cruza levemente la base de las letras), igual en todos los títulos del sitio.
 * Todo está en `em`, así escala con el tamaño de letra del título.
 */
export const UNDERLINE_BAR_STYLE: CSSProperties = {
  position: 'absolute',
  left: 0,
  width: '100%',
  bottom: '0.25em',
  height: '0.2em',
  backgroundColor: RED,
  transformOrigin: 'left center',
  zIndex: 1,
  pointerEvents: 'none',
};

export default function TitleUnderline({ children, active = false, barRef, style, transition = 'transform 0.234s ease' }: TitleUnderlineProps) {
  return (
    <span
      data-tu
      style={{
        display: 'inline-block',
        position: 'relative',
        overflow: 'hidden',
        lineHeight: 1.2,
        paddingBottom: '0.1em',
        ...style,
      }}
    >
      <span data-tu style={{ position: 'relative', zIndex: 2, lineHeight: 'inherit', fontWeight: 'inherit' }}>{children}</span>
      <span
        data-tu
        ref={barRef}
        aria-hidden="true"
        style={{ ...UNDERLINE_BAR_STYLE, transform: `scaleX(${active ? 1 : 0})`, transition }}
      />
    </span>
  );
}
