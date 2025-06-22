
-- Primeiro, vamos adicionar RLS para a tabela delivery_models
ALTER TABLE public.delivery_models ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam seus próprios modelos e os modelos do sistema
CREATE POLICY "Users can view their own models and system defaults" 
  ON public.delivery_models 
  FOR SELECT 
  USING (auth.uid() = user_id OR is_system_default = true);

-- Política para permitir que usuários criem seus próprios modelos
CREATE POLICY "Users can create their own models" 
  ON public.delivery_models 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND is_system_default = false);

-- Política para permitir que usuários atualizem seus próprios modelos (não os do sistema)
CREATE POLICY "Users can update their own models" 
  ON public.delivery_models 
  FOR UPDATE 
  USING (auth.uid() = user_id AND is_system_default = false);

-- Política para permitir que usuários deletem seus próprios modelos (não os do sistema)
CREATE POLICY "Users can delete their own models" 
  ON public.delivery_models 
  FOR DELETE 
  USING (auth.uid() = user_id AND is_system_default = false);

-- Remover a foreign key constraint problemática se existir
ALTER TABLE public.delivery_models DROP CONSTRAINT IF EXISTS delivery_models_user_id_fkey;

-- Tornar user_id nullable para permitir modelos do sistema
ALTER TABLE public.delivery_models ALTER COLUMN user_id DROP NOT NULL;
