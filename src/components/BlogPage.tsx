'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ArrowRight } from 'lucide-react';
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
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    readTime: '5 min',
  },
  {
    id: 2,
    title: 'El Poblado: Guía completa para invertir en el barrio más dinámico de Medellín',
    excerpt: 'Descubre por qué El Poblado es el barrio preferido de inversionistas y expatriados. Analiza rentabilidades, precios y oportunidades actuales.',
    date: 'Mayo 12, 2026',
    category: 'Mercado',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    readTime: '7 min',
  },
  {
    id: 3,
    title: 'Cómo calcular la rentabilidad real de tu inversión inmobiliaria',
    excerpt: 'Detrás de un buen porcentaje hay cálculos precisos. Te enseñamos a evaluar correctamente si tu propiedad genera los retornos esperados.',
    date: 'Mayo 8, 2026',
    category: 'Inversión',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    readTime: '6 min',
  },
  {
    id: 4,
    title: 'Documentos y trámites necesarios para arrendar tu propiedad legalmente',
    excerpt: 'Conoce los requisitos legales, contratos y documentos indispensables para proteger tu propiedad y asegurar un arrendamiento seguro.',
    date: 'Abril 30, 2026',
    category: 'Arrendamiento',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    readTime: '4 min',
  },
  {
    id: 5,
    title: 'Nuevas oportunidades de inversión: Proyectos de vivienda en Antioquia',
    excerpt: 'Explora los proyectos inmobiliarios más promisores del momento y descubre dónde colocar tu capital para máxima rentabilidad.',
    date: 'Abril 22, 2026',
    category: 'Inversión',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    readTime: '8 min',
  },
  {
    id: 6,
    title: 'Tendencias en arrendamiento turístico: La nueva forma de rentabilizar tu propiedad',
    excerpt: 'Descubre cómo muchos propietarios en Medellín están multiplicando sus ingresos con arrendamiento turístico de corta duración.',
    date: 'Abril 15, 2026',
    category: 'Arrendamiento',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
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
    const items = el.querySelectorAll('.blog-article-item');
    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
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
              <div className="absolute inset-0 flex gap-[2px]">
                {[
                  { src: '/images/1966_Donde_todo_comenz%C3%B3.jpeg', pos: '60% 20%' },
                  { src: '/images/1974_primeros_cimientos.jpeg', pos: '85% 20%' },
                  { src: '/images/2006_Reconocimiento_consolidaci%C3%B3n.png', pos: '55% 20%' },
                  { src: '/images/2017_M%C3%A1s_cerca_de_nuestros%20clientes.png', pos: '70% 20%' },
                  { src: '/images/2018_Evoluci%C3%B3n_de_marca.png', pos: '40% 20%' },
                  { src: '/images/2026_60_a%C3%B1os.png', pos: '15% 20%' },
                ].map((item, j) => (
                  <div key={j} className="flex-1 overflow-hidden">
                    <img
                      src={item.src}
                      alt=""
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      style={{ objectPosition: item.pos }}
                    />
                  </div>
                ))}
              </div>
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
                  <Calendar className="w-4 h-4" />
                  Junio 17, 2026
                </div>
                <span>5 min de lectura</span>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 text-brand-red font-semibold text-sm group/btn">
                Leer más
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <span>{post.readTime} de lectura</span>
                </div>

                <button className="mt-4 inline-flex items-center gap-2 text-brand-red font-semibold text-sm group/btn">
                  Leer más
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <button className="px-8 py-3 bg-brand-red hover:bg-brand-red-hover text-white font-semibold rounded-full transition-colors">
            Ver más artículos
          </button>
        </div>
      </div>
    </div>
  );
}