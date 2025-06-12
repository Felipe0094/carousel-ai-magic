import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Building2, Save, Palette } from 'lucide-react';
import { useBrokerSettings } from '@/hooks/useBrokerSettings';
import { toast } from '@/components/ui/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const BrokerSettings: React.FC = () => {
  const { settings, isLoading, updateSettings, createSettings } = useBrokerSettings();
  const [formData, setFormData] = useState({
    name: settings?.name || 'Feijó Seguros',
    description: settings?.description || 'Sua proteção é nossa prioridade',
    logo_url: settings?.logo_url || '/lovable-uploads/7d913761-ee53-435e-9d2c-4ca1ecccdf23.png',
    brand_colors: settings?.brand_colors || { primary: '#E30613', secondary: '#808080', accent: '#B8191F' }
  });

  React.useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name,
        description: settings.description || '',
        logo_url: settings.logo_url || '',
        brand_colors: settings.brand_colors || { primary: '#E30613', secondary: '#808080', accent: '#B8191F' }
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (settings?.id) {
        await updateSettings(formData);
      } else {
        await createSettings(formData);
      }
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso!",
        variant: "default",
        className: "bg-white border-feijo-gray text-feijo-gray"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        variant: "destructive",
        className: "bg-white border-feijo-red text-feijo-red"
      });
    }
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      brand_colors: {
        ...prev.brand_colors,
        [colorKey]: value
      }
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white border border-gray-200 shadow-lg">
      <CardHeader className="text-center pb-6 bg-gradient-to-r from-feijo-gray/10 to-feijo-gray/20">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img 
            src="/lovable-uploads/7d913761-ee53-435e-9d2c-4ca1ecccdf23.png" 
            alt="Feijó Seguros" 
            className="h-12 w-auto"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-feijo-red">
          Configurações da Feijó Seguros
        </CardTitle>
        <p className="text-feijo-gray">
          Configure os dados da corretora para personalizar as imagens geradas
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-base font-semibold text-gray-900">
              Nome da Corretora *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Feijó Seguros"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="h-12 text-base bg-white border-gray-300 focus:border-feijo-gray focus:ring-feijo-gray text-feijo-gray"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-semibold text-gray-900">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Especializada em seguros diversos, proteção residencial, veicular e empresarial..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="text-base bg-white border-gray-300 focus:border-feijo-gray focus:ring-feijo-gray text-feijo-gray"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="logo_url" className="text-base font-semibold text-gray-900">
              URL do Logo
            </Label>
            <div className="flex gap-3">
              <Input
                id="logo_url"
                placeholder="https://exemplo.com/logo.png"
                value={formData.logo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                className="h-12 text-base bg-white border-gray-300 focus:border-feijo-gray focus:ring-feijo-gray text-feijo-gray"
              />
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="bg-white border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white h-8 px-3 text-sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>
            {formData.logo_url && (
              <div className="mt-2">
                <img 
                  src={formData.logo_url} 
                  alt="Preview do logo" 
                  className="h-16 w-auto border rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="primary_color" className="text-sm font-medium text-gray-700">
                Vermelho Feijó (Primária)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300 bg-white"
                  style={{ backgroundColor: formData.brand_colors.primary || '#000000' }}
                />
                <span className="text-sm text-gray-600">{formData.brand_colors.primary || 'Nenhuma cor selecionada'}</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white h-8 px-3 text-sm"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Escolher Cor
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <input
                      type="color"
                      value={formData.brand_colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-16 h-10 p-1 border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="secondary_color" className="text-sm font-medium text-gray-700">
                Cinza Feijó (Secundária)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300 bg-white"
                  style={{ backgroundColor: formData.brand_colors.secondary || '#000000' }}
                />
                <span className="text-sm text-gray-600">{formData.brand_colors.secondary || 'Nenhuma cor selecionada'}</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white h-8 px-3 text-sm"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Escolher Cor
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <input
                      type="color"
                      value={formData.brand_colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-16 h-10 p-1 border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="tertiary_color" className="text-sm font-medium text-gray-700">
                Azul Feijó (Terciária)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300 bg-white"
                  style={{ backgroundColor: formData.brand_colors.tertiary || '#000000' }}
                />
                <span className="text-sm text-gray-600">{formData.brand_colors.tertiary || 'Nenhuma cor selecionada'}</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white h-8 px-3 text-sm"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Escolher Cor
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <input
                      type="color"
                      value={formData.brand_colors.tertiary}
                      onChange={(e) => handleColorChange('tertiary', e.target.value)}
                      className="w-16 h-10 p-1 border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold bg-feijo-red hover:bg-feijo-red-dark text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Save className="h-5 w-5" />
                Salvar Configurações
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BrokerSettings;
