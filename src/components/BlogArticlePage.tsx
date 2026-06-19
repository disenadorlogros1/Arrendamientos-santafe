'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Calendar } from 'lucide-react';
import { allArticles } from '@/data/blogArticles';
import ScrollReveal from '@/components/ScrollReveal';
import type { PageType } from '@/components/Header';

interface Props {
  articleId: number;
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEAVY   = "'Avenir LT Pro 85 Heavy', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';
const DARK = '#1a1a1a';
const BG   = '#fafaf9';

export default function BlogArticlePage({ articleId, onNavigate }: Props) {
  const article = allArticles.find(a => a.id === articleId);
  const badgeRef  = useRef<HTMLDivElement>(null);
  const titleRef  = useRef<HTMLHeadingElement>(null);
  const metaRef   = useRef<HTMLDivElement>(null);
  const introRef  = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!article) return;
    const targets = [badgeRef.current, titleRef.current, metaRef.current, introRef.current];
    targets.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: i < 3 ? 10 : 16 },
        { opacity: 1, y: 0, duration: 0.4 + i * 0.05, delay: i * 0.07, ease: 'power2.out' }
      );
    });
  }, [article]);

  if (!article) return null;

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 'clamp(300px, 45vw, 460px)', overflow: 'hidden', marginTop: '-86px' }}>
        <img
          src={article.image}
          alt={article.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.78) 100%)',
        }} />

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 'clamp(20px, 4vw, 44px) clamp(20px, 8vw, 96px)',
        }}>
          <button
            type="button"
            onClick={() => onNavigate('blog')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 300,
              color: 'rgba(255,255,255,0.5)', background: 'transparent',
              border: 'none', cursor: 'pointer', padding: 0, marginBottom: '20px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver al blog
          </button>

          <div ref={badgeRef} style={{ marginBottom: '12px', opacity: 0 }}>
            <span style={{
              display: 'inline-block', padding: '4px 12px',
              background: RED, color: '#fff',
              fontFamily: FONT_HEAVY, fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              borderRadius: '2px',
            }}>
              {article.category}
            </span>
          </div>

          <h1
            ref={titleRef}
            style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(22px, 3.2vw, 46px)', fontWeight: 300, color: '#fff', lineHeight: 1.2, margin: '0 0 16px 0', maxWidth: '800px', opacity: 0 }}
          >
            {article.title}
          </h1>

          <div
            ref={metaRef}
            style={{ display: 'flex', gap: '16px', alignItems: 'center', opacity: 0 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: FONT_BODY, fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              <Calendar size={12} />
              {article.date}
            </span>
            <span style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontFamily: FONT_BODY, fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              {article.readTime} de lectura
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(20px, 5vw, 40px)' }}>

        <p
          ref={introRef}
          style={{ fontFamily: FONT_BODY, fontSize: 'clamp(16px, 1.3vw, 19px)', lineHeight: 1.75, color: DARK, marginBottom: '36px', fontWeight: 300, opacity: 0 }}
        >
          {article.intro}
        </p>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', marginBottom: '36px' }} />

        {article.blocks.map((block, i) => {
          if (block.type === 'heading') return (
            <ScrollReveal key={i} y={10} start="top 90%">
              <h2 style={{ fontFamily: FONT_HEAVY, fontSize: 'clamp(17px, 1.6vw, 22px)', color: DARK, margin: '36px 0 14px 0', lineHeight: 1.3 }}>
                {block.text}
              </h2>
            </ScrollReveal>
          );

          if (block.type === 'paragraph') return (
            <ScrollReveal key={i} y={8} start="top 90%">
              <p style={{ fontFamily: FONT_BODY, fontSize: 'clamp(14px, 1.1vw, 16px)', lineHeight: 1.8, color: '#555', marginBottom: '20px', fontWeight: 300 }}>
                {block.text}
              </p>
            </ScrollReveal>
          );

          if (block.type === 'highlight') return (
            <ScrollReveal key={i} y={8} start="top 90%">
              <div style={{ borderLeft: `3px solid ${RED}`, padding: '16px 20px', margin: '28px 0', background: '#f0efed', borderRadius: '0 4px 4px 0' }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 'clamp(14px, 1.1vw, 16px)', color: DARK, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                  {block.text}
                </p>
              </div>
            </ScrollReveal>
          );

          if (block.type === 'list') return (
            <ScrollReveal key={i} y={8} start="top 90%">
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                {block.items?.map((item, j) => (
                  <li key={j} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ color: RED, fontFamily: FONT_HEAVY, fontSize: '14px', lineHeight: 1.8, flexShrink: 0, marginTop: '1px' }}>—</span>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 'clamp(13px, 1.05vw, 15px)', color: '#555', lineHeight: 1.75, fontWeight: 300 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          );

          return null;
        })}
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <ScrollReveal y={20}>
        <div style={{ background: DARK, padding: 'clamp(40px, 5vw, 64px) clamp(20px, 5vw, 80px)', textAlign: 'center' }}>
          <p style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(18px, 2vw, 28px)', fontWeight: 300, color: '#fff', lineHeight: 1.45, margin: '0 auto 24px auto', maxWidth: '560px' }}>
            ¿Tienes una propiedad en Antioquia?{' '}
            <span style={{ fontWeight: 700, color: RED }}>Nosotros la gestionamos.</span>
          </p>
          <button
            type="button"
            onClick={() => onNavigate(article.ctaPage)}
            style={{
              fontFamily: FONT_BODY, fontSize: '14px', fontWeight: 600,
              color: '#fff', background: RED, border: 'none', cursor: 'pointer',
              padding: '13px 32px', borderRadius: '2px', transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
            onMouseLeave={e => (e.currentTarget.style.background = RED)}
          >
            {article.ctaText}
          </button>
        </div>
      </ScrollReveal>

    </div>
  );
}