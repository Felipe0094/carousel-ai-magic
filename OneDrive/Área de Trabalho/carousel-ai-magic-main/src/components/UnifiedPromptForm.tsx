import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Shield, Wand2, Copy, Share2, Save } from 'lucide-react';
import { usePromptTemplates } from '@/hooks/usePromptTemplates';
import { useGeminiApiKey } from '@/hooks/useGeminiApiKey';
import { useHeaderContent } from '@/hooks/useHeaderContent';
import ApiKeySection from './UnifiedPromptForm/ApiKeySection';
import BrokerBrandingSection from './UnifiedPromptForm/BrokerBrandingSection';
import { useToast } from '@/components/ui/use-toast';
import PromptResults from '@/components/PromptResults';

interface UnifiedPromptFormData {
  tema: string;
  conteudo: string;
  quantidadeImagens: number;
  promptPrincipal: string;
  geminiApiKey: string;
  projectType: 'carousel' | 'single';
  useBrokerBranding: boolean;
  header?: string;
}

interface UnifiedPromptFormProps {
  onSubmit: (data: UnifiedPromptFormData) => void;
  isLoading: boolean;
  projectType: 'carousel' | 'single';
  onBack: () => void;
  onGenerateImages?: (prompts: any[]) => void;
}

const UnifiedPromptForm: React.FC<UnifiedPromptFormProps> = ({ 
  onSubmit, 
  isLoading, 
  projectType,
  onBack,
  onGenerateImages
}) => {
  const { templates } = usePromptTemplates();
  const { apiKey: savedApiKey, saveApiKey, clearApiKey, hasApiKey } = useGeminiApiKey();
  const { toast } = useToast();
  const { headerContent, updateHeaderContent } = useHeaderContent();
  
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [formData, setFormData] = useState<UnifiedPromptFormData>({
    geminiApiKey: '',
    tema: '',
    conteudo: '',
    quantidadeImagens: projectType === 'single' ? 1 : 3,
    promptPrincipal: '',
    useBrokerBranding: true,
    header: '',
    projectType
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<any[]>([]);

  useEffect(() => {
    if (savedApiKey) {
      setFormData(prev => ({ ...prev, geminiApiKey: savedApiKey }));
    }
  }, [savedApiKey]);

  useEffect(() => {
    const defaultHeader = `Instruções para geração de ${formData.quantidadeImagens} imagens separadas (formato 1080x1350px)\nA seguir, estão especificadas ${formData.quantidadeImagens} cenas diferentes, cada uma representando um slide individual de um carrossel informativo sobre ${formData.tema || 'seguros'}. Para cada bloco identificado como ${Array.from({ length: formData.quantidadeImagens }, (_, i) => `SLIDE ${i + 1}`).join(', ')}, gere uma imagem única e distinta, seguindo cuidadosamente os estilos, elementos visuais, fontes e descrições fornecidas em cada seção. Todas as imagens devem ser entregues separadamente.`;

    if (headerContent) {
      const updatedHeader = headerContent.content
        .replace(
          /Instruções para geração de \d+ imagens separadas/,
          `Instruções para geração de ${formData.quantidadeImagens} imagens separadas`
        )
        .replace(
          /estão especificadas \d+ cenas diferentes/,
          `estão especificadas ${formData.quantidadeImagens} cenas diferentes`
        )
        .replace(
          /Para cada bloco identificado como (?:SLIDE \d+(?:, SLIDE \d+)*,?)+/,
          `Para cada bloco identificado como ${Array.from({ length: formData.quantidadeImagens }, (_, i) => `SLIDE ${i + 1}`).join(', ')}`
        );
      setFormData(prev => ({ ...prev, header: updatedHeader }));
    } else {
      setFormData(prev => ({ ...prev, header: defaultHeader }));
    }
  }, [formData.quantidadeImagens, formData.tema, headerContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      if (formData.geminiApiKey.trim() && formData.geminiApiKey !== savedApiKey) {
        saveApiKey(formData.geminiApiKey);
      }
      
      onSubmit(formData);
    } catch (error) {
      console.error('Erro ao gerar prompts:', error);
      toast({
        title: "Erro ao gerar prompts",
        description: "Ocorreu um erro ao tentar gerar os prompts. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
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

  const getProjectTitle = () => {
    return projectType === 'single' ? 'Imagem Única de Seguro' : 'Carrossel de Seguros';
  };

  const getProjectDescription = () => {
    return projectType === 'single' 
      ? 'Crie um prompt único para uma imagem impactante de seguro'
      : 'Crie prompts únicos para carrossel de seguros no Instagram';
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setFormData(prev => ({ ...prev, geminiApiKey: '' }));
  };

  const handleSaveHeader = async () => {
    if (formData.header) {
      try {
        await updateHeaderContent(formData.header);
        toast({
          title: "Cabeçalho salvo",
          description: "O cabeçalho foi salvo com sucesso!",
        });
      } catch (error) {
        console.error('Erro ao salvar cabeçalho:', error);
        toast({
          title: "Erro ao salvar cabeçalho",
          description: "Ocorreu um erro ao tentar salvar o cabeçalho. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-4 bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar à Seleção
        </Button>
      </div>

      <Card className="w-full max-w-3xl mx-auto bg-white border-2 border-feijo-red shadow-lg">
        <CardHeader className="text-center pb-8 bg-gradient-to-r from-feijo-gray/30 to-feijo-gray/10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/7d913761-ee53-435e-9d2c-4ca1ecccdf23.png" 
              alt="Feijó Seguros" 
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-feijo-red">
            {getProjectTitle()} - Feijó Seguros
          </CardTitle>
          <p className="text-feijo-gray text-lg">
            {getProjectDescription()}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <ApiKeySection
              apiKey={formData.geminiApiKey}
              hasApiKey={hasApiKey}
              showApiKey={showApiKey}
              onApiKeyChange={(value) => setFormData(prev => ({ ...prev, geminiApiKey: value }))}
              onToggleShowApiKey={() => setShowApiKey(!showApiKey)}
              onClearApiKey={handleClearApiKey}
            />

            <div className="space-y-3">
              <Label htmlFor="tema" className="text-base font-semibold text-gray-900">
                Tipo de Seguro {projectType === 'single' ? 'da Imagem' : 'do Carrossel'} *
              </Label>
              <Input
                id="tema"
                placeholder="Ex: Seguro Auto, Residencial, Vida, Empresarial, Saúde..."
                value={formData.tema}
                onChange={(e) => setFormData(prev => ({ ...prev, tema: e.target.value }))}
                required
                className="h-12 text-base bg-white border-gray-300 focus:border-feijo-red focus:ring-feijo-red"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="conteudo" className="text-base font-semibold text-gray-900">
                Descrição do Seguro/Conteúdo *
              </Label>
              <Textarea
                id="conteudo"
                placeholder="Descreva as coberturas, benefícios, público-alvo, diferenciais da Feijó Seguros..."
                value={formData.conteudo}
                onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
                required
                rows={5}
                className="text-base bg-white border-gray-300 focus:border-feijo-red focus:ring-feijo-red resize-none"
              />
            </div>

            {projectType === 'carousel' && (
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
                  <div className="flex justify-between text-sm text-feijo-gray mt-2">
                    <span>3</span>
                    <span>10</span>
                  </div>
                </div>
              </div>
            )}

            <BrokerBrandingSection
              useBrokerBranding={formData.useBrokerBranding}
              onBrokerBrandingChange={(value) => setFormData(prev => ({ ...prev, useBrokerBranding: value }))}
            />

            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-900">
                Template de Prompt Principal
              </Label>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger className="h-12 text-base bg-white border-gray-300 focus:border-feijo-red focus:ring-feijo-red">
                  <SelectValue placeholder="Selecione um template ou digite abaixo" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.name}</span>
                        {template.is_default && (
                          <span className="text-xs text-feijo-red">(Padrão)</span>
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
                placeholder="Estilo visual: fotografia profissional de seguros, cores da marca Feijó (vermelho e cinza), design moderno e confiável..."
                value={formData.promptPrincipal}
                onChange={(e) => setFormData(prev => ({ ...prev, promptPrincipal: e.target.value }))}
                required
                rows={4}
                className="text-base bg-white border-gray-300 focus:border-feijo-red focus:ring-feijo-red resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="header" className="text-base font-semibold text-gray-900">
                Cabeçalho
              </Label>
              <div className="relative">
                <Textarea
                  id="header"
                  placeholder="Digite o texto do cabeçalho que será copiado junto com os prompts..."
                  value={formData.header || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, header: e.target.value }))}
                  rows={4}
                  className="text-base bg-white border-gray-300 focus:border-feijo-red focus:ring-feijo-red resize-none pr-12"
                />
                <Button
                  type="button"
                  onClick={handleSaveHeader}
                  className="absolute right-2 top-2 h-8 w-8 p-0 bg-feijo-red hover:bg-feijo-red-dark text-white"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Este texto será copiado junto com os prompts quando você clicar em "Copiar Todos"
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isGenerating}
              className="w-full h-14 text-lg font-semibold bg-feijo-red hover:bg-feijo-red-dark text-white"
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gerando Prompts para Seguros...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Wand2 className="h-6 w-6" />
                  Gerar {projectType === 'single' ? 'Prompt' : 'Prompts'} para Seguros
                </div>
              )}
            </Button>
          </form>

          {prompts.length > 0 && (
            <PromptResults 
              prompts={prompts} 
              onGenerateImages={onGenerateImages}
              header={formData.header}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedPromptForm;
