
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const ModelosEntrega = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    diasEntrega: ''
  });

  // Query para buscar modelos de entrega
  const { data: modelos, isLoading, refetch } = useQuery({
    queryKey: ['modelos-entrega', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('User not authenticated');
        return [];
      }

      console.log('Fetching delivery models for user:', user.id);
      
      const { data, error } = await supabase
        .from('delivery_models')
        .select('*')
        .or(`user_id.eq.${user.id},is_system_default.eq.true`)
        .order('is_system_default', { ascending: false })
        .order('name');

      if (error) {
        console.error('Error fetching delivery models:', error);
        throw error;
      }

      console.log('Delivery models fetched:', data);
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Mutation para criar modelo
  const createModelMutation = useMutation({
    mutationFn: async (modelData: any) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Creating delivery model:', modelData);

      const { data, error } = await supabase
        .from('delivery_models')
        .insert({
          name: modelData.nome,
          exact_delivery_days: parseInt(modelData.diasEntrega),
          user_id: user.id,
          qtde_eventos: 5, // Default value
          niveis_utilizados: [1, 2, 3, 4, 5], // Default levels
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
      queryClient.invalidateQueries({ queryKey: ['modelos-entrega'] });
      toast({
        title: "Modelo criado!",
        description: "O modelo de entrega foi criado com sucesso",
      });
      setDialogOpen(false);
      setEditingModel(null);
      setFormData({ nome: '', diasEntrega: '' });
    },
    onError: (error: any) => {
      console.error('Error creating model:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o modelo",
        variant: "destructive",
      });
    },
  });

  // Mutation para atualizar modelo
  const updateModelMutation = useMutation({
    mutationFn: async ({ id, modelData }: { id: string; modelData: any }) => {
      console.log('Updating delivery model:', id, modelData);

      const { data, error } = await supabase
        .from('delivery_models')
        .update({
          name: modelData.nome,
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
      queryClient.invalidateQueries({ queryKey: ['modelos-entrega'] });
      toast({
        title: "Modelo atualizado!",
        description: "O modelo de entrega foi atualizado com sucesso",
      });
      setDialogOpen(false);
      setEditingModel(null);
      setFormData({ nome: '', diasEntrega: '' });
    },
    onError: (error: any) => {
      console.error('Error updating model:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o modelo",
        variant: "destructive",
      });
    },
  });

  // Mutation para deletar modelo
  const deleteModelMutation = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ['modelos-entrega'] });
      toast({
        title: "Modelo excluído!",
        description: "O modelo foi removido com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting model:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir o modelo",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const diasNum = parseInt(formData.diasEntrega);
    if (diasNum < 1 || diasNum > 25) {
      toast({
        title: "Erro",
        description: "O número de dias deve estar entre 1 e 25",
        variant: "destructive",
      });
      return;
    }

    if (editingModel) {
      updateModelMutation.mutate({ id: editingModel.id, modelData: formData });
    } else {
      createModelMutation.mutate(formData);
    }
  };

  const handleEdit = (modelo: any) => {
    console.log('Editing model:', modelo);
    setEditingModel(modelo);
    setFormData({
      nome: modelo.name,
      diasEntrega: modelo.exact_delivery_days.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este modelo?')) return;
    deleteModelMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingModel(null);
    setFormData({ nome: '', diasEntrega: '' });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Modelos de Entrega</h1>
            <p className="text-muted-foreground">Configure os prazos de entrega para seus rastreamentos</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="hover-button glow-button"
                onClick={() => setEditingModel(null)}
              >
                🚛 Novo modelo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingModel ? 'Editar Modelo' : 'Novo Modelo de Entrega'}
                </DialogTitle>
                <DialogDescription>
                  Configure o nome e o prazo de entrega em dias úteis.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome" className="text-white">Nome do Modelo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Express, Normal, Econômico"
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="diasEntrega" className="text-white">Dias para entrega (1-25 dias úteis)</Label>
                  <Input
                    id="diasEntrega"
                    type="number"
                    min="1"
                    max="25"
                    value={formData.diasEntrega}
                    onChange={(e) => setFormData(prev => ({ ...prev, diasEntrega: e.target.value }))}
                    placeholder="7"
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Número exato de dias úteis para a entrega
                  </p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 hover-button glow-button"
                    disabled={createModelMutation.isPending || updateModelMutation.isPending}
                  >
                    {createModelMutation.isPending || updateModelMutation.isPending 
                      ? 'Salvando...' 
                      : editingModel ? 'Atualizar' : 'Criar'
                    }
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Models Table */}
        <Card className="glass-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Nome</TableHead>
                    <TableHead className="text-white">Prazo de Entrega</TableHead>
                    <TableHead className="text-white">Tipo</TableHead>
                    <TableHead className="text-white">Criado em</TableHead>
                    <TableHead className="text-white">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelos?.map((modelo) => (
                    <TableRow key={modelo.id}>
                      <TableCell className="font-medium text-white">{modelo.name}</TableCell>
                      <TableCell className="text-white">{modelo.exact_delivery_days} dias úteis</TableCell>
                      <TableCell className="text-white">
                        {modelo.is_system_default ? 'Sistema' : 'Personalizado'}
                      </TableCell>
                      <TableCell className="text-white">
                        {new Date(modelo.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(modelo)}
                            className="hover-button"
                            disabled={modelo.is_system_default}
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(modelo.id)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            disabled={modelo.is_system_default || deleteModelMutation.isPending}
                          >
                            🗑️
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {modelos?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚛</div>
                <h3 className="text-lg font-semibold mb-2 text-white">Nenhum modelo criado</h3>
                <p className="text-muted-foreground mb-4">
                  Crie seu primeiro modelo de entrega para começar
                </p>
                <Button 
                  className="hover-button glow-button"
                  onClick={() => setDialogOpen(true)}
                >
                  Criar primeiro modelo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold mb-1 text-white">Como funcionam os modelos?</h3>
                <p className="text-sm text-muted-foreground">
                  Os modelos de entrega definem o prazo exato que será utilizado para gerar 
                  automaticamente a linha do tempo dos rastreamentos. O sistema criará eventos 
                  realistas distribuídos ao longo do período configurado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ModelosEntrega;
