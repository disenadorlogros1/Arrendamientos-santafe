'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import SearchForm from '@/components/SearchForm';
import UserLocation from '@/components/UserLocation';
import FeaturedSection from '@/components/FeaturedSection';

export default function HomePage() {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <>
      <HeroSection />
      <SearchForm mobileExpanded={mobileExpanded} onMobileExpand={setMobileExpanded} />
      <UserLocation mobileExpanded={mobileExpanded} />
      <div className="bg-brand-light py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FeaturedSection />
        </div>
      </div>
    </>
  );
}
