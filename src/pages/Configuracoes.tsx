import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Configuracoes = () => {
  const { toast } = useToast();
  const { user, updatePassword, updateEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Mock user plan - in real app this would come from auth context
  const userPlan = 'Polvo'; // or 'Peixe', 'Golfinho', 'Tubarão'
  
  // Define plan permissions using arrays
  const plansWithLogoUpload = ['Polvo', 'Golfinho', 'Tubarão'];
  const plansWithMessageEditing = ['Golfinho', 'Tubarão'];
  const plansWithCustomDomain = ['Tubarão'];
  
  const canUploadLogo = plansWithLogoUpload.includes(userPlan);
  const canEditMessages = plansWithMessageEditing.includes(userPlan);
  const canUseCustomDomain = plansWithCustomDomain.includes(userPlan);
  
  const [config, setConfig] = useState({
    logoUrl: '',
    tomVoz: 'profissional',
    corDestaque: '#0152F8',
    subdominio: '',
    dominioCustomizado: ''
  });

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    newEmail: ''
  });

  // Check if user came from password recovery
  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      toast({
        title: "Redefinição de senha",
        description: "Agora você pode alterar sua senha abaixo.",
        duration: 8000,
      });
    }
  }, [toast]);

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

  const handlePasswordChange = async () => {
    if (accountSettings.newPassword !== accountSettings.confirmNewPassword) {
      toast({
        title: "Erro",
        description: "A nova senha e a confirmação não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (accountSettings.newPassword.length < 8) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(accountSettings.newPassword);

    if (error) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Senha alterada com sucesso!",
        description: "Sua senha foi atualizada.",
      });
      setAccountSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    }

    setLoading(false);
  };

  const handleEmailChange = async () => {
    if (!accountSettings.newEmail) {
      toast({
        title: "Erro",
        description: "Digite um novo email válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await updateEmail(accountSettings.newEmail);

    if (error) {
      toast({
        title: "Erro ao alterar email",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email sendo alterado!",
        description: "Verifique sua caixa de entrada nos dois emails (atual e novo) para confirmar a alteração.",
        duration: 10000,
      });
      setAccountSettings(prev => ({ ...prev, newEmail: '' }));
    }

    setLoading(false);
  };

  const handleCancelSubscription = () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium ao final do período atual."
    );

    if (confirmed) {
      // Here you would implement subscription cancellation
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada. Você ainda terá acesso aos recursos premium até o final do período atual.",
        variant: "destructive",
        duration: 10000,
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUploadLogo) {
      toast({
        title: "Acesso negado",
        description: "Upload de logo disponível a partir do plano Polvo",
        variant: "destructive",
      });
      return;
    }

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
          <h1 className="text-3xl font-bold text-white">Configurações da Conta</h1>
          <p className="text-muted-foreground">Personalize a aparência e comportamento da sua conta</p>
        </div>

        {/* Account Security Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Segurança da Conta</CardTitle>
            <CardDescription>
              Altere sua senha e email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Change Password */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Alterar Senha</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="new-password" className="text-white">Nova senha</Label>
                  <PasswordInput
                    id="new-password"
                    value={accountSettings.newPassword}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Digite sua nova senha"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-new-password" className="text-white">Confirmar nova senha</Label>
                  <PasswordInput
                    id="confirm-new-password"
                    value={accountSettings.confirmNewPassword}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                    placeholder="Confirme sua nova senha"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                onClick={handlePasswordChange}
                disabled={loading || !accountSettings.newPassword || !accountSettings.confirmNewPassword}
                className="hover-button glow-button"
              >
                Alterar senha
              </Button>
            </div>

            <Separator />

            {/* Change Email */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Alterar Email</h3>
              <div>
                <Label htmlFor="current-email" className="text-white">Email atual</Label>
                <Input
                  id="current-email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="new-email" className="text-white">Novo email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={accountSettings.newEmail}
                  onChange={(e) => setAccountSettings(prev => ({ ...prev, newEmail: e.target.value }))}
                  placeholder="Digite seu novo email"
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleEmailChange}
                disabled={loading || !accountSettings.newEmail}
                className="hover-button glow-button"
              >
                Alterar email
              </Button>
            </div>

            <Separator />

            {/* Cancel Subscription */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Assinatura</h3>
              <p className="text-sm text-muted-foreground">
                Plano atual: <span className="font-medium text-white">{userPlan}</span>
              </p>
              <div className="flex gap-3">
                <Link to="/planos">
                  <Button variant="outline" className="hover-button">
                    💎 Gerenciar plano
                  </Button>
                </Link>
                <Button
                  onClick={handleCancelSubscription}
                  variant="destructive"
                  className="hover-button"
                >
                  Cancelar assinatura
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo Section */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Logo da Empresa</CardTitle>
                <CardDescription>
                  Personalize o logo que aparece nas páginas públicas de rastreamento
                </CardDescription>
              </div>
              {!canUploadLogo && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                  Polvo+
                </span>
              )}
            </div>
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
                <Label htmlFor="logo-upload" className="text-white">Escolher arquivo</Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="mt-1"
                  disabled={!canUploadLogo}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceitos: PNG, JPG, SVG. Tamanho máximo: 2MB
                </p>
              </div>
            </div>
            <Button 
              onClick={() => handleSubmit('logo')}
              disabled={loading || !canUploadLogo}
              className="hover-button glow-button"
            >
              Salvar logo
            </Button>
          </CardContent>
        </Card>

        {/* Tone of Voice */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Tom de Voz</CardTitle>
                <CardDescription>
                  Escolha o estilo das mensagens que aparecem nos rastreamentos
                </CardDescription>
              </div>
              {!canUploadLogo && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                  Polvo+
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tom-voz" className="text-white">Tom de voz</Label>
                <Select
                  value={config.tomVoz}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, tomVoz: value }))}
                  disabled={!canUploadLogo}
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
              <h4 className="font-medium mb-2 text-white">Exemplo de mensagem:</h4>
              <p className="text-sm text-white">
                {config.tomVoz === 'carismatico' && "🎉 Oba! Seu pedido está a caminho e chegará em breve!"}
                {config.tomVoz === 'engracado' && "🚀 Seu pedido saiu para entrega mais rápido que pizza no domingo!"}
                {config.tomVoz === 'profissional' && "📦 Objeto saiu para entrega ao destinatário."}
                {config.tomVoz === 'neutro' && "Produto em trânsito para o endereço de destino."}
              </p>
            </div>
            
            <Button 
              onClick={() => handleSubmit('tom-voz')}
              disabled={loading || !canUploadLogo}
              className="hover-button glow-button"
            >
              Salvar tom de voz
            </Button>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Recursos Avançados</CardTitle>
            <CardDescription>
              Funcionalidades disponíveis em planos superiores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Accent Color */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="cor-destaque" className="text-white">Cor de destaque</Label>
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                  Polvo+
                </span>
              </div>
              <div className="flex gap-3">
                <Input
                  id="cor-destaque"
                  type="color"
                  value={config.corDestaque}
                  onChange={(e) => setConfig(prev => ({ ...prev, corDestaque: e.target.value }))}
                  className="w-16 h-10 p-1 cursor-pointer"
                  disabled={!canUploadLogo}
                />
                <Input
                  value={config.corDestaque}
                  onChange={(e) => setConfig(prev => ({ ...prev, corDestaque: e.target.value }))}
                  placeholder="#0152F8"
                  className="flex-1"
                  disabled={!canUploadLogo}
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
                <Label htmlFor="subdominio" className="text-white">Subdomínio personalizado</Label>
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
                  disabled={!canEditMessages}
                />
                <div className="flex items-center px-3 bg-muted rounded-md border">
                  <span className="text-sm text-muted-foreground">.rastreietrack.com.br</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Acesse através do link: minhaloja.rastreietrack.com.br
              </p>
            </div>

            <Separator />

            {/* Custom Domain */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="dominio-customizado" className="text-white">Domínio customizado</Label>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  Tubarão
                </span>
              </div>
              <Input
                id="dominio-customizado"
                value={config.dominioCustomizado}
                onChange={(e) => setConfig(prev => ({ ...prev, dominioCustomizado: e.target.value }))}
                placeholder="rastreamento.minhaloja.com"
                disabled={!canUseCustomDomain}
              />
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-1 text-white">Configuração CNAME:</h4>
                <code className="text-xs text-white">rastreamento.minhaloja.com CNAME rastreietrack.com.br</code>
              </div>
              <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-300">
                  <strong>Atenção:</strong> O domínio próprio estará ativo em até 7 dias úteis. 
                  Verifique a disponibilidade antes em <a href="https://registro.br/" target="_blank" rel="noopener noreferrer" className="underline">https://registro.br/</a>
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Faça upgrade do seu plano para acessar esses recursos
              </p>
              <Link to="/planos">
                <Button variant="outline" className="hover-button glow-button">
                  💎 Ver planos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Configuracoes;
