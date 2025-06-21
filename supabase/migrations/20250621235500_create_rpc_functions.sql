
-- Função RPC para incrementar cliques de rastreamento
CREATE OR REPLACE FUNCTION increment_tracking_clicks(tracking_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.trackings 
  SET clicks = clicks + 1 
  WHERE id = tracking_id;
END;
$$;

-- Função RPC para obter estatísticas do usuário
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE (
  total_trackings INTEGER,
  total_clicks INTEGER,
  current_month_trackings INTEGER,
  referral_credits INTEGER,
  plan_limit INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM public.trackings WHERE trackings.user_id = get_user_stats.user_id),
    (SELECT COALESCE(SUM(clicks), 0)::INTEGER FROM public.trackings WHERE trackings.user_id = get_user_stats.user_id),
    (SELECT COUNT(*)::INTEGER FROM public.trackings 
     WHERE trackings.user_id = get_user_stats.user_id 
     AND created_at >= date_trunc('month', now())),
    (SELECT COALESCE(users.referral_credits, 0) FROM public.users WHERE users.id = get_user_stats.user_id),
    (SELECT plans.tracking_limit FROM public.users 
     JOIN public.plans ON users.current_plan_id = plans.id 
     WHERE users.id = get_user_stats.user_id);
END;
$$;

-- Política RLS para permitir acesso público aos rastreamentos via código
CREATE POLICY "Acesso público aos rastreamentos via código" ON public.trackings
  FOR SELECT USING (true);

-- Política RLS para permitir acesso público aos eventos de rastreamento
CREATE POLICY "Acesso público aos eventos de rastreamento" ON public.tracking_events
  FOR SELECT USING (true);

-- Política RLS para permitir leitura pública dos dados básicos do usuário (para página pública)
CREATE POLICY "Acesso público aos dados básicos do usuário" ON public.users
  FOR SELECT USING (true);
