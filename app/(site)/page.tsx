import { Suspense } from 'react';

import { BuildLogPreview, BuildLogPreviewSkeleton } from '@/components/home/BuildLogPreview';
import { ContactCTA } from '@/components/home/ContactCTA';
import { FeaturedProducts, FeaturedProductsSkeleton } from '@/components/home/FeaturedProducts';
import { HeroSection } from '@/components/home/HeroSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<BuildLogPreviewSkeleton />}>
        <BuildLogPreview />
      </Suspense>
      <ContactCTA />
    </>
  );
}
