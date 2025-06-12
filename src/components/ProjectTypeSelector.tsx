import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, ImagesIcon } from 'lucide-react';

interface ProjectTypeSelectorProps {
  onSelectType: (type: 'carousel' | 'single') => void;
}

const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({ onSelectType }) => {
  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-feijo-gray/10 border-feijo-gray" onClick={() => onSelectType('carousel')}>
        <div className="flex flex-col items-center gap-4">
          <ImagesIcon className="h-12 w-12 text-feijo-red" />
          <h3 className="text-xl font-semibold text-gray-900">Carrossel</h3>
          <p className="text-sm text-gray-600 text-center">
            Crie um conjunto de imagens para um carrossel do Instagram
          </p>
          <Button className="w-full bg-feijo-red hover:bg-feijo-red/90 text-white">
            Criar Carrossel
          </Button>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-feijo-gray/10 border-feijo-gray" onClick={() => onSelectType('single')}>
        <div className="flex flex-col items-center gap-4">
          <ImageIcon className="h-12 w-12 text-feijo-red" />
          <h3 className="text-xl font-semibold text-gray-900">Imagem Única</h3>
          <p className="text-sm text-gray-600 text-center">
            Crie uma única imagem para post no Instagram
          </p>
          <Button className="w-full bg-feijo-red hover:bg-feijo-red/90 text-white">
            Criar Imagem
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ProjectTypeSelector;
