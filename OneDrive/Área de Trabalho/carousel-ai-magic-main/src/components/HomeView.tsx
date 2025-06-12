
import React from 'react';
import AppHeader from './AppHeader';
import MainNavigation from './MainNavigation';
import PromptResults from './PromptResults';
import ImageGenerator from './ImageGenerator';

interface GeneratedPrompt {
  id: string;
  titulo: string;
  prompt: string;
  descricao: string;
  indice: number;
}

interface HomeViewProps {
  prompts: GeneratedPrompt[];
  showImageGenerator: boolean;
  onCreateProject: () => void;
  onBrokerSettings: () => void;
  onTemplateManager: () => void;
  onGenerateImages: (prompts: GeneratedPrompt[]) => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  prompts,
  showImageGenerator,
  onCreateProject,
  onBrokerSettings,
  onTemplateManager,
  onGenerateImages
}) => {
  return (
    <div className="space-y-16">
      <AppHeader />
      
      <MainNavigation
        onCreateProject={onCreateProject}
        onBrokerSettings={onBrokerSettings}
        onTemplateManager={onTemplateManager}
      />

      {prompts.length > 0 && (
        <section id="results" className="space-y-8">
          <PromptResults 
            prompts={prompts} 
            onGenerateImages={onGenerateImages}
          />
        </section>
      )}
      
      {showImageGenerator && prompts.length > 0 && (
        <section id="image-generator" className="space-y-8">
          <ImageGenerator prompts={prompts} />
        </section>
      )}
    </div>
  );
};

export default HomeView;
