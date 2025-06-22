
import { supabase } from '@/integrations/supabase/client';

// Função para gerar código de rastreamento único
export const generateTrackingCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BR';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Função para gerar link público de rastreamento
export const generatePublicTrackingLink = (trackingCode: string, userSubdomain?: string): string => {
  const baseUrl = userSubdomain ? `https://${userSubdomain}.rastreietrack.com.br` : 'https://rastreietrack.com.br';
  return `${baseUrl}/r/${trackingCode}`;
};

// Função para buscar rastreamento público (sem autenticação)
export const getPublicTracking = async (trackingCode: string) => {
  const { data, error } = await supabase
    .from('trackings')
    .select(`
      *,
      tracking_events(*),
      users:user_id(store_name, custom_logo_url, custom_highlight_color)
    `)
    .eq('tracking_code', trackingCode)
    .single();
  
  if (error) throw error;
  return data;
};

// Função para incrementar cliques no rastreamento
export const incrementTrackingClicks = async (trackingId: string) => {
  try {
    // First get the current clicks value
    const { data: currentData, error: fetchError } = await supabase
      .from('trackings')
      .select('clicks')
      .eq('id', trackingId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching current clicks:', fetchError);
      return;
    }
    
    // Then update with incremented value
    const { error: updateError } = await supabase
      .from('trackings')
      .update({ clicks: (currentData.clicks || 0) + 1 })
      .eq('id', trackingId);
    
    if (updateError) {
      console.error('Error incrementing clicks:', updateError);
    }
  } catch (error) {
    console.error('Error incrementing clicks:', error);
  }
};

// Função para validar se usuário pode usar funcionalidade baseada no plano
export const canUseFeature = (userPlan: any, feature: string): boolean => {
  if (!userPlan) return false;
  
  const featureMap: { [key: string]: string } = {
    'customLogo': 'can_customize_logo',
    'customTone': 'can_customize_tone',
    'editMessages': 'can_edit_messages',
    'subdomain': 'can_use_subdomain',
    'customDomain': 'can_use_custom_domain',
    'orderBump': 'can_use_order_bump',
    'emailAutomation': 'can_send_email_automation',
    'whatsappAutomation': 'can_send_whatsapp_automation',
  };
  
  const planFeature = featureMap[feature];
  return planFeature ? userPlan[planFeature] : false;
};

// Função para calcular uso de rastreamentos no mês atual
export const getCurrentMonthUsage = async (userId: string) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('trackings')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());
  
  if (error) throw error;
  return data?.length || 0;
};

// Função para verificar se usuário pode criar mais rastreamentos
export const canCreateMoreTrackings = async (userId: string): Promise<{ canCreate: boolean; usage: number; limit: number }> => {
  // Buscar dados do usuário e plano
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select(`
      referral_credits,
      plans:current_plan_id(tracking_limit)
    `)
    .eq('id', userId)
    .single();
  
  if (userError) throw userError;
  
  const usage = await getCurrentMonthUsage(userId);
  const planLimit = userData?.plans?.tracking_limit;
  const referralCredits = userData?.referral_credits || 0;
  
  // Se plano é ilimitado
  if (planLimit === null) {
    return { canCreate: true, usage, limit: -1 };
  }
  
  const totalLimit = planLimit + referralCredits;
  
  return {
    canCreate: usage < totalLimit,
    usage,
    limit: totalLimit
  };
};
