
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Key, Eye, EyeOff, Trash2 } from 'lucide-react';

interface ApiKeySectionProps {
  apiKey: string;
  hasApiKey: boolean;
  showApiKey: boolean;
  onApiKeyChange: (value: string) => void;
  onToggleShowApiKey: () => void;
  onClearApiKey: () => void;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  apiKey,
  hasApiKey,
  showApiKey,
  onApiKeyChange,
  onToggleShowApiKey,
  onClearApiKey
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="geminiApiKey" className="text-base font-semibold text-gray-900 flex items-center gap-2">
        <Key className="h-4 w-4 text-feijo-red" />
        Chave da API Gemini *
        {hasApiKey && (
          <span className="text-sm text-green-600 font-normal">(Salva)</span>
        )}
      </Label>
      <div className="relative">
        <Input
          id="geminiApiKey"
          type={showApiKey ? "text" : "password"}
          placeholder={hasApiKey ? "Chave salva - deixe em branco para usar a salva" : "Digite sua chave da API do Gemini 2.5 Flash"}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          required={!hasApiKey}
          className="h-12 text-base bg-white border-gray-300 focus:border-feijo-red focus:ring-feijo-red pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleShowApiKey}
            className="h-8 w-8 p-0 hover:bg-feijo-red/10"
          >
            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          {hasApiKey && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearApiKey}
              className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
              title="Limpar chave salva"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {hasApiKey && (
        <p className="text-sm text-feijo-gray">
          Sua chave está salva no navegador. Deixe o campo em branco para usar a chave salva ou digite uma nova para substitui-la.
        </p>
      )}
    </div>
  );
};

export default ApiKeySection;
