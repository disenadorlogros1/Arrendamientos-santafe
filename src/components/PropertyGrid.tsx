'use client';

import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import type { Property } from '@/data/properties';

interface PropertyGridProps {
  properties: Property[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PropertyGrid({ properties }: PropertyGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
    >
      {properties.map((property) => (
        <motion.div key={property.id} variants={item}>
          <PropertyCard property={property} />
        </motion.div>
      ))}
    </motion.div>
  );
}
