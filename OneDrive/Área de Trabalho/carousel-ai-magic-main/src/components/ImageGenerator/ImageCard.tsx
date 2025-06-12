import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';

interface GeneratedPrompt {
  id: string;
  titulo: string;
  prompt: string;
  descricao: string;
  indice: number;
}

interface GeneratedImage {
  id: string;
  prompt: GeneratedPrompt;
  imageUrl: string;
  isLoading: boolean;
  error?: string;
}

interface ImageCardProps {
  image: GeneratedImage;
  onRetry: (prompt: GeneratedPrompt) => void;
  onDownload: (image: GeneratedImage) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onRetry, onDownload }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-feijo-gray/10 border-feijo-gray animate-fade-in overflow-hidden">
      <div className="aspect-square relative bg-feijo-gray/5">
        {image.isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-feijo-gray/30 border-t-feijo-gray rounded-full animate-spin mx-auto" />
              <p className="text-sm text-feijo-gray">Gerando imagem...</p>
            </div>
          </div>
        ) : image.error ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-feijo-gray mx-auto" />
              <p className="text-sm text-feijo-gray">{image.error}</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onRetry(image.prompt)}
                className="bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : (
          <img 
            src={image.imageUrl} 
            alt={image.prompt.titulo}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-feijo-gray/10 text-feijo-gray border-feijo-gray">
            Slide {image.prompt.indice}
          </Badge>
          {image.imageUrl && !image.error && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload(image)}
              className="bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white"
            >
              <Download className="h-3 w-3" />
            </Button>
          )}
        </div>
        <CardTitle className="text-lg font-semibold leading-tight text-feijo-gray">
          {image.prompt.titulo}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-feijo-gray leading-relaxed">
          {image.prompt.descricao}
        </p>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
