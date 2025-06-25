
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface OrderBumpProduct {
  id?: string;
  section_title: string;
  section_subtitle?: string;
  product_name: string;
  product_image_url?: string;
  original_price: number;
  promotional_price?: number;
  cta_link: string;
  display_order: number;
}

// Hook para buscar produtos OrderBump do usuário
export const useOrderBumpProducts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orderBumpProducts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('order_bump_products')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};

// Hook para criar produto OrderBump
export const useCreateOrderBumpProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (productData: Omit<OrderBumpProduct, 'id'>) => {
      const { data, error } = await supabase
        .from('order_bump_products')
        .insert({
          ...productData,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderBumpProducts'] });
      toast({
        title: "Produto criado!",
        description: "O produto OrderBump foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating OrderBump product:', error);
      
      let errorMessage = "Erro ao criar produto.";
      
      if (error.message.includes("Limite máximo de 3 produtos")) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar produto OrderBump
export const useUpdateOrderBumpProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OrderBumpProduct> }) => {
      const { data: result, error } = await supabase
        .from('order_bump_products')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderBumpProducts'] });
      toast({
        title: "Produto atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating OrderBump product:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto.",
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar produto OrderBump
export const useDeleteOrderBumpProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('order_bump_products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderBumpProducts'] });
      toast({
        title: "Produto excluído!",
        description: "O produto foi removido com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting OrderBump product:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir produto.",
        variant: "destructive",
      });
    },
  });
};
