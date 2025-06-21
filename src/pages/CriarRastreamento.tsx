
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const CriarRastreamento = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nomeCliente: '',
    cidade: '',
    estado: '',
    modeloEntrega: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock code generation
      const codigo = `BR${Date.now().toString().slice(-9)}`;
      
      // Here you would normally save to Supabase
      console.log('Creating tracking:', { ...formData, codigo });
      
      toast({
        title: "Rastreamento criado!",
        description: `Código: ${codigo}`,
      });
      
      navigate('/rastreamentos');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o rastreamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Criar Rastreamento</h1>
          <p className="text-muted-foreground">Preencha os dados para gerar um novo código de rastreamento</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Informações do Rastreamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nomeCliente">Nome do Cliente</Label>
                <Input
                  id="nomeCliente"
                  value={formData.nomeCliente}
                  onChange={(e) => setFormData(prev => ({ ...prev, nomeCliente: e.target.value }))}
                  placeholder="Ex: João Silva"
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cidade">Cidade de Destino</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                    placeholder="Ex: São Paulo"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}
                    required
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map(estado => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="modeloEntrega">Modelo de Entrega</Label>
                <Select
                  value={formData.modeloEntrega}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, modeloEntrega: value }))}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o modelo de entrega" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="express">Express (2-4 dias úteis)</SelectItem>
                    <SelectItem value="normal">Normal (5-7 dias úteis)</SelectItem>
                    <SelectItem value="economico">Econômico (7-12 dias úteis)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/rastreamentos')}
                  className="flex-1 hover-button"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 hover-button"
                >
                  {loading ? 'Criando...' : 'Criar Rastreamento'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass-card mt-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold mb-1">Como funciona?</h3>
                <p className="text-sm text-muted-foreground">
                  Após criar o rastreamento, um código único será gerado e você poderá compartilhar 
                  o link público com seu cliente. O sistema criará automaticamente uma linha do tempo 
                  de entrega realista baseada no modelo selecionado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CriarRastreamento;
