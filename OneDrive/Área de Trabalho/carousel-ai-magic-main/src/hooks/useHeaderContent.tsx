import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HeaderContent {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useHeaderContent = () => {
  const [headerContent, setHeaderContent] = useState<HeaderContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHeaderContent = async () => {
    try {
      const { data, error } = await supabase
        .from('header_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setHeaderContent(data);
    } catch (error) {
      console.error('Erro ao buscar cabeçalho:', error);
      toast.error('Erro ao carregar o cabeçalho');
    } finally {
      setIsLoading(false);
    }
  };

  const updateHeaderContent = async (content: string) => {
    try {
      setIsLoading(true);
      
      if (headerContent) {
        // Atualizar cabeçalho existente
        const { error } = await supabase
          .from('header_content')
          .update({ content })
          .eq('id', headerContent.id);

        if (error) throw error;
      } else {
        // Criar novo cabeçalho
        const { error } = await supabase
          .from('header_content')
          .insert([{ content }]);

        if (error) throw error;
      }

      await fetchHeaderContent();
      toast.success('Cabeçalho salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar cabeçalho:', error);
      toast.error('Erro ao salvar o cabeçalho');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeaderContent();
  }, []);

  return {
    headerContent,
    isLoading,
    updateHeaderContent
  };
}; 