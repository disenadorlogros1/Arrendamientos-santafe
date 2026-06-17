'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { allArticles } from '@/data/blogArticles';
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
  if (!article) return null;

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 'clamp(300px, 45vw, 460px)', overflow: 'hidden' }}>
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

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '12px' }}>
            <span style={{
              display: 'inline-block', padding: '4px 12px',
              background: RED, color: '#fff',
              fontFamily: FONT_HEAVY, fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              borderRadius: '2px',
            }}>
              {article.category}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.07 }}
            style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(22px, 3.2vw, 46px)', fontWeight: 300, color: '#fff', lineHeight: 1.2, margin: '0 0 16px 0', maxWidth: '800px' }}
          >
            {article.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }}
            style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: FONT_BODY, fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              <Calendar size={12} />
              {article.date}
            </span>
            <span style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontFamily: FONT_BODY, fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              {article.readTime} de lectura
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(20px, 5vw, 40px)' }}>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ fontFamily: FONT_BODY, fontSize: 'clamp(16px, 1.3vw, 19px)', lineHeight: 1.75, color: DARK, marginBottom: '36px', fontWeight: 300 }}
        >
          {article.intro}
        </motion.p>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', marginBottom: '36px' }} />

        {/* Blocks */}
        {article.blocks.map((block, i) => {
          if (block.type === 'heading') return (
            <motion.h2
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: 0.04 }}
              style={{ fontFamily: FONT_HEAVY, fontSize: 'clamp(17px, 1.6vw, 22px)', color: DARK, margin: '36px 0 14px 0', lineHeight: 1.3 }}
            >
              {block.text}
            </motion.h2>
          );

          if (block.type === 'paragraph') return (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
              style={{ fontFamily: FONT_BODY, fontSize: 'clamp(14px, 1.1vw, 16px)', lineHeight: 1.8, color: '#555', marginBottom: '20px', fontWeight: 300 }}
            >
              {block.text}
            </motion.p>
          );

          if (block.type === 'highlight') return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45 }}
              style={{ borderLeft: `3px solid ${RED}`, padding: '16px 20px', margin: '28px 0', background: '#f0efed', borderRadius: '0 4px 4px 0' }}
            >
              <p style={{ fontFamily: FONT_BODY, fontSize: 'clamp(14px, 1.1vw, 16px)', color: DARK, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                {block.text}
              </p>
            </motion.div>
          );

          if (block.type === 'list') return (
            <motion.ul
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}
            >
              {block.items?.map((item, j) => (
                <li key={j} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ color: RED, fontFamily: FONT_HEAVY, fontSize: '14px', lineHeight: 1.8, flexShrink: 0, marginTop: '1px' }}>—</span>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 'clamp(13px, 1.05vw, 15px)', color: '#555', lineHeight: 1.75, fontWeight: 300 }}>{item}</span>
                </li>
              ))}
            </motion.ul>
          );

          return null;
        })}
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
        style={{ background: DARK, padding: 'clamp(40px, 5vw, 64px) clamp(20px, 5vw, 80px)', textAlign: 'center' }}
      >
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
      </motion.div>

    </div>
  );
}
