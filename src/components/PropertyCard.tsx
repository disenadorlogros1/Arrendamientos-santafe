'use client';

import { useState, useCallback } from 'react';
import type { Property } from '@/data/properties';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setAnimating(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setAnimating(false);
  }, []);

  const handleClick = useCallback(() => {
    setIsClicked(true);
    setAnimating(true);
    setTimeout(() => setIsClicked(false), 600);
  }, []);

  // Circle fill percentage: 0 → 100%
  const circleFill = isHovered || isClicked ? 100 : 0;
  // Arrow draw progress: 0 → 1
  const arrowProgress = isHovered || isClicked ? 1 : 0;

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden border border-gray-100"
      style={{
        boxShadow: isHovered
          ? '0 8px 25px -5px rgba(0,0,0,0.1), 0 4px 10px -6px rgba(0,0,0,0.05)'
          : '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          style={{
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          loading="lazy"
        />

        {/* Animated Arrow Button */}
        <div
          className="absolute top-3 right-3"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: isHovered || isClicked
                ? 'drop-shadow(0 2px 6px rgba(207,10,44,0.4))'
                : 'none',
              transition: 'filter 0.3s ease',
            }}
          >
            {/* Background circle (empty stroke) */}
            <circle
              cx="20"
              cy="20"
              r="17"
              stroke="#CF0A2C"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            {/* Animated fill circle - fills from 0 to 100% via dasharray */}
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="#CF0A2C"
              style={{
                clipPath: `inset(0 ${100 - circleFill}% 0 0)`,
                transition: animating
                  ? 'clip-path 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  : 'clip-path 0.3s ease 0.1s',
                transformOrigin: 'center',
              }}
            />
            {/* Circle border stroke animation */}
            <circle
              cx="20"
              cy="20"
              r="17"
              stroke="#CF0A2C"
              strokeWidth="2"
              fill="none"
              strokeDasharray={animating ? `${2 * Math.PI * 17}` : '0'}
              strokeDashoffset="0"
              strokeLinecap="round"
              style={{
                transition: animating
                  ? 'stroke-dasharray 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  : 'stroke-dasharray 0.3s ease 0.15s',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
              }}
            />
            {/* Arrow - builds from zero using stroke-dasharray */}
            <path
              d="M15 20L20 15M20 15L25 20M20 15V26"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: arrowProgress ? '28' : '0 28',
                transition: animating
                  ? 'stroke-dasharray 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s'
                  : 'stroke-dasharray 0.3s ease',
              }}
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px' }}>
        {/* Price - Largest, boldest */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 85 Heavy', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: '20px',
            lineHeight: '1.3',
            color: '#232222',
            margin: '0 0 4px 0',
          }}
        >
          {property.price}
        </p>

        {/* Location - Medium */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 55 Roman', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '1.4',
            color: '#232222',
            margin: '0 0 4px 0',
          }}
        >
          {property.location}
        </p>

        {/* Size + Type - Small, gray */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '13px',
            lineHeight: '1.4',
            color: '#808080',
            margin: '0 0 2px 0',
          }}
        >
          {property.size} · {property.type}
        </p>

        {/* Reference - Smallest, lighter */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#b0b0b0',
            margin: '2px 0 0 0',
          }}
        >
          {property.reference}
        </p>
      </div>
    </div>
  );
}
