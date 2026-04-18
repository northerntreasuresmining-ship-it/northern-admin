import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    // Update Title
    const fullTitle = `${title} | Northern Treasures Mining`;
    document.title = fullTitle;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || 'Premium gemstones and rare minerals from Northern Treasures Mining. Ethically sourced and masterfully cut.');

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords || 'gemstones, mining, minerals, emeralds, sapphires, northern treasures');

  }, [title, description, keywords]);

  return null;
};

export default SEO;
