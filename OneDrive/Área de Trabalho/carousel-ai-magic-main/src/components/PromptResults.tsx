import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Image, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedPrompt {
  id: string;
  titulo: string;
  prompt: string;
  descricao: string;
  indice: number;
}

interface PromptResultsProps {
  prompts: GeneratedPrompt[];
  onGenerateImages?: (prompts: GeneratedPrompt[]) => void;
  header?: string;
}

const PromptResults: React.FC<PromptResultsProps> = ({
  prompts,
  onGenerateImages,
  header
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Prompt copiado!');
      
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      toast.error('Erro ao copiar prompt');
    }
  };

  const copyAllPrompts = () => {
    const promptsText = prompts
      .map((prompt, index) => {
        return `Slide ${index + 1}:\n${prompt.prompt}\n`;
      })
      .join('\n');

    const textToCopy = header ? `${header}\n\n${promptsText}` : promptsText;
    
    navigator.clipboard.writeText(textToCopy);
    toast.success('Todos os prompts foram copiados para a área de transferência.');
  };

  if (prompts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Prompts Gerados
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            {prompts.length} prompts criados para seu carrossel
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={copyAllPrompts}
            variant="outline"
            className="flex items-center gap-2 h-12 px-6 text-base bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white"
          >
            <Copy className="h-5 w-5" />
            Copiar Todos
          </Button>
          
          {onGenerateImages && (
            <Button 
              onClick={() => onGenerateImages(prompts)}
              className="h-12 px-6 text-base flex items-center gap-2 bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white"
            >
              <Image className="h-5 w-5" />
              Gerar Imagens
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <Card 
            key={prompt.id} 
            className="group hover:shadow-lg transition-all duration-300 animate-fade-in bg-gray-50 border border-gray-200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-700 text-sm">
                    Slide {prompt.indice}
                  </Badge>
                  <CardTitle className="text-xl font-bold leading-tight text-gray-900">
                    {prompt.titulo}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Descrição:</h4>
                <p className="text-base text-gray-600 leading-relaxed">
                  {prompt.descricao}
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Prompt:</h4>
                <div className="bg-white rounded-lg p-4 text-sm leading-relaxed max-h-36 overflow-y-auto text-gray-700 border border-gray-200">
                  {prompt.prompt}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                  className="flex-1 text-sm h-10 bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white"
                >
                  {copiedId === prompt.id ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const url = `https://www.bing.com/images/create?q=${encodeURIComponent(prompt.prompt)}`;
                    window.open(url, '_blank');
                  }}
                  className="text-sm h-10 bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromptResults;
