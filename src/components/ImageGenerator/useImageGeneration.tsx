
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

export const useImageGeneration = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async (prompt: GeneratedPrompt): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        prompt: prompt.prompt
      }
    });

    if (error) {
      console.error('Error calling generate-image function:', error);
      throw new Error(error.message || 'Erro ao gerar imagem');
    }

    if (!data.image) {
      throw new Error('Resposta inválida da API de geração de imagem');
    }

    return data.image;
  };

  const handleGenerateImages = async (prompts: GeneratedPrompt[]) => {
    setIsGenerating(true);
    
    const initialImages: GeneratedImage[] = prompts.map(prompt => ({
      id: prompt.id,
      prompt,
      imageUrl: '',
      isLoading: true
    }));
    
    setImages(initialImages);

    for (let i = 0; i < prompts.length; i++) {
      try {
        toast.info(`Gerando imagem ${i + 1} de ${prompts.length}...`);
        const imageUrl = await generateImage(prompts[i]);
        
        setImages(prev => prev.map(img => 
          img.id === prompts[i].id 
            ? { ...img, imageUrl, isLoading: false }
            : img
        ));
        
        toast.success(`Imagem ${i + 1} gerada com sucesso!`);
      } catch (error) {
        console.error('Error generating image:', error);
        
        toast.error(`Erro ao gerar imagem ${i + 1}: ${error.message}`);
        
        setImages(prev => prev.map(img => 
          img.id === prompts[i].id 
            ? { ...img, isLoading: false, error: 'Erro ao gerar imagem' }
            : img
        ));
      }
      
      if (i < prompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsGenerating(false);
    toast.success('Processamento de imagens concluído!');
  };

  const handleRetryImage = async (prompt: GeneratedPrompt) => {
    setImages(prev => prev.map(img => 
      img.id === prompt.id 
        ? { ...img, isLoading: true, error: undefined }
        : img
    ));

    try {
      toast.info(`Regenerando imagem...`);
      const imageUrl = await generateImage(prompt);
      
      setImages(prev => prev.map(img => 
        img.id === prompt.id 
          ? { ...img, imageUrl, isLoading: false }
          : img
      ));
      
      toast.success('Imagem regenerada com sucesso!');
    } catch (error) {
      toast.error('Erro ao regenerar imagem');
      
      setImages(prev => prev.map(img => 
        img.id === prompt.id 
          ? { ...img, isLoading: false, error: 'Erro ao gerar imagem' }
          : img
      ));
    }
  };

  const handleDownloadImage = async (image: GeneratedImage) => {
    try {
      if (image.imageUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = image.imageUrl;
        a.download = `carrossel-slide-${image.prompt.indice}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const response = await fetch(image.imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `carrossel-slide-${image.prompt.indice}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      toast.success('Imagem baixada!');
    } catch (error) {
      toast.error('Erro ao baixar imagem');
    }
  };

  return {
    images,
    isGenerating,
    handleGenerateImages,
    handleRetryImage,
    handleDownloadImage
  };
};
