'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PageType } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '5 consejos para mantener tu propiedad en perfecto estado durante el arrendamiento',
    excerpt: 'Aprende cómo proteger tu inversión inmobiliaria con mantenimiento preventivo y cuidados esenciales que evitarán costosas reparaciones futuras.',
    date: 'Mayo 18, 2026',
    category: 'Arrendamiento',
    image: '/images/Banners/blog_articulo_1.webp',
    readTime: '5 min',
  },
  {
    id: 2,
    title: 'El Poblado: Guía completa para invertir en el barrio más dinámico de Medellín',
    excerpt: 'Descubre por qué El Poblado es el barrio preferido de inversionistas y expatriados. Analiza rentabilidades, precios y oportunidades actuales.',
    date: 'Mayo 12, 2026',
    category: 'Mercado',
    image: '/images/Banners/blog_articulo_2.webp',
    readTime: '7 min',
  },
  {
    id: 3,
    title: 'Cómo calcular la rentabilidad real de tu inversión inmobiliaria',
    excerpt: 'Detrás de un buen porcentaje hay cálculos precisos. Te enseñamos a evaluar correctamente si tu propiedad genera los retornos esperados.',
    date: 'Mayo 8, 2026',
    category: 'Inversión',
    image: '/images/Banners/blog_articulo_3.webp',
    readTime: '6 min',
  },
  {
    id: 4,
    title: 'Documentos y trámites necesarios para arrendar tu propiedad legalmente',
    excerpt: 'Conoce los requisitos legales, contratos y documentos indispensables para proteger tu propiedad y asegurar un arrendamiento seguro.',
    date: 'Abril 30, 2026',
    category: 'Arrendamiento',
    image: '/images/Banners/blog_articulo_4.webp',
    readTime: '4 min',
  },
  {
    id: 5,
    title: 'Nuevas oportunidades de inversión: Proyectos de vivienda en Antioquia',
    excerpt: 'Explora los proyectos inmobiliarios más promisores del momento y descubre dónde colocar tu capital para máxima rentabilidad.',
    date: 'Abril 22, 2026',
    category: 'Inversión',
    image: '/images/Banners/blog_articulo_5.webp',
    readTime: '8 min',
  },
  {
    id: 6,
    title: 'Tendencias en arrendamiento turístico: La nueva forma de rentabilizar tu propiedad',
    excerpt: 'Descubre cómo muchos propietarios en Medellín están multiplicando sus ingresos con arrendamiento turístico de corta duración.',
    date: 'Abril 15, 2026',
    category: 'Arrendamiento',
    image: '/images/Banners/blog_articulo_6.webp',
    readTime: '6 min',
  },
];

export default function BlogPage({
  onNavigate,
  onOpenArticle,
}: {
  onNavigate?: (page: PageType) => void;
  onOpenArticle?: (id: number) => void;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
    }
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.blog-article-item'));
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.07, delay: 0.05, ease: 'power2.out', clearProps: 'all' },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-brand-dark pb-12 md:pb-16" style={{ marginTop: '-86px', paddingTop: 'calc(86px + 48px)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={headerRef}>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Blog
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Artículos, consejos y tendencias del mercado inmobiliario en Antioquia
            </p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {['Todos', 'Historia', 'Arrendamiento', 'Venta', 'Inversión', 'Mercado'].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cat === 'Todos'
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

          {/* ── Ficha 60 años ── */}
          <article
            className="blog-article-item group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
            onClick={() => onNavigate?.('historia-60')}
          >
            <div className="relative h-48 overflow-hidden bg-gray-900">
              <img
                src="/images/Banners/blog_articulo_60_anios.webp"
                alt=""
                className="w-full h-full object-cover object-left lg:object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-3 right-3">
                <span className="inline-block px-3 py-1 bg-brand-red text-white text-xs font-semibold rounded-full">
                  Historia
                </span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-red transition-colors">
                60 años de historia en el corazón de Antioquia
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                De una oficina en Medellín a tres sedes en Antioquia. La historia de cómo construimos confianza durante seis décadas.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <img src="/icons/icon-calendar-gray.svg" className="w-4 h-4" alt="" aria-hidden />
                  Junio 17, 2026
                </div>
                <span>5 min de lectura</span>
              </div>
              <button className="mt-4 text-brand-red font-semibold text-sm">
                Leer más
              </button>
            </div>
          </article>

          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="blog-article-item group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              onClick={() => onOpenArticle?.(post.id)}
            >
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="inline-block px-3 py-1 bg-brand-red text-white text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-red transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <img src="/icons/icon-calendar-gray.svg" className="w-4 h-4" alt="" aria-hidden />
                    {post.date}
                  </div>
                  <span>{post.readTime} de lectura</span>
                </div>

                <button className="mt-4 text-brand-red font-semibold text-sm">
                  Leer más
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <button className="px-8 py-3 bg-brand-red hover:bg-brand-red-hover text-white font-semibold rounded-none transition-colors">
            Ver más artículos
          </button>
        </div>
      </div>
    </div>
  );
}