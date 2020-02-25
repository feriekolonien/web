import React from 'react';
import Page from '../../components/Page';
import {
  HeroImage,
  HeroContent,
  PageTitle,
} from '../../components/PageComponents';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Images from '../../components/Images';

const ImagesPage = () => {
  console.log('ImagesPage says hi');
  return (
    <Page title="Bilder">
      <HeroImage>
        <Navigation />
        <HeroContent>
          <PageTitle>Bilder fra 2019</PageTitle>
        </HeroContent>
      </HeroImage>
      <HeroContent>
        <Images></Images>
      </HeroContent>
      <Footer />
    </Page>
  );
};

export default ImagesPage;