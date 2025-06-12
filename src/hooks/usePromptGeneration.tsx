
import { useState } from 'react';
import { toast } from 'sonner';
import { GeminiService } from '@/services/geminiService';
import { useGeminiApiKey } from '@/hooks/useGeminiApiKey';

interface GeneratedPrompt {
  id: string;
  titulo: string;
  prompt: string;
  descricao: string;
  indice: number;
}

interface UnifiedPromptFormData {
  tema: string;
  conteudo: string;
  quantidadeImagens: number;
  promptPrincipal: string;
  geminiApiKey: string;
  projectType: 'carousel' | 'single';
  useBrokerBranding: boolean;
}

export const usePromptGeneration = () => {
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey: savedApiKey } = useGeminiApiKey();

  const generatePrompts = async (data: UnifiedPromptFormData) => {
    // Usar a chave salva se não foi fornecida uma nova
    const apiKeyToUse = data.geminiApiKey.trim() || savedApiKey;
    
    if (!apiKeyToUse.trim()) {
      toast.error('Por favor, insira sua chave da API do Gemini');
      return;
    }

    setIsLoading(true);
    
    try {
      const geminiService = new GeminiService(apiKeyToUse);
      const generatedPrompts = await geminiService.generatePrompts({
        tema: data.tema,
        conteudo: data.conteudo,
        quantidadeImagens: data.quantidadeImagens,
        promptPrincipal: data.promptPrincipal
      });
      
      setPrompts(generatedPrompts);
      toast.success(`${generatedPrompts.length} prompts gerados com sucesso!`);
      
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      return generatedPrompts;
      
    } catch (error) {
      console.error('Erro ao gerar prompts:', error);
      toast.error(error.message || 'Erro ao gerar prompts. Verifique sua chave da API.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prompts,
    isLoading,
    generatePrompts,
    setPrompts
  };
};
