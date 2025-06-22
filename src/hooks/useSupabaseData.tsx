
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

// Hook para buscar dados do usuário atual
export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          plans:current_plan_id(*)
        `)
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

// Hook para buscar rastreamentos do usuário
export const useTrackings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['trackings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('trackings')
        .select(`
          *,
          delivery_models:delivery_model_id(*),
          tracking_events(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};

// Hook para buscar planos disponíveis
export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('monthly_price');
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Hook para criar rastreamento
export const useCreateTracking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (trackingData: any) => {
      const { data, error } = await supabase
        .from('trackings')
        .insert({
          ...trackingData,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackings'] });
      toast({
        title: "Rastreamento criado!",
        description: "O rastreamento foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating tracking:', error);
      
      let errorMessage = "Erro ao criar rastreamento.";
      
      if (error.message.includes("Limite de rastreamentos excedido")) {
        errorMessage = error.message;
      } else if (error.message.includes("duplicate key")) {
        errorMessage = "Já existe um rastreamento com este código.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar rastreamento
export const useUpdateTracking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result, error } = await supabase
        .from('trackings')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackings'] });
      toast({
        title: "Rastreamento atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating tracking:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar rastreamento.",
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar rastreamento
export const useDeleteTracking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trackings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackings'] });
      toast({
        title: "Rastreamento excluído!",
        description: "O rastreamento foi removido com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting tracking:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir rastreamento.",
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar perfil do usuário
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', user?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast({
        title: "Perfil atualizado!",
        description: "Suas alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil.",
        variant: "destructive",
      });
    },
  });
};

// Hook para buscar estatísticas do usuário
export const useUserStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_user_stats', { user_id: user.id });
      
      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!user?.id,
  });
};
