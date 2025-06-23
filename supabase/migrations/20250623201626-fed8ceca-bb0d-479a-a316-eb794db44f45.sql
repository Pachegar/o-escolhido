
-- Criar tabela para configurações de automação
CREATE TABLE public.automation_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'whatsapp')),
  config_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, type)
);

-- Habilitar RLS
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias configurações
CREATE POLICY "Users can view their own automation settings" 
  ON public.automation_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários criarem suas próprias configurações
CREATE POLICY "Users can create their own automation settings" 
  ON public.automation_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias configurações
CREATE POLICY "Users can update their own automation settings" 
  ON public.automation_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para usuários deletarem suas próprias configurações
CREATE POLICY "Users can delete their own automation settings" 
  ON public.automation_settings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_automation_settings_updated_at
  BEFORE UPDATE ON public.automation_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
