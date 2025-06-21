
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const ModelosEntrega = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    minDias: '',
    maxDias: ''
  });

  const { data: modelos, isLoading, refetch } = useQuery({
    queryKey: ['modelos-entrega'],
    queryFn: async () => {
      // Mock data for demonstration
      return [
        {
          id: '1',
          nome: 'Express',
          min_dias: 2,
          max_dias: 4,
          created_at: '2024-01-15'
        },
        {
          id: '2',
          nome: 'Normal',
          min_dias: 5,
          max_dias: 7,
          created_at: '2024-01-15'
        },
        {
          id: '3',
          nome: 'Econômico',
          min_dias: 7,
          max_dias: 12,
          created_at: '2024-01-15'
        }
      ];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would save to Supabase
      console.log('Saving model:', formData);
      
      toast({
        title: editingModel ? "Modelo atualizado!" : "Modelo criado!",
        description: "As informações foram salvas com sucesso",
      });
      
      setDialogOpen(false);
      setEditingModel(null);
      setFormData({ nome: '', minDias: '', maxDias: '' });
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o modelo",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (modelo: any) => {
    setEditingModel(modelo);
    setFormData({
      nome: modelo.nome,
      minDias: modelo.min_dias.toString(),
      maxDias: modelo.max_dias.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este modelo?')) return;
    
    try {
      // Here you would delete from Supabase
      console.log('Deleting model:', id);
      
      toast({
        title: "Modelo excluído!",
        description: "O modelo foi removido com sucesso",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o modelo",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingModel(null);
    setFormData({ nome: '', minDias: '', maxDias: '' });
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
            <h1 className="text-3xl font-bold">Modelos de Entrega</h1>
            <p className="text-muted-foreground">Configure os prazos de entrega para seus rastreamentos</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="hover-button"
                onClick={() => setEditingModel(null)}
              >
                🚛 Novo modelo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingModel ? 'Editar Modelo' : 'Novo Modelo de Entrega'}
                </DialogTitle>
                <DialogDescription>
                  Configure o nome e os prazos de entrega em dias úteis.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Modelo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Express, Normal, Econômico"
                    required
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minDias">Mínimo (dias úteis)</Label>
                    <Input
                      id="minDias"
                      type="number"
                      min="1"
                      value={formData.minDias}
                      onChange={(e) => setFormData(prev => ({ ...prev, minDias: e.target.value }))}
                      placeholder="2"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxDias">Máximo (dias úteis)</Label>
                    <Input
                      id="maxDias"
                      type="number"
                      min="1"
                      value={formData.maxDias}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDias: e.target.value }))}
                      placeholder="4"
                      required
                      className="mt-1"
                    />
                  </div>
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
                    className="flex-1 hover-button"
                  >
                    {editingModel ? 'Atualizar' : 'Criar'}
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Prazo Mínimo</TableHead>
                    <TableHead>Prazo Máximo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelos?.map((modelo) => (
                    <TableRow key={modelo.id}>
                      <TableCell className="font-medium">{modelo.nome}</TableCell>
                      <TableCell>{modelo.min_dias} dias úteis</TableCell>
                      <TableCell>{modelo.max_dias} dias úteis</TableCell>
                      <TableCell>{new Date(modelo.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(modelo)}
                            className="hover-button"
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(modelo.id)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
                <h3 className="text-lg font-semibold mb-2">Nenhum modelo criado</h3>
                <p className="text-muted-foreground mb-4">
                  Crie seu primeiro modelo de entrega para começar
                </p>
                <Button 
                  className="hover-button"
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
                <h3 className="font-semibold mb-1">Como funcionam os modelos?</h3>
                <p className="text-sm text-muted-foreground">
                  Os modelos de entrega definem os prazos que serão utilizados para gerar 
                  automaticamente a linha do tempo dos rastreamentos. O sistema criará eventos 
                  realistas distribuídos entre o prazo mínimo e máximo configurado.
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
