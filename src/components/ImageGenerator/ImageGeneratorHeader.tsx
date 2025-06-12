import React from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, RefreshCw } from 'lucide-react';

interface ImageGeneratorHeaderProps {
  isGenerating: boolean;
  hasImages: boolean;
  onGenerateImages: () => void;
  onRegenerateAll: () => void;
}

const ImageGeneratorHeader: React.FC<ImageGeneratorHeaderProps> = ({
  isGenerating,
  hasImages,
  onGenerateImages,
  onRegenerateAll
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-feijo-red">
          Gerador de Imagens
        </h2>
        <p className="text-feijo-red">
          Gere imagens reais usando IA (Pollinations.ai + FLUX) para seu carrossel
        </p>
      </div>
      
      {!hasImages ? (
        <Button 
          onClick={onGenerateImages}
          disabled={isGenerating}
          className="bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-feijo-gray/30 border-t-feijo-gray rounded-full animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" />
              Gerar Imagens
            </>
          )}
        </Button>
      ) : (
        <Button 
          onClick={onRegenerateAll}
          variant="outline"
          className="bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerar Todas
        </Button>
      )}
    </div>
  );
};

export default ImageGeneratorHeader;
