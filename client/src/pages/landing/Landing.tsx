import { PublicLayout } from '../../components/layouts/Public/PublicLayout';
import FeaturesSection from './featuresSection/Features';
import HeroBanner from './heroBanner/HeroBanner';

export const Landing = () => {
  return (
    <PublicLayout>
      <HeroBanner />
      <FeaturesSection />
    </PublicLayout>
  );
};

export default Landing;
