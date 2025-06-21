
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

const OrderBump = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    imagem: '',
    precoOriginal: '',
    precoPromocional: '',
    ctaLink: '',
    titulo: '',
    subtitulo: ''
  });

  // Mock user plan - in real app this would come from auth context
  const userPlan = 'Golfinho'; // or 'Tubarão'
  const canAccessOrderBump = ['Golfinho', 'Tubarão'].includes(userPlan);

  const { data: produtos, isLoading, refetch } = useQuery({
    queryKey: ['orderbump-produtos'],
    queryFn: async () => {
      // Mock data for demonstration
      return [
        {
          id: '1',
          nome: 'Camiseta Premium',
          imagem: '/lovable-uploads/4452a6b2-830b-4a8e-a618-22a587835250.png',
          preco_original: 89.90,
          preco_promocional: 59.90,
          cta_link: 'https://loja.exemplo.com/camiseta',
          titulo: 'Oferta Especial',
          subtitulo: 'Aproveite enquanto seu pedido não chegou!',
          created_at: '2024-01-15'
        }
      ];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canAccessOrderBump) {
      toast({
        title: "Acesso negado",
        description: "Esta funcionalidade está disponível apenas para planos Golfinho e Tubarão",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would save to Supabase
      console.log('Saving product:', formData);
      
      toast({
        title: editingProduct ? "Produto atualizado!" : "Produto criado!",
        description: "As informações foram salvas com sucesso",
      });
      
      setDialogOpen(false);
      setEditingProduct(null);
      setFormData({
        nome: '',
        imagem: '',
        precoOriginal: '',
        precoPromocional: '',
        ctaLink: '',
        titulo: '',
        subtitulo: ''
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (produto: any) => {
    setEditingProduct(produto);
    setFormData({
      nome: produto.nome,
      imagem: produto.imagem,
      precoOriginal: produto.preco_original.toString(),
      precoPromocional: produto.preco_promocional?.toString() || '',
      ctaLink: produto.cta_link,
      titulo: produto.titulo,
      subtitulo: produto.subtitulo
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      // Here you would delete from Supabase
      console.log('Deleting product:', id);
      
      toast({
        title: "Produto excluído!",
        description: "O produto foi removido com sucesso",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would upload to Supabase Storage
      const fakeUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imagem: fakeUrl }));
      toast({
        title: "Imagem carregada!",
        description: "A imagem foi enviada com sucesso",
      });
    }
  };

  if (!canAccessOrderBump) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="glass-card max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-xl font-semibold mb-2 text-white">Acesso restrito</h2>
              <p className="text-muted-foreground mb-4">
                Esta funcionalidade está disponível apenas para planos Golfinho e Tubarão.
              </p>
              <Button className="hover-button glow-button">
                Fazer upgrade do plano
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

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
            <h1 className="text-3xl font-bold text-white">OrderBump / UpSell</h1>
            <p className="text-muted-foreground">Configure produtos para oferecer na página de rastreamento</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="hover-button glow-button"
                onClick={() => setEditingProduct(null)}
                disabled={produtos?.length >= 3}
              >
                🛍️ Novo produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto OrderBump'}
                </DialogTitle>
                <DialogDescription>
                  Configure um produto para ser oferecido na página de rastreamento. Máximo de 3 produtos.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titulo" className="text-white">Título da seção</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                      placeholder="Ex: Oferta Especial"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subtitulo" className="text-white">Subtítulo</Label>
                    <Input
                      id="subtitulo"
                      value={formData.subtitulo}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitulo: e.target.value }))}
                      placeholder="Ex: Aproveite enquanto seu pedido não chegou!"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="nome" className="text-white">Nome do produto</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Camiseta Premium"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="imagem" className="text-white">Imagem do produto</Label>
                  <Input
                    id="imagem"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1"
                  />
                  {formData.imagem && (
                    <div className="mt-2">
                      <img src={formData.imagem} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="precoOriginal" className="text-white">Preço original (R$)</Label>
                    <Input
                      id="precoOriginal"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.precoOriginal}
                      onChange={(e) => setFormData(prev => ({ ...prev, precoOriginal: e.target.value }))}
                      placeholder="89.90"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="precoPromocional" className="text-white">Preço promocional (R$) - Opcional</Label>
                    <Input
                      id="precoPromocional"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.precoPromocional}
                      onChange={(e) => setFormData(prev => ({ ...prev, precoPromocional: e.target.value }))}
                      placeholder="59.90"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ctaLink" className="text-white">Link para compra</Label>
                  <Input
                    id="ctaLink"
                    type="url"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaLink: e.target.value }))}
                    placeholder="https://loja.exemplo.com/produto"
                    required
                    className="mt-1"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 hover-button glow-button"
                  >
                    {editingProduct ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {produtos?.length >= 3 && (
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-medium text-white">Limite atingido</p>
                  <p className="text-sm text-muted-foreground">
                    Você atingiu o limite máximo de 3 produtos OrderBump
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Table */}
        <Card className="glass-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Produto</TableHead>
                    <TableHead className="text-white">Preços</TableHead>
                    <TableHead className="text-white">Seção</TableHead>
                    <TableHead className="text-white">Criado em</TableHead>
                    <TableHead className="text-white">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos?.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={produto.imagem} 
                            alt={produto.nome}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span className="font-medium text-white">{produto.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">
                          {produto.preco_promocional && (
                            <span className="text-sm text-muted-foreground line-through mr-2">
                              R$ {produto.preco_original.toFixed(2)}
                            </span>
                          )}
                          <span className="font-semibold">
                            R$ {(produto.preco_promocional || produto.preco_original).toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">
                          <div className="font-medium">{produto.titulo}</div>
                          <div className="text-sm text-muted-foreground">{produto.subtitulo}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        {new Date(produto.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(produto)}
                            className="hover-button"
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(produto.id)}
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

            {produtos?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-lg font-semibold mb-2 text-white">Nenhum produto configurado</h3>
                <p className="text-muted-foreground mb-4">
                  Configure produtos para ofertar na página de rastreamento
                </p>
                <Button 
                  className="hover-button glow-button"
                  onClick={() => setDialogOpen(true)}
                >
                  Criar primeiro produto
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
                <h3 className="font-semibold mb-1 text-white">Como funciona o OrderBump?</h3>
                <p className="text-sm text-muted-foreground">
                  Os produtos configurados aqui aparecerão na página pública de rastreamento, 
                  oferecendo aos seus clientes a oportunidade de comprar produtos complementares 
                  enquanto aguardam a entrega. Configure até 3 produtos com preços promocionais 
                  para aumentar suas vendas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderBump;
