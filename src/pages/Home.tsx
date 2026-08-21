import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeatureSection } from '../components/home/FeatureSection';
import { HowItWorks } from '../components/home/HowItWorks';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeatureSection />
      <HowItWorks />
    </div>
  );
};

export default Home;
