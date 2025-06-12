
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ImageProject {
  id: string;
  title: string;
  description: string | null;
  project_type: 'carousel' | 'single';
  broker_id: string | null;
  theme: string;
  content: string;
  main_prompt: string;
  image_count: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export const useImageProjects = () => {
  const [projects, setProjects] = useState<ImageProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('image_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData: ImageProject[] = (data || []).map(item => ({
        ...item,
        project_type: item.project_type as 'carousel' | 'single'
      }));
      
      setProjects(typedData);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: Omit<ImageProject, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('image_projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;
      
      const newProject: ImageProject = {
        ...data,
        project_type: data.project_type as 'carousel' | 'single'
      };
      
      setProjects(prev => [newProject, ...prev]);
      toast.success('Projeto criado com sucesso!');
      return newProject;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast.error('Erro ao criar projeto');
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<ImageProject>) => {
    try {
      const { data, error } = await supabase
        .from('image_projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedProject: ImageProject = {
        ...data,
        project_type: data.project_type as 'carousel' | 'single'
      };
      
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      toast.success('Projeto atualizado com sucesso!');
      return updatedProject;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast.error('Erro ao atualizar projeto');
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    refetch: fetchProjects
  };
};
