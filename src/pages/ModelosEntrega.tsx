
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeliveryModels, useCreateDeliveryModel, useUpdateDeliveryModel, useDeleteDeliveryModel } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const ModelosEntrega = () => {
  const { user } = useAuth();
  const { data: modelos, isLoading, error } = useDeliveryModels();
  const createModel = useCreateDeliveryModel();
  const updateModel = useUpdateDeliveryModel();
  const deleteModel = useDeleteDeliveryModel();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    exact_delivery_days: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const diasNum = parseInt(formData.exact_delivery_days);
    if (diasNum < 1 || diasNum > 25) {
      toast({
        title: "Erro",
        description: "O número de dias deve estar entre 1 e 25",
        variant: "destructive",
      });
      return;
    }
    
    const modelData = {
      name: formData.name,
      exact_delivery_days: diasNum,
      qtde_eventos: Math.min(diasNum, 10), // Máximo de 10 eventos
      niveis_utilizados: ['nivel_1', 'nivel_2', 'nivel_3'], // Valores padrão
      is_system_default: false
    };

    try {
      if (editingModel) {
        await updateModel.mutateAsync({ id: editingModel.id, data: modelData });
      } else {
        await createModel.mutateAsync(modelData);
      }
      
      setDialogOpen(false);
      setEditingModel(null);
      setFormData({ name: '', exact_delivery_days: '' });
    } catch (error) {
      console.error('Error saving model:', error);
    }
  };

  const handleEdit = (modelo: any) => {
    setEditingModel(modelo);
    setFormData({
      name: modelo.name,
      exact_delivery_days: modelo.exact_delivery_days.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este modelo?')) return;
    
    try {
      await deleteModel.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingModel(null);
    setFormData({ name: '', exact_delivery_days: '' });
  };

  // Estados de carregamento
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </Layout>
    );
  }

  // Tratamento de erros
  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="glass-card border-red-500/50 bg-red-500/10">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Erro ao carregar modelos</h3>
              <p className="text-muted-foreground mb-4">
                Não foi possível carregar os modelos de entrega. Tente recarregar a página.
              </p>
              <Button onClick={() => window.location.reload()} className="hover-button">
                Recarregar página
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Se não há usuário logado
  if (!user) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Acesso necessário</h3>
              <p className="text-muted-foreground mb-4">
                Faça login para acessar seus modelos de entrega.
              </p>
              <Button className="hover-button">
                Fazer login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Separar modelos do sistema dos modelos do usuário
  const modelosDoSistema = modelos?.filter(m => m.is_system_default) || [];
  const modelosDoUsuario = modelos?.filter(m => !m.is_system_default) || [];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Modelos de Entrega</h1>
            <p className="text-muted-foreground">
              {modelosDoUsuario.length === 0 
                ? 'Configure seus primeiros prazos de entrega' 
                : `Configure os prazos de entrega para seus rastreamentos`
              }
            </p>
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
                  <Label htmlFor="name" className="text-white">Nome do Modelo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Express, Normal, Econômico"
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="exact_delivery_days" className="text-white">Dias para entrega (1-25 dias úteis)</Label>
                  <Input
                    id="exact_delivery_days"
                    type="number"
                    min="1"
                    max="25"
                    value={formData.exact_delivery_days}
                    onChange={(e) => setFormData(prev => ({ ...prev, exact_delivery_days: e.target.value }))}
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
                    disabled={createModel.isPending || updateModel.isPending}
                  >
                    {editingModel ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Modelos do Sistema */}
        {modelosDoSistema.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Modelos do Sistema</CardTitle>
              <p className="text-sm text-muted-foreground">
                Modelos pré-configurados disponíveis para todos os usuários
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Nome</TableHead>
                      <TableHead className="text-white">Prazo de Entrega</TableHead>
                      <TableHead className="text-white">Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelosDoSistema.map((modelo) => (
                      <TableRow key={modelo.id}>
                        <TableCell className="font-medium text-white">{modelo.name}</TableCell>
                        <TableCell className="text-white">{modelo.exact_delivery_days} dias úteis</TableCell>
                        <TableCell className="text-white">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                            Sistema
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modelos do Usuário */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Seus Modelos Personalizados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {modelosDoUsuario.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Nome</TableHead>
                      <TableHead className="text-white">Prazo de Entrega</TableHead>
                      <TableHead className="text-white">Criado em</TableHead>
                      <TableHead className="text-white">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelosDoUsuario.map((modelo) => (
                      <TableRow key={modelo.id}>
                        <TableCell className="font-medium text-white">{modelo.name}</TableCell>
                        <TableCell className="text-white">{modelo.exact_delivery_days} dias úteis</TableCell>
                        <TableCell className="text-white">{new Date(modelo.created_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(modelo)}
                              className="hover-button"
                              disabled={updateModel.isPending}
                            >
                              ✏️
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(modelo.id)}
                              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              disabled={deleteModel.isPending}
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
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚛</div>
                <h3 className="text-lg font-semibold mb-2 text-white">Nenhum modelo personalizado criado</h3>
                <p className="text-muted-foreground mb-4">
                  Crie seu primeiro modelo de entrega personalizado para começar a usar prazos específicos do seu negócio.
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
                  realistas distribuídos ao longo do período configurado. Você pode usar tanto 
                  os modelos do sistema quanto criar seus próprios modelos personalizados.
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
