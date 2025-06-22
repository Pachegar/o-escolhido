
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

// Hook para buscar estatísticas do dashboard
export const useDashboardStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Buscar perfil do usuário com plano
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          plans:current_plan_id(*)
        `)
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      // Buscar todos os rastreamentos do usuário
      const { data: trackings, error: trackingsError } = await supabase
        .from('trackings')
        .select('current_status, is_completed, clicks, created_at')
        .eq('user_id', user.id);
      
      if (trackingsError) throw trackingsError;
      
      // Calcular estatísticas
      const totalTrackings = trackings?.length || 0;
      const activeTrackings = trackings?.filter(t => !t.is_completed).length || 0;
      const deliveredTrackings = trackings?.filter(t => t.is_completed).length || 0;
      const totalClicks = trackings?.reduce((sum, t) => sum + (t.clicks || 0), 0) || 0;
      
      // Calcular uso do plano
      const planLimit = userProfile?.plans?.tracking_limit || 0;
      const bonusCredits = userProfile?.referral_credits || 0;
      const totalAllowed = planLimit + bonusCredits;
      const remainingTrackings = Math.max(0, totalAllowed - totalTrackings);
      const usagePercentage = totalAllowed > 0 ? (totalTrackings / totalAllowed) * 100 : 0;
      
      // Calcular tendências mensais (comparação com mês anterior)
      const currentMonth = new Date();
      const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const currentMonthTrackings = trackings?.filter(t => 
        new Date(t.created_at) >= currentMonthStart
      ).length || 0;
      
      const lastMonthTrackings = trackings?.filter(t => {
        const trackingDate = new Date(t.created_at);
        return trackingDate >= lastMonth && trackingDate < currentMonthStart;
      }).length || 0;
      
      const monthlyGrowth = lastMonthTrackings > 0 
        ? Math.round(((currentMonthTrackings - lastMonthTrackings) / lastMonthTrackings) * 100)
        : currentMonthTrackings > 0 ? 100 : 0;
      
      return {
        totalActive: activeTrackings,
        totalDelivered: deliveredTrackings,
        totalClicks,
        remainingTrackings,
        planLimit,
        bonusCredits,
        usagePercentage,
        totalAllowed,
        monthlyGrowth,
        userProfile
      };
    },
    enabled: !!user?.id,
  });
};

// Hook para buscar modelos de entrega
export const useDeliveryModels = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['deliveryModels', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('delivery_models')
        .select('*')
        .or(`user_id.eq.${user.id},is_system_default.eq.true`)
        .order('is_system_default', { ascending: false })
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};

// Hook para buscar order bumps
export const useOrderBumps = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orderBumps', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('order_bumps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
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
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
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
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
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
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
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

// Hook para criar modelo de entrega
export const useCreateDeliveryModel = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (modelData: any) => {
      const { data, error } = await supabase
        .from('delivery_models')
        .insert({
          ...modelData,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryModels'] });
      toast({
        title: "Modelo criado!",
        description: "O modelo de entrega foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating delivery model:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar modelo de entrega.",
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar modelo de entrega
export const useUpdateDeliveryModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result, error } = await supabase
        .from('delivery_models')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryModels'] });
      toast({
        title: "Modelo atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating delivery model:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar modelo de entrega.",
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar modelo de entrega
export const useDeleteDeliveryModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('delivery_models')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryModels'] });
      toast({
        title: "Modelo excluído!",
        description: "O modelo foi removido com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting delivery model:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir modelo de entrega.",
        variant: "destructive",
      });
    },
  });
};

// Hook para criar order bump
export const useCreateOrderBump = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (orderBumpData: any) => {
      const { data, error } = await supabase
        .from('order_bumps')
        .insert({
          ...orderBumpData,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderBumps'] });
      toast({
        title: "Order Bump criado!",
        description: "O order bump foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating order bump:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar order bump.",
        variant: "destructive",
      });
    },
  });
};
