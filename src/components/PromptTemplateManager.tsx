import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Settings, Pencil } from 'lucide-react';
import { usePromptTemplates, PromptTemplate } from '@/hooks/usePromptTemplates';

const PromptTemplateManager: React.FC = () => {
  const { templates, isLoading, createTemplate, updateTemplate, deleteTemplate } = usePromptTemplates();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt_content: '',
    is_default: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      prompt_content: '',
      is_default: false
    });
    setEditingTemplate(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, formData);
      } else {
        await createTemplate(formData);
      }
      
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleEdit = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      prompt_content: template.prompt_content,
      is_default: template.is_default
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      await deleteTemplate(id);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white border border-feijo-gray/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-feijo-gray" />
          <CardTitle className="text-2xl font-bold text-gray-900">
            Gerenciar Templates de Prompt
          </CardTitle>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-feijo-red hover:bg-feijo-red-dark text-white h-12 px-8 text-lg font-semibold flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Template
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-gray-50 border-2 border-feijo-red">
            <DialogHeader>
              <DialogTitle className="text-gray-800">
                {editingTemplate ? 'Editar Template' : 'Criar Novo Template'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-800">Nome do Template *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Fotografia Profissional"
                  required
                  className="text-gray-800"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-gray-800">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descrição do estilo"
                  className="text-gray-800"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="prompt_content" className="text-gray-800">Conteúdo do Prompt *</Label>
                <Textarea
                  id="prompt_content"
                  value={formData.prompt_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, prompt_content: e.target.value }))}
                  placeholder="fotografia profissional, alta qualidade, iluminação natural..."
                  rows={6}
                  required
                  className="text-gray-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_default" className="text-gray-800">Template padrão</Label>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1 h-12 text-lg font-semibold bg-gray-200 border-gray-300 text-gray-800 hover:bg-gray-300"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-feijo-red hover:bg-feijo-red-dark text-white h-12 text-lg font-semibold"
                >
                  {editingTemplate ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-feijo-red border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Carregando templates...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card key={template.id} className="bg-gray-50 border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        {template.is_default && (
                          <Badge variant="secondary" className="bg-feijo-red/10 text-feijo-red text-xs">
                            Padrão
                          </Badge>
                        )}
                      </div>
                      {template.description && (
                        <p className="text-sm text-gray-600">{template.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(template)}
                        className="bg-white border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white h-8 px-2 text-xs"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                        className="bg-white border-feijo-red text-feijo-red hover:bg-feijo-red hover:text-white h-8 px-2 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="bg-white rounded-md p-3 text-sm text-gray-700 max-h-20 overflow-y-auto">
                    {template.prompt_content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptTemplateManager;
