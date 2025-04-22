import { PublicLayout } from "../../components/layouts/Public/PublicLayout";
import HeroBanner from "./heroBanner/HeroBanner";
import FeaturesSection from './featuresSection/Features';
export const Landing = () => {
    return (
        <PublicLayout>
            <HeroBanner />
            <FeaturesSection />
        </PublicLayout>
        
    )
}

export default Landing;