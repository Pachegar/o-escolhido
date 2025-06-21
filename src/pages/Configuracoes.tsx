
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Configuracoes = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    logoUrl: '',
    tomVoz: 'profissional',
    corDestaque: '#0152F8',
    subdominio: '',
    dominioCustomizado: ''
  });

  const handleSubmit = async (section: string) => {
    setLoading(true);
    
    try {
      // Here you would save to Supabase
      console.log('Saving config:', { section, config });
      
      toast({
        title: "Configurações salvas!",
        description: "As alterações foram aplicadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would upload to Supabase Storage
      const fakeUrl = URL.createObjectURL(file);
      setConfig(prev => ({ ...prev, logoUrl: fakeUrl }));
      toast({
        title: "Logo carregado!",
        description: "Clique em 'Salvar' para aplicar as alterações",
      });
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações da Conta</h1>
          <p className="text-muted-foreground">Personalize a aparência e comportamento da sua conta</p>
        </div>

        {/* Logo Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Logo da Empresa</CardTitle>
            <CardDescription>
              Personalize o logo que aparece nas páginas públicas de rastreamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted">
                {config.logoUrl ? (
                  <img 
                    src={config.logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">Logo</span>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="logo-upload">Escolher arquivo</Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceitos: PNG, JPG, SVG. Tamanho máximo: 2MB
                </p>
              </div>
            </div>
            <Button 
              onClick={() => handleSubmit('logo')}
              disabled={loading}
              className="hover-button"
            >
              Salvar logo
            </Button>
          </CardContent>
        </Card>

        {/* Tone of Voice */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Tom de Voz</CardTitle>
            <CardDescription>
              Escolha o estilo das mensagens que aparecem nos rastreamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tom-voz">Tom de voz</Label>
                <Select
                  value={config.tomVoz}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, tomVoz: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carismatico">🤝 Carismático</SelectItem>
                    <SelectItem value="engracado">😄 Engraçado</SelectItem>
                    <SelectItem value="profissional">💼 Profissional</SelectItem>
                    <SelectItem value="neutro">⚪ Neutro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Exemplo de mensagem:</h4>
              <p className="text-sm">
                {config.tomVoz === 'carismatico' && "🎉 Oba! Seu pedido está a caminho e chegará em breve!"}
                {config.tomVoz === 'engracado' && "🚀 Seu pedido saiu para entrega mais rápido que pizza no domingo!"}
                {config.tomVoz === 'profissional' && "📦 Objeto saiu para entrega ao destinatário."}
                {config.tomVoz === 'neutro' && "Produto em trânsito para o endereço de destino."}
              </p>
            </div>
            
            <Button 
              onClick={() => handleSubmit('tom-voz')}
              disabled={loading}
              className="hover-button"
            >
              Salvar tom de voz
            </Button>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recursos Avançados</CardTitle>
            <CardDescription>
              Funcionalidades disponíveis em planos superiores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Accent Color */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="cor-destaque">Cor de destaque</Label>
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                  Cavalo-marinho+
                </span>
              </div>
              <div className="flex gap-3">
                <Input
                  id="cor-destaque"
                  type="color"
                  value={config.corDestaque}
                  onChange={(e) => setConfig(prev => ({ ...prev, corDestaque: e.target.value }))}
                  className="w-16 h-10 p-1 cursor-pointer"
                  disabled
                />
                <Input
                  value={config.corDestaque}
                  onChange={(e) => setConfig(prev => ({ ...prev, corDestaque: e.target.value }))}
                  placeholder="#0152F8"
                  className="flex-1"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Personalize a cor dos botões e destaques nas páginas públicas
              </p>
            </div>

            <Separator />

            {/* Subdomain */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="subdominio">Subdomínio personalizado</Label>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  Golfinho+
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  id="subdominio"
                  value={config.subdominio}
                  onChange={(e) => setConfig(prev => ({ ...prev, subdominio: e.target.value }))}
                  placeholder="minhaloja"
                  className="flex-1"
                  disabled
                />
                <div className="flex items-center px-3 bg-muted rounded-md border">
                  <span className="text-sm text-muted-foreground">.pachegar.com</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Acesse através do link: minhaloja.pachegar.com
              </p>
            </div>

            <Separator />

            {/* Custom Domain */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="dominio-customizado">Domínio customizado</Label>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  Tubarão
                </span>
              </div>
              <Input
                id="dominio-customizado"
                value={config.dominioCustomizado}
                onChange={(e) => setConfig(prev => ({ ...prev, dominioCustomizado: e.target.value }))}
                placeholder="rastreamento.minhaloja.com"
                disabled
              />
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-1">Configuração CNAME:</h4>
                <code className="text-xs">rastreamento.minhaloja.com CNAME pachegar.com</code>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Faça upgrade do seu plano para acessar esses recursos
              </p>
              <Button variant="outline" className="hover-button">
                💎 Ver planos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Configuracoes;
