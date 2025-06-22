
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useDeliveryModels = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deliveryModelsQuery = useQuery({
    queryKey: ['delivery-models', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('User not authenticated for delivery models');
        return [];
      }

      console.log('Fetching delivery models for user:', user.id);
      
      const { data, error } = await supabase
        .from('delivery_models')
        .select('*')
        .or(`user_id.eq.${user.id},is_system_default.eq.true`)
        .order('is_system_default', { ascending: false })
        .order('id');

      if (error) {
        console.error('Error fetching delivery models:', error);
        throw error;
      }

      console.log('Delivery models fetched:', data);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const createDeliveryModel = useMutation({
    mutationFn: async (modelData: { nome: string; diasEntrega: string }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Creating delivery model:', modelData);

      const { data, error } = await supabase
        .from('delivery_models')
        .insert({
          exact_delivery_days: parseInt(modelData.diasEntrega),
          user_id: user.id,
          qtde_eventos: 5,
          niveis_utilizados: ['1', '2', '3', '4', '5'],
          is_system_default: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating delivery model:', error);
        throw error;
      }

      console.log('Delivery model created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-models'] });
      toast({
        title: "Modelo criado!",
        description: "O modelo de entrega foi criado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Error creating delivery model:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o modelo",
        variant: "destructive",
      });
    },
  });

  const updateDeliveryModel = useMutation({
    mutationFn: async ({ id, modelData }: { id: string; modelData: { nome: string; diasEntrega: string } }) => {
      console.log('Updating delivery model:', id, modelData);

      const { data, error } = await supabase
        .from('delivery_models')
        .update({
          exact_delivery_days: parseInt(modelData.diasEntrega),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating delivery model:', error);
        throw error;
      }

      console.log('Delivery model updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-models'] });
      toast({
        title: "Modelo atualizado!",
        description: "O modelo de entrega foi atualizado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Error updating delivery model:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o modelo",
        variant: "destructive",
      });
    },
  });

  const deleteDeliveryModel = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting delivery model:', id);

      const { error } = await supabase
        .from('delivery_models')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting delivery model:', error);
        throw error;
      }

      console.log('Delivery model deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-models'] });
      toast({
        title: "Modelo excluído!",
        description: "O modelo foi removido com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting delivery model:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir o modelo",
        variant: "destructive",
      });
    },
  });

  return {
    deliveryModels: deliveryModelsQuery.data,
    isLoading: deliveryModelsQuery.isLoading,
    error: deliveryModelsQuery.error,
    createDeliveryModel,
    updateDeliveryModel,
    deleteDeliveryModel,
    refetch: deliveryModelsQuery.refetch,
  };
};
