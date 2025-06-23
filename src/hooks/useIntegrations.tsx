
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Integration {
  id: string;
  user_id: string;
  platform_type: 'checkout' | 'gateway' | 'store';
  platform_name: string;
  config_data: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntegrationConfig {
  platform_name: string;
  config_data: Record<string, any>;
}

// Hook para buscar integrações do usuário
export const useIntegrations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['integrations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};

// Hook para criar integração
export const useCreateIntegration = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (integrationData: IntegrationConfig & { platform_type: 'checkout' | 'gateway' | 'store' }) => {
      const { data, error } = await supabase
        .from('integrations')
        .insert({
          user_id: user?.id,
          platform_type: integrationData.platform_type,
          platform_name: integrationData.platform_name,
          config_data: integrationData.config_data,
          is_active: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Integração conectada!",
        description: "Sua integração foi configurada com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating integration:', error);
      
      let errorMessage = "Erro ao conectar integração.";
      
      if (error.message.includes("idx_one_active_integration_per_user")) {
        errorMessage = "Você já possui uma integração ativa. Desconecte a atual para adicionar uma nova.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook para desconectar integração
export const useDisconnectIntegration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (integrationId: string) => {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Integração desconectada!",
        description: "Sua integração foi removida com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error disconnecting integration:', error);
      toast({
        title: "Erro",
        description: "Erro ao desconectar integração.",
        variant: "destructive",
      });
    },
  });
};
