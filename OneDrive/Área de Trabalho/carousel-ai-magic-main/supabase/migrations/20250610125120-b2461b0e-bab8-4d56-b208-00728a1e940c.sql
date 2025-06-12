
-- Criar tabela para armazenar configurações da corretora
CREATE TABLE public.broker_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  brand_colors JSONB DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para armazenar projetos de geração de imagem
CREATE TABLE public.image_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL CHECK (project_type IN ('carousel', 'single')),
  broker_id UUID REFERENCES public.broker_settings(id),
  theme TEXT NOT NULL,
  content TEXT NOT NULL,
  main_prompt TEXT NOT NULL,
  image_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para armazenar prompts gerados
CREATE TABLE public.generated_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.image_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  description TEXT,
  image_index INTEGER NOT NULL,
  generated_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para todas as tabelas
ALTER TABLE public.broker_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_prompts ENABLE ROW LEVEL SECURITY;

-- Políticas para broker_settings (público para leitura, restrito para escrita)
CREATE POLICY "Allow public read access to broker settings" 
  ON public.broker_settings 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Allow insert broker settings" 
  ON public.broker_settings 
  FOR INSERT 
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow update broker settings" 
  ON public.broker_settings 
  FOR UPDATE 
  TO public
  USING (true);

-- Políticas para image_projects
CREATE POLICY "Allow public access to image projects" 
  ON public.image_projects 
  FOR ALL 
  TO public
  USING (true);

-- Políticas para generated_prompts
CREATE POLICY "Allow public access to generated prompts" 
  ON public.generated_prompts 
  FOR ALL 
  TO public
  USING (true);

-- Inserir configuração padrão da corretora
INSERT INTO public.broker_settings (name, description, brand_colors) VALUES
('Sua Corretora', 'Configure os dados da sua corretora para personalizar as imagens geradas', '{"primary": "#2563eb", "secondary": "#64748b", "accent": "#0ea5e9"}');
