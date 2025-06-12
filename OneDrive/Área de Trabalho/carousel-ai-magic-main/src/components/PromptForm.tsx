import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Wand2, Settings } from 'lucide-react';
import { usePromptTemplates } from '@/hooks/usePromptTemplates';
import PromptTemplateManager from './PromptTemplateManager';

interface PromptFormData {
  tema: string;
  conteudo: string;
  quantidadeImagens: number;
  promptPrincipal: string;
  geminiApiKey: string;
}

interface PromptFormProps {
  onSubmit: (data: PromptFormData) => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isLoading }) => {
  const { templates } = usePromptTemplates();
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [formData, setFormData] = useState<PromptFormData>({
    tema: '',
    conteudo: '',
    quantidadeImagens: 5,
    promptPrincipal: '',
    geminiApiKey: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, quantidadeImagens: value[0] }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setFormData(prev => ({ 
        ...prev, 
        promptPrincipal: selectedTemplate.prompt_content 
      }));
    }
  };

  if (showTemplateManager) {
    return (
      <div className="space-y-6">
        <Button
          onClick={() => setShowTemplateManager(false)}
          variant="outline"
          className="mb-4"
        >
          ← Voltar ao Formulário
        </Button>
        <PromptTemplateManager />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gray-50 border border-gray-200">
      <CardHeader className="text-center pb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-10 w-10 text-blue-600" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900">
          Gerador de Prompts para Instagram
        </CardTitle>
        <p className="text-gray-600 text-lg">
          Crie prompts únicos para carrossel comercial no Instagram
        </p>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="flex justify-end">
          <Button
            onClick={() => setShowTemplateManager(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Gerenciar Templates
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="geminiApiKey" className="text-base font-semibold text-gray-900">
              Chave da API Gemini *
            </Label>
            <Input
              id="geminiApiKey"
              type="password"
              placeholder="Digite sua chave da API do Gemini 2.5 Flash"
              value={formData.geminiApiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, geminiApiKey: e.target.value }))}
              required
              className="h-12 text-base border-gray-300 focus:border-feijo-gray focus:ring-feijo-gray text-feijo-gray"
            />
            <p className="text-sm text-gray-500">
              Sua chave é salva apenas temporariamente e não é armazenada
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="tema" className="text-base font-semibold text-gray-900">
              Tema do Carrossel *
            </Label>
            <Input
              id="tema"
              placeholder="Ex: Produto de beleza, Fitness, Alimentação saudável..."
              value={formData.tema}
              onChange={(e) => setFormData(prev => ({ ...prev, tema: e.target.value }))}
              required
              className="h-12 text-base border-gray-300 focus:border-feijo-gray focus:ring-feijo-gray text-feijo-gray"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="conteudo" className="text-base font-semibold text-gray-900">
              Conteúdo/Descrição *
            </Label>
            <Textarea
              id="conteudo"
              placeholder="Descreva o que você quer comunicar, público-alvo, objetivo do carrossel..."
              value={formData.conteudo}
              onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
              required
              rows={5}
              className="text-base border-gray-300 focus:border-feijo-gray focus:ring-feijo-gray resize-none text-feijo-gray"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-900">
              Quantidade de Imagens: {formData.quantidadeImagens}
            </Label>
            <div className="px-3">
              <Slider
                value={[formData.quantidadeImagens]}
                onValueChange={handleSliderChange}
                max={10}
                min={3}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>3</span>
                <span>10</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900">
              Template de Prompt Principal
            </Label>
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger className="h-12 text-base border-gray-300 focus:border-feijo-gray focus:ring-feijo-gray">
                <SelectValue placeholder="Selecione um template ou digite abaixo" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <span>{template.name}</span>
                      {template.is_default && (
                        <span className="text-xs text-blue-600">(Padrão)</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="promptPrincipal" className="text-base font-semibold text-gray-900">
              Prompt Principal *
            </Label>
            <Textarea
              id="promptPrincipal"
              placeholder="Estilo visual base: fotografia profissional, minimalista, cores vibrantes, iluminação natural..."
              value={formData.promptPrincipal}
              onChange={(e) => setFormData(prev => ({ ...prev, promptPrincipal: e.target.value }))}
              required
              rows={4}
              className="text-base border-gray-300 focus:border-feijo-gray focus:ring-feijo-gray resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando Prompts...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Wand2 className="h-6 w-6" />
                Gerar Prompts
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromptForm;
