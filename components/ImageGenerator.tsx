import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { DownloadIcon, ImageIcon } from './icons';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
        return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const generatedImageUrl = await generateImage(prompt);
      setImageUrl(generatedImageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400">Image Generation</h2>
        <p className="text-gray-400 mt-1">Describe the image you want GreenBot to create.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cute robot watering a plant on Mars"
          className="flex-grow w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-600 transition-colors duration-200"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      <div className="flex-grow flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg bg-gray-900/50 p-4">
        {isLoading && (
          <div className="flex flex-col items-center text-green-400">
            <svg className="animate-spin h-10 w-10 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-medium">Creating your masterpiece...</p>
          </div>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {imageUrl && !isLoading && (
          <div className="relative group">
            <img src={imageUrl} alt={prompt} className="max-h-[50vh] max-w-full rounded-lg shadow-md" />
            <a
              href={imageUrl}
              download={`greenbot-generated-${Date.now()}.png`}
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition-opacity duration-300"
            >
              <DownloadIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300"/>
            </a>
          </div>
        )}
        {!isLoading && !imageUrl && !error && (
            <div className="text-center text-green-400">
                <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-50"/>
                <p>Your generated image will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};
