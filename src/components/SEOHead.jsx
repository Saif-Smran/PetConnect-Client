import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  image,
  type = 'website',
  author = 'PetConnect',
  twitterCard = 'summary_large_image'
}) => {
  const siteName = 'PetConnect';
  const siteUrl = window.location.origin;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'PetConnect - Find your perfect companion. Adopt pets, support donation campaigns, and connect with pet lovers in your community.';
  const defaultImage = `${siteUrl}/Logo.png`;
  const defaultKeywords = 'pet adoption, animal rescue, pet care, donation campaigns, pet community, adopt pets, animal welfare';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical || window.location.href} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 days" />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/Favincon.png" />
      <link rel="apple-touch-icon" href="/Logo.png" />

      {/* Theme Color */}
      <meta name="theme-color" content="#2CA58D" />
      <meta name="msapplication-TileColor" content="#2CA58D" />
    </Helmet>
  );
};

export default SEOHead;
