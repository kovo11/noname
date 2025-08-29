import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="loading-overlay active">
      <div className="spinner"></div>
      <p>Processing your information...</p>
    </div>
  );
};

export default LoadingOverlay;
