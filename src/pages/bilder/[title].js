import React, { useCallback } from 'react';
import { groq } from 'next-sanity';
import Image from 'next/image';
import Gallery from 'react-photo-gallery';

import Footer from '../../components/Footer';
import Navigation from '../../components/Navigation';
import Page from '../../components/Page';
import { HeroContent, HeroImage } from '../../components/PageComponents';
import { PageTitle } from '../../components/PageTitle';
import RenderInBrowser from '../../components/RenderInBrowser';
import WaveDivider from '../../components/WaveDivider';
import { getImageSizes, sanityClient } from '../../lib/sanity';

const AlbumPage = ({ data }) => {
  const imageRenderer = useCallback(({ photo, key }) => {
    return (
      <Image
        className="gallery-image"
        key={key}
        src={photo.src}
        height={photo.height}
        width={photo.width}
      />
    );
  }, []);

  const images = data.album.images.map(getImageSizes);
  const albumTitle = data.album.title;

  const coverImage = getImageSizes(data.album.coverImage).source.fullscreen;

  return (
    <Page title={`Album: ${albumTitle}`}>
      <Navigation />
      <HeroImage src={coverImage}>
        <HeroContent>
          <PageTitle>{albumTitle}</PageTitle>
        </HeroContent>
        <WaveDivider color="white" />
      </HeroImage>
      <div className="mw8 center min-vh-100">
        <RenderInBrowser>
          <Gallery
            renderImage={imageRenderer}
            photos={images.map(img => ({
              src: img.source.thumbnail,
              height: 1,
              width: img.aspectRatio,
            }))}
          />
        </RenderInBrowser>
      </div>
      <Footer />
    </Page>
  );
};

const albumQuery = groq`
    *[_type == "album" && title == $slug][0]{
      title,
      coverImage{asset->{...}},
      "images": images[]{asset->{...}}
      }
    `;

export async function getStaticProps({ params, preview = false }) {
  try {
    const album = await sanityClient.fetch(albumQuery, {
      slug: params.title,
    });
    if (!album || !album?.images?.length) {
      throw new Error(
        'Unable to build album page: Sanity fetch succeeded, but no images were found. Please check Sanity',
      );
    }

    return {
      props: {
        preview,
        data: { album },
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getStaticPaths() {
  try {
    const albums = await sanityClient.fetch(
      groq`*[_type == "album" && title != "Historie"].title`,
    );
    if (!albums || !albums?.length) {
      throw new Error(
        'Unable to generate any static paths: Sanity fetch succeeded, but no albums were found. Please check Sanity',
      );
    }
    return {
      paths: albums.map(title => ({ params: { title } })),
      fallback: false,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default AlbumPage;
