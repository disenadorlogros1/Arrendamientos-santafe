'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';

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
    title: 'Guía completa para arrendar tu propiedad en Medellín',
    excerpt: 'Descubre los pasos esenciales para arrendar tu inmueble de forma segura y rentable. Desde la preparación de la propiedad hasta la selección de inquilinos.',
    date: 'Mayo 15, 2026',
    category: 'Arrendamiento',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    readTime: '5 min',
  },
  {
    id: 2,
    title: '¿Cuándo es el momento perfecto para invertir en inmuebles?',
    excerpt: 'Analiza el mercado inmobiliario actual y descubre cuáles son las condiciones ideales para realizar una inversión inmobiliaria exitosa en Antioquia.',
    date: 'Mayo 10, 2026',
    category: 'Inversión',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    readTime: '7 min',
  },
  {
    id: 3,
    title: 'Tendencias del mercado inmobiliario 2026',
    excerpt: 'Explora las principales tendencias y cambios que está experimentando el sector inmobiliario en Medellín y el área metropolitana este año.',
    date: 'Mayo 5, 2026',
    category: 'Mercado',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    readTime: '6 min',
  },
  {
    id: 4,
    title: 'Cómo preparar tu casa para vender rápidamente',
    excerpt: 'Consejos prácticos para mejorar el atractivo de tu propiedad y aumentar las probabilidades de una venta rápida y a buen precio.',
    date: 'Abril 28, 2026',
    category: 'Venta',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    readTime: '4 min',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-brand-dark py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Blog
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Artículos, consejos y tendencias del mercado inmobiliario en Antioquia
            </p>
          </motion.div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {['Todos', 'Arrendamiento', 'Venta', 'Inversión', 'Mercado'].map((cat) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Image */}
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

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-red transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <span>{post.readTime} de lectura</span>
                </div>

                {/* Read More */}
                <button className="mt-4 inline-flex items-center gap-2 text-brand-red font-semibold text-sm group/btn">
                  Leer más
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
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
