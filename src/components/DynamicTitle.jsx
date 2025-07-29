import { useEffect } from 'react';

const DynamicTitle = ({ title }) => {
  useEffect(() => {
    const siteName = 'PetConnect';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    document.title = fullTitle;
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = siteName;
    };
  }, [title]);

  return null; // This component doesn't render anything
};

export default DynamicTitle;
