
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12">
      <div className="w-16 h-16 border-4 border-dashed border-indigo-400 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-300 text-lg">Gerando seu storyboard... Isso pode levar um minuto.</p>
    </div>
  );
};

export default LoadingSpinner;
