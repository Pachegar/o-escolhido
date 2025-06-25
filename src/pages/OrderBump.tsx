
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Plus, Save, Trash2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OrderBumpProduct {
  id?: string;
  sectionTitle: string;
  sectionSubtitle: string;
  productName: string;
  productImageUrl: string;
  originalPrice: number;
  promotionalPrice: number;
  ctaLink: string;
  displayOrder: number;
}

const OrderBump = () => {
  // Mock user plan - in real app this would come from auth context
  const userPlan = 'Golfinho'; // or 'Tubarão'
  const canUseOrderBump = ['Golfinho', 'Tubarão'].includes(userPlan);

  const [products, setProducts] = useState<OrderBumpProduct[]>([
    {
      id: '1',
      sectionTitle: 'Oferta Especial Para Você!',
      sectionSubtitle: 'Aproveite enquanto seu pedido não chegou!',
      productName: 'Camiseta Premium',
      productImageUrl: '/lovable-uploads/4452a6b2-830b-4a8e-a618-22a587835250.png',
      originalPrice: 89.90,
      promotionalPrice: 59.90,
      ctaLink: 'https://loja.exemplo.com/camiseta',
      displayOrder: 1
    }
  ]);

  const [loading, setLoading] = useState(false);

  const addProduct = () => {
    if (products.length >= 3) {
      toast({
        title: "Limite atingido",
        description: "Você pode cadastrar no máximo 3 produtos",
        variant: "destructive",
      });
      return;
    }

    const newProduct: OrderBumpProduct = {
      sectionTitle: 'Oferta Especial',
      sectionSubtitle: 'Aproveite esta oportunidade!',
      productName: '',
      productImageUrl: '',
      originalPrice: 0,
      promotionalPrice: 0,
      ctaLink: '',
      displayOrder: products.length + 1
    };

    setProducts([...products, newProduct]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof OrderBumpProduct, value: any) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setProducts(updatedProducts);
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Here you would save to Supabase
      console.log('Saving OrderBump products:', products);
      
      toast({
        title: "Produtos salvos!",
        description: "Suas ofertas foram atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar os produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!canUseOrderBump) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="glass-card">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-xl font-semibold mb-2 text-white">Recurso Premium</h2>
              <p className="text-muted-foreground mb-6">
                A funcionalidade OrderBump/Upsell está disponível apenas para os planos Golfinho e Tubarão.
              </p>
              <Button className="glow-button">
                Fazer upgrade do plano
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">OrderBump / Upsell</h1>
            <p className="text-muted-foreground">
              Ofereça produtos complementares na página de rastreamento
            </p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="hover-button glow-button"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>

        {/* Info Card */}
        <Card className="glass-card border-blue-500/50 bg-blue-500/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium text-white">Como funciona o OrderBump?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Os produtos cadastrados aqui aparecerão na página pública de rastreamento, 
                  permitindo que seus clientes façam compras adicionais enquanto aguardam a entrega.
                </p>
                <p className="text-sm text-blue-400 mt-2">
                  📊 Limite: {products.length}/3 produtos cadastrados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <div className="space-y-6">
          {products.map((product, index) => (
            <Card key={index} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Produto {index + 1}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(index)}
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Título da seção</Label>
                    <Input
                      value={product.sectionTitle}
                      onChange={(e) => updateProduct(index, 'sectionTitle', e.target.value)}
                      placeholder="Ex: Oferta Especial Para Você!"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Subtítulo</Label>
                    <Input
                      value={product.sectionSubtitle}
                      onChange={(e) => updateProduct(index, 'sectionSubtitle', e.target.value)}
                      placeholder="Ex: Aproveite enquanto seu pedido não chegou!"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Nome do produto</Label>
                  <Input
                    value={product.productName}
                    onChange={(e) => updateProduct(index, 'productName', e.target.value)}
                    placeholder="Ex: Camiseta Premium"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-white">URL da imagem</Label>
                  <Input
                    value={product.productImageUrl}
                    onChange={(e) => updateProduct(index, 'productImageUrl', e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="mt-1"
                  />
                  {product.productImageUrl && (
                    <div className="mt-2">
                      <img 
                        src={product.productImageUrl} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Preço original (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={product.originalPrice}
                      onChange={(e) => updateProduct(index, 'originalPrice', parseFloat(e.target.value) || 0)}
                      placeholder="89.90"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Preço promocional (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={product.promotionalPrice}
                      onChange={(e) => updateProduct(index, 'promotionalPrice', parseFloat(e.target.value) || 0)}
                      placeholder="59.90"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Link para compra</Label>
                  <Input
                    value={product.ctaLink}
                    onChange={(e) => updateProduct(index, 'ctaLink', e.target.value)}
                    placeholder="https://loja.exemplo.com/produto"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Product Button */}
          {products.length < 3 && (
            <Card className="glass-card border-dashed border-muted-foreground/50">
              <CardContent className="text-center py-12">
                <Button onClick={addProduct} variant="outline" className="hover-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar produto ({products.length}/3)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderBump;
