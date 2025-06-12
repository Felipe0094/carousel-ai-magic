import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Settings } from 'lucide-react';

interface MainNavigationProps {
  onCreateProject: () => void;
  onBrokerSettings: () => void;
  onTemplateManager: () => void;
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  onCreateProject,
  onBrokerSettings,
  onTemplateManager
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button
        onClick={onCreateProject}
        className="bg-feijo-red hover:bg-feijo-red-dark text-white h-12 px-8 text-lg font-semibold"
      >
        Criar Novo Projeto
      </Button>
      
      <Button
        onClick={onBrokerSettings}
        className="bg-feijo-red hover:bg-feijo-red-dark text-white h-12 px-8 text-lg font-semibold flex items-center gap-2"
      >
        <Building2 className="h-4 w-4" />
        Configurar Feijó Seguros
      </Button>
      
      <Button
        onClick={onTemplateManager}
        className="bg-feijo-red hover:bg-feijo-red-dark text-white h-12 px-8 text-lg font-semibold flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Gerenciar Templates
      </Button>
    </div>
  );
};

export default MainNavigation;
