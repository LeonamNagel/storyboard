
import React from 'react';
import { Scene } from '../types';

interface SceneCardProps {
  scene: Scene;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col">
      <div className="relative aspect-video bg-gray-700">
        {scene.imageUrl ? (
          <img
            src={scene.imageUrl}
            alt={`Visual para a Cena ${scene.id}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-dashed border-gray-400 rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white py-1 px-3 rounded-full text-sm font-bold">
          Cena {scene.id}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div>
          <h3 className="text-lg font-semibold text-purple-300 mb-2">Visual</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{scene.visual_description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-teal-300 mb-2">Ação / Diálogo</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{scene.action_dialogue}</p>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;
