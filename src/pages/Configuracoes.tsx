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
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Save } from 'lucide-react';

const Configuracoes = () => {
  const { toast } = useToast();
  const { user, updatePassword, updateEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [colorLoading, setColorLoading] = useState(false);
  const [subdomainLoading, setSubdomainLoading] = useState(false);
  const [domainLoading, setDomainLoading] = useState(false);
  
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

  // Password validation function
  const validatePassword = (password: string) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasMinLength = password.length >= 8;

    return {
      isValid: hasLowercase && hasUppercase && hasNumber && hasSymbol && hasMinLength,
      requirements: {
        hasLowercase,
        hasUppercase,
        hasNumber,
        hasSymbol,
        hasMinLength
      }
    };
  };

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const handleColorSave = async () => {
    setColorLoading(true);
    
    try {
      // Here you would save color to Supabase
      console.log('Saving color:', config.corDestaque);
      
      toast({
        title: "Cor de destaque salva!",
        description: "A cor foi atualizada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a cor de destaque",
        variant: "destructive",
      });
    } finally {
      setColorLoading(false);
    }
  };

  const handleSubdomainSave = async () => {
    setSubdomainLoading(true);
    
    try {
      // Here you would save subdomain to Supabase
      console.log('Saving subdomain:', config.subdominio);
      
      toast({
        title: "Subdomínio salvo!",
        description: "O subdomínio foi configurado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o subdomínio",
        variant: "destructive",
      });
    } finally {
      setSubdomainLoading(false);
    }
  };

  const handleDomainSave = async () => {
    setDomainLoading(true);
    
    try {
      // Here you would save custom domain to Supabase
      console.log('Saving custom domain:', config.dominioCustomizado);
      
      toast({
        title: "Domínio customizado salvo!",
        description: "O domínio foi configurado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o domínio customizado",
        variant: "destructive",
      });
    } finally {
      setDomainLoading(false);
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

    const passwordValidation = validatePassword(accountSettings.newPassword);
    if (!passwordValidation.isValid) {
      const missing = [];
      if (!passwordValidation.requirements.hasMinLength) missing.push('pelo menos 8 caracteres');
      if (!passwordValidation.requirements.hasLowercase) missing.push('letras minúsculas');
      if (!passwordValidation.requirements.hasUppercase) missing.push('letras maiúsculas');
      if (!passwordValidation.requirements.hasNumber) missing.push('números');
      if (!passwordValidation.requirements.hasSymbol) missing.push('símbolos');

      toast({
        title: "Senha não atende aos critérios",
        description: `A senha deve conter: ${missing.join(', ')}.`,
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
    console.log('handleEmailChange called with email:', accountSettings.newEmail);
    console.log('Current user email:', user?.email);

    // Validação básica: campo vazio
    if (!accountSettings.newEmail || accountSettings.newEmail.trim() === '') {
      console.log('Email field is empty');
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite um endereço de email.",
        variant: "destructive",
      });
      return;
    }

    // Validação de formato de email
    if (!validateEmail(accountSettings.newEmail)) {
      console.log('Email format is invalid');
      toast({
        title: "Email inválido",
        description: "Por favor, digite um endereço de email válido.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o novo email é diferente do atual
    if (accountSettings.newEmail === user?.email) {
      console.log('Email is the same as current');
      toast({
        title: "Email já é o atual",
        description: "O novo email deve ser diferente do email atual.",
        variant: "destructive",
      });
      return;
    }

    console.log('All validations passed, attempting to update email');
    setLoading(true);

    try {
      const { error } = await updateEmail(accountSettings.newEmail);
      console.log('updateEmail result:', { error });

      if (error) {
        console.error('Error updating email:', error);
        
        let errorMessage = "Erro desconhecido ao alterar email.";
        
        // Verificar diferentes tipos de erro
        if (error.message.includes("already registered") || error.message.includes("User already registered")) {
          errorMessage = "Este email já está registrado em outra conta.";
        } else if (error.message.includes("invalid") || error.message.includes("Invalid")) {
          errorMessage = "Endereço de email inválido.";
        } else if (error.message.includes("rate limit") || error.message.includes("Rate limit")) {
          errorMessage = "Muitas tentativas. Tente novamente em alguns minutos.";
        } else if (error.message.includes("network") || error.message.includes("Network")) {
          errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
        } else {
          errorMessage = error.message;
        }

        toast({
          title: "Erro ao alterar email",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Email update successful');
        toast({
          title: "Emails de confirmação enviados!",
          description: `Foram enviados emails de confirmação para seu email atual (${user?.email}) e para o novo email (${accountSettings.newEmail}). Você precisa confirmar a alteração em ambos os emails para que a mudança seja efetivada.`,
          duration: 15000,
        });
        
        // Limpar o campo após sucesso
        setAccountSettings(prev => ({ ...prev, newEmail: '' }));
      }
    } catch (error: any) {
      console.error('Unexpected error in handleEmailChange:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const passwordValidation = validatePassword(accountSettings.newPassword);

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
                  {accountSettings.newPassword && (
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-xs text-white mb-2">A senha deve conter:</p>
                      <ul className="text-xs space-y-1">
                        <li className={passwordValidation.requirements.hasMinLength ? 'text-green-400' : 'text-red-400'}>
                          ✓ Pelo menos 8 caracteres
                        </li>
                        <li className={passwordValidation.requirements.hasLowercase ? 'text-green-400' : 'text-red-400'}>
                          ✓ Letras minúsculas
                        </li>
                        <li className={passwordValidation.requirements.hasUppercase ? 'text-green-400' : 'text-red-400'}>
                          ✓ Letras maiúsculas
                        </li>
                        <li className={passwordValidation.requirements.hasNumber ? 'text-green-400' : 'text-red-400'}>
                          ✓ Números
                        </li>
                        <li className={passwordValidation.requirements.hasSymbol ? 'text-green-400' : 'text-red-400'}>
                          ✓ Símbolos (!@#$%^&* etc.)
                        </li>
                      </ul>
                    </div>
                  )}
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
                disabled={loading || !accountSettings.newPassword || !accountSettings.confirmNewPassword || !passwordValidation.isValid}
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
                {loading ? "Enviando..." : "Alterar email"}
              </Button>
            </div>

            <Separator />

            {/* Subscription Management */}
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
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Personalize a cor dos botões e destaques nas páginas públicas
              </p>
              <Button 
                onClick={handleColorSave}
                disabled={colorLoading || !canUploadLogo}
                className="hover-button glow-button"
              >
                <Save className="w-4 h-4 mr-2" />
                {colorLoading ? "Salvando..." : "Salvar cor"}
              </Button>
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
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Acesse através do link: minhaloja.rastreietrack.com.br
              </p>
              <Button 
                onClick={handleSubdomainSave}
                disabled={subdomainLoading || !canEditMessages}
                className="hover-button glow-button"
              >
                <Save className="w-4 h-4 mr-2" />
                {subdomainLoading ? "Salvando..." : "Salvar subdomínio"}
              </Button>
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
              <div className="mt-3">
                <Button 
                  onClick={handleDomainSave}
                  disabled={domainLoading || !canUseCustomDomain}
                  className="hover-button glow-button"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {domainLoading ? "Salvando..." : "Salvar domínio"}
                </Button>
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

        {/* Cancel Subscription - Moved to the end */}
        <Card className="glass-card border-red-500/20">
          <CardHeader>
            <CardTitle className="text-white">Zona de Perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-red-400 mb-2">Cancelar Assinatura</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ao cancelar sua assinatura, você perderá acesso aos recursos premium ao final do período atual. Esta ação não pode ser desfeita.
                </p>
                <Button
                  onClick={() => {
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
                  }}
                  variant="destructive"
                  className="hover-button"
                >
                  Cancelar assinatura
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Configuracoes;
