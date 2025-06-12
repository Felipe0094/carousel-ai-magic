
import React from 'react';
import ImageGeneratorHeader from './ImageGenerator/ImageGeneratorHeader';
import ImageCard from './ImageGenerator/ImageCard';
import { useImageGeneration } from './ImageGenerator/useImageGeneration';

interface GeneratedPrompt {
  id: string;
  titulo: string;
  prompt: string;
  descricao: string;
  indice: number;
}

interface ImageGeneratorProps {
  prompts: GeneratedPrompt[];
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ prompts }) => {
  const {
    images,
    isGenerating,
    handleGenerateImages,
    handleRetryImage,
    handleDownloadImage
  } = useImageGeneration();

  if (prompts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <ImageGeneratorHeader
        isGenerating={isGenerating}
        hasImages={images.length > 0}
        onGenerateImages={() => handleGenerateImages(prompts)}
        onRegenerateAll={() => handleGenerateImages(prompts)}
      />

      {images.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onRetry={handleRetryImage}
              onDownload={handleDownloadImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
