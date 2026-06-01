import { BuildLogPreview } from '@/components/home/BuildLogPreview';
import { ContactCTA } from '@/components/home/ContactCTA';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HeroSection } from '@/components/home/HeroSection';
import { caseStudies, getFeaturedProducts, videoLogs } from '@/lib/data/products';

const featuredProducts = getFeaturedProducts();
const featuredCaseStudy = caseStudies.find((study) => study.featured);
const featuredVideo = videoLogs.find((video) => video.is_active);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <BuildLogPreview caseStudy={featuredCaseStudy} video={featuredVideo} />
      <ContactCTA />
    </>
  );
}
