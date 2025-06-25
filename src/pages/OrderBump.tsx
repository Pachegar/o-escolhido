
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import {
  useOrderBumpProducts,
  useCreateOrderBumpProduct,
  useUpdateOrderBumpProduct,
  useDeleteOrderBumpProduct,
  OrderBumpProduct
} from '@/hooks/useOrderBump';

const OrderBump = () => {
  // Mock user plan - in real app this would come from auth context
  const userPlan = 'Golfinho'; // or 'Tubarão'
  const canUseOrderBump = ['Golfinho', 'Tubarão'].includes(userPlan);

  const { data: products = [], isLoading } = useOrderBumpProducts();
  const createProductMutation = useCreateOrderBumpProduct();
  const updateProductMutation = useUpdateOrderBumpProduct();
  const deleteProductMutation = useDeleteOrderBumpProduct();

  const [localProducts, setLocalProducts] = useState<OrderBumpProduct[]>([]);

  // Sync with server data
  React.useEffect(() => {
    if (products.length > 0) {
      setLocalProducts(products);
    }
  }, [products]);

  const addProduct = () => {
    if (localProducts.length >= 3) {
      return;
    }

    const newProduct: OrderBumpProduct = {
      section_title: 'Oferta Especial',
      section_subtitle: 'Aproveite esta oportunidade!',
      product_name: '',
      product_image_url: '',
      original_price: 0,
      promotional_price: 0,
      cta_link: '',
      display_order: localProducts.length + 1
    };

    setLocalProducts([...localProducts, newProduct]);
  };

  const removeProduct = async (index: number) => {
    const product = localProducts[index];
    
    if (product.id) {
      // Delete from database
      await deleteProductMutation.mutateAsync(product.id);
    }
    
    // Remove from local state
    setLocalProducts(localProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof OrderBumpProduct, value: any) => {
    const updatedProducts = [...localProducts];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setLocalProducts(updatedProducts);
  };

  const handleSave = async () => {
    try {
      for (const product of localProducts) {
        if (product.id) {
          // Update existing product
          await updateProductMutation.mutateAsync({
            id: product.id,
            data: product
          });
        } else {
          // Create new product
          await createProductMutation.mutateAsync(product);
        }
      }
    } catch (error) {
      console.error('Error saving products:', error);
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

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center text-white">Carregando...</div>
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
            disabled={createProductMutation.isPending || updateProductMutation.isPending}
            className="hover-button glow-button"
          >
            <Save className="w-4 h-4 mr-2" />
            {createProductMutation.isPending || updateProductMutation.isPending ? "Salvando..." : "Salvar alterações"}
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
                  📊 Limite: {localProducts.length}/3 produtos cadastrados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <div className="space-y-6">
          {localProducts.map((product, index) => (
            <Card key={index} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Produto {index + 1}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(index)}
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                    disabled={deleteProductMutation.isPending}
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
                      value={product.section_title}
                      onChange={(e) => updateProduct(index, 'section_title', e.target.value)}
                      placeholder="Ex: Oferta Especial Para Você!"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Subtítulo</Label>
                    <Input
                      value={product.section_subtitle || ''}
                      onChange={(e) => updateProduct(index, 'section_subtitle', e.target.value)}
                      placeholder="Ex: Aproveite enquanto seu pedido não chegou!"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Nome do produto</Label>
                  <Input
                    value={product.product_name}
                    onChange={(e) => updateProduct(index, 'product_name', e.target.value)}
                    placeholder="Ex: Camiseta Premium"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-white">Imagem do produto</Label>
                  <div className="mt-1">
                    <ImageUpload
                      value={product.product_image_url}
                      onChange={(url) => updateProduct(index, 'product_image_url', url)}
                      onRemove={() => updateProduct(index, 'product_image_url', '')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Preço original (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={product.original_price}
                      onChange={(e) => updateProduct(index, 'original_price', parseFloat(e.target.value) || 0)}
                      placeholder="89.90"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Preço promocional (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={product.promotional_price || 0}
                      onChange={(e) => updateProduct(index, 'promotional_price', parseFloat(e.target.value) || 0)}
                      placeholder="59.90"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Link para compra</Label>
                  <Input
                    value={product.cta_link}
                    onChange={(e) => updateProduct(index, 'cta_link', e.target.value)}
                    placeholder="https://loja.exemplo.com/produto"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Product Button */}
          {localProducts.length < 3 && (
            <Card className="glass-card border-dashed border-muted-foreground/50">
              <CardContent className="text-center py-12">
                <Button onClick={addProduct} variant="outline" className="hover-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar produto ({localProducts.length}/3)
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
