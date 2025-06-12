
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt_content: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const usePromptTemplates = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      toast.error('Erro ao carregar templates de prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (template: Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      
      setTemplates(prev => [data, ...prev]);
      toast.success('Template criado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar template:', error);
      toast.error('Erro ao criar template');
      throw error;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<PromptTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Template atualizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      toast.error('Erro ao atualizar template');
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prompt_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Template excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast.error('Erro ao excluir template');
      throw error;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  };
};
