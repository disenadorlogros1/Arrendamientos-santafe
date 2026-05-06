'use client';

import type { Property } from '@/data/properties';
import { ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Arrow button */}
        <button
          className="absolute top-3 right-3 w-9 h-9 bg-brand-red rounded-full flex items-center justify-center text-white hover:bg-brand-red-hover transition-colors shadow-lg"
          aria-label="Ver más información"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        {/* Price */}
        <p
          className="text-lg font-bold text-gray-900"
          style={{ fontFamily: "'Avenir LT Pro 85 Heavy', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif", fontWeight: 800 }}
        >
          {property.price}
        </p>

        {/* Location + Type */}
        <p
          className="text-sm"
          style={{
            color: '#808080',
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            lineHeight: '1.45',
          }}
        >
          {property.location} · {property.type}
        </p>

        {/* Details row */}
        <div
          className="flex items-center gap-3 text-xs"
          style={{
            color: '#808080',
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            lineHeight: '1.45',
          }}
        >
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.size}
          </span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {property.bedrooms} Hab.
          </span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {property.bathrooms} Baño{property.bathrooms > 1 ? 's' : ''}
          </span>
        </div>

        {/* Reference */}
        <p
          className="text-xs pt-1"
          style={{
            color: '#b0b0b0',
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            lineHeight: '1.45',
          }}
        >
          {property.reference}
        </p>
      </div>
    </div>
  );
}
