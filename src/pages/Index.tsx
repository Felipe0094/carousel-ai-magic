import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProjectTypeSelector from '@/components/ProjectTypeSelector';
import UnifiedPromptForm from '@/components/UnifiedPromptForm';
import BrokerSettings from '@/components/BrokerSettings';
import PromptTemplateManager from '@/components/PromptTemplateManager';
import HomeView from '@/components/HomeView';
import AppFooter from '@/components/AppFooter';
import { usePromptGeneration } from '@/hooks/usePromptGeneration';
import { useNavigate } from 'react-router-dom';

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

type ViewMode = 'home' | 'project-type' | 'form' | 'broker-settings' | 'template-manager';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedProjectType, setSelectedProjectType] = useState<'carousel' | 'single' | null>(null);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  
  const { prompts, isLoading, generatePrompts } = usePromptGeneration();
  const navigate = useNavigate();

  const handleProjectTypeSelect = (type: 'carousel' | 'single') => {
    setSelectedProjectType(type);
    setCurrentView('form');
  };

  const handleFormSubmit = async (data: UnifiedPromptFormData) => {
    const result = await generatePrompts(data);
    if (result) {
      setShowImageGenerator(false);
      setCurrentView('home');
    }
  };

  const handleGenerateImages = (generatedPrompts: GeneratedPrompt[]) => {
    setShowImageGenerator(true);
    
    setTimeout(() => {
      const imageGenElement = document.getElementById('image-generator');
      if (imageGenElement) {
        imageGenElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'project-type':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              <Button
                variant="outline"
                className="mb-4 bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white h-8 px-3 text-sm"
                onClick={() => setCurrentView('home')}
              >
                ← Voltar ao Início
              </Button>
              <h2 className="text-2xl font-bold text-gray-900">Escolha o Tipo de Projeto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <ProjectTypeSelector onSelectType={handleProjectTypeSelect} />
              </div>
            </div>
          </div>
        );
      
      case 'form':
        return (
          <UnifiedPromptForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            projectType={selectedProjectType!}
            onBack={() => setCurrentView('project-type')}
          />
        );
      
      case 'broker-settings':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              <Button
                variant="outline"
                className="mb-4 bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white h-8 px-3 text-sm"
                onClick={() => setCurrentView('home')}
              >
                ← Voltar ao Início
              </Button>
            </div>
            <BrokerSettings />
          </div>
        );
      
      case 'template-manager':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              <Button
                variant="outline"
                className="mb-4 bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white h-8 px-3 text-sm"
                onClick={() => setCurrentView('home')}
              >
                ← Voltar ao Início
              </Button>
            </div>
            <PromptTemplateManager />
          </div>
        );
      
      default:
        return (
          <HomeView
            prompts={prompts}
            showImageGenerator={showImageGenerator}
            onCreateProject={() => setCurrentView('project-type')}
            onBrokerSettings={() => setCurrentView('broker-settings')}
            onTemplateManager={() => setCurrentView('template-manager')}
            onGenerateImages={handleGenerateImages}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        {renderCurrentView()}
        <AppFooter />
      </div>
    </div>
  );
};

export default Index;
