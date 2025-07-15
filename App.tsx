
import React, { useState, useCallback } from 'react';
import { generateStoryboardOutline, generateSceneImage } from './services/geminiService';
import { Scene } from './types';
import SceneCard from './components/SceneCard';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [premise, setPremise] = useState<string>('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!premise.trim()) {
      setError('Por favor, insira uma premissa.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScenes([]);

    try {
      // 1. Generate the 10-scene text outline
      const outline = await generateStoryboardOutline(premise);
      if (outline.length !== 10) {
        throw new Error('A API não retornou 10 cenas. Tente novamente com uma premissa diferente.');
      }
      
      // Temporarily set scenes without images to show progress
      const initialScenes = outline.map((scene, index) => ({...scene, id: index + 1}));
      setScenes(initialScenes);

      // 2. Generate images for each scene in parallel
      const imagePromises = outline.map(scene => 
        generateSceneImage(`estilo de storyboard cinematográfico, ${scene.visual_description}`)
      );
      const imageUrls = await Promise.all(imagePromises);

      // 3. Combine outlines with their generated images
      const finalScenes = outline.map((scene, index) => ({
        ...scene,
        id: index + 1,
        imageUrl: imageUrls[index],
      }));

      setScenes(finalScenes);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao gerar o storyboard. Verifique sua chave de API e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [premise]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Gerador de Storyboard AI
          </h1>
          <p className="mt-2 text-gray-400">
            Transforme sua ideia em um storyboard de 10 cenas com visuais gerados por IA.
          </p>
        </header>

        <main>
          <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-2xl">
            <form onSubmit={handleSubmit}>
              <label htmlFor="premise" className="block text-lg font-medium text-gray-300 mb-2">
                Sua Premissa
              </label>
              <textarea
                id="premise"
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                placeholder="Ex: Um astronauta perdido em um planeta desconhecido encontra uma misteriosa flora que se comunica através da luz."
                className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full flex justify-center items-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isLoading ? 'Gerando...' : 'Gerar Storyboard'}
              </button>
            </form>
          </div>

          {isLoading && <LoadingSpinner />}
          
          {error && (
            <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
              <p><strong>Erro:</strong> {error}</p>
            </div>
          )}

          {!isLoading && scenes.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {scenes.map((scene) => (
                <SceneCard key={scene.id} scene={scene} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
