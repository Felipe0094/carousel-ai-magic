
-- Criar tabela para armazenar prompts principais
CREATE TABLE public.prompt_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  prompt_content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura de todos os prompts (públicos)
CREATE POLICY "Allow public read access to prompt templates" 
  ON public.prompt_templates 
  FOR SELECT 
  TO public
  USING (true);

-- Política para permitir inserção (pode ser restrita depois se necessário)
CREATE POLICY "Allow insert prompt templates" 
  ON public.prompt_templates 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Política para permitir atualização
CREATE POLICY "Allow update prompt templates" 
  ON public.prompt_templates 
  FOR UPDATE 
  TO public
  USING (true);

-- Política para permitir exclusão
CREATE POLICY "Allow delete prompt templates" 
  ON public.prompt_templates 
  FOR DELETE 
  TO public
  USING (true);

-- Inserir alguns prompts padrão
INSERT INTO public.prompt_templates (name, description, prompt_content, is_default) VALUES
('Fotografia Profissional', 'Estilo fotográfico clean e profissional', 'fotografia profissional, alta qualidade, iluminação natural, fundo neutro, composição equilibrada, cores naturais', true),
('Minimalista Moderno', 'Design clean e minimalista', 'design minimalista, cores neutras, espaço negativo, tipografia clean, elementos geométricos simples', false),
('Vibrante e Colorido', 'Estilo vibrante com cores fortes', 'cores vibrantes, high contrast, iluminação dramática, composição dinâmica, energia visual', false),
('Estilo Instagram', 'Otimizado para redes sociais', 'estilo instagram, trendy, aesthetic, boa iluminação, composição para mobile, cores saturadas', false);
