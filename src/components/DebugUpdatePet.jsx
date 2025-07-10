// Debug component to test the UpdatePet fixes
// This file can be deleted after testing

import React from 'react';

const DebugUpdatePet = () => {
  const checkEnvironment = () => {
    console.log('Environment check:');
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('VITE_IMGBB_API_KEY:', import.meta.env.VITE_IMGBB_API_KEY ? 'Present' : 'Missing');
    console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing');
  };

  React.useEffect(() => {
    checkEnvironment();
  }, []);

  return (
    <div className="p-4 bg-blue-100 rounded">
      <h3 className="font-bold mb-2">Debug UpdatePet Environment</h3>
      <button 
        onClick={checkEnvironment}
        className="btn btn-sm btn-primary"
      >
        Check Environment
      </button>
      <div className="mt-2 text-sm">
        <p>Check the console for environment variable status</p>
      </div>
    </div>
  );
};

export default DebugUpdatePet;
