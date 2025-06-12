
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BrokerSettings {
  id: string;
  name: string;
  logo_url: string | null;
  brand_colors: Record<string, string>;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useBrokerSettings = () => {
  const [settings, setSettings] = useState<BrokerSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('broker_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const brokerData: BrokerSettings = {
          ...data,
          brand_colors: (data.brand_colors as Record<string, string>) || {}
        };
        setSettings(brokerData);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast.error('Erro ao carregar configurações da corretora');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<BrokerSettings>) => {
    if (!settings?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('broker_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;

      const updatedData: BrokerSettings = {
        ...data,
        brand_colors: (data.brand_colors as Record<string, string>) || {}
      };
      
      setSettings(updatedData);
      toast.success('Configurações atualizadas com sucesso!');
      return updatedData;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações');
      throw error;
    }
  };

  const createSettings = async (newSettings: Omit<BrokerSettings, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('broker_settings')
        .insert([newSettings])
        .select()
        .single();

      if (error) throw error;
      
      const createdData: BrokerSettings = {
        ...data,
        brand_colors: (data.brand_colors as Record<string, string>) || {}
      };
      
      setSettings(createdData);
      toast.success('Configurações criadas com sucesso!');
      return createdData;
    } catch (error) {
      console.error('Erro ao criar configurações:', error);
      toast.error('Erro ao criar configurações');
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    createSettings,
    refetch: fetchSettings
  };
};
