
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageCircle, Play, Info, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAutomationSettings } from '@/hooks/useAutomationSettings';

const AutomacaoEnvios = () => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const {
    loading,
    emailConfig,
    setEmailConfig,
    whatsappConfig,
    setWhatsappConfig,
    saveEmailSettings,
    saveWhatsAppSettings
  } = useAutomationSettings();

  useEffect(() => {
    fetchUserPlan();
    checkAdminRole();
  }, [user]);

  const fetchUserPlan = async () => {
    if (!user) return;
    
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('current_plan_id, plans(name)')
        .eq('id', user.id)
        .single();
      
      if (userData?.plans?.name) {
        setUserPlan(userData.plans.name);
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
    }
  };

  const checkAdminRole = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['admin', 'moderator']);
      
      if (data && data.length > 0) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  // Check access permissions
  const canAccessEmail = devMode || userPlan === 'Golfinho' || userPlan === 'Tubarão';
  const canAccessWhatsApp = devMode || userPlan === 'Tubarão';

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Automação de Envios</h1>
              <p className="text-muted-foreground">
                Configure o envio automático de notificações de rastreamento para seus clientes
              </p>
            </div>
            
            {/* Dev Mode Toggle - Only for admins */}
            {isAdmin && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Settings className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Modo Desenvolvedor:</span>
                <Button
                  variant={devMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDevMode(!devMode)}
                >
                  {devMode ? 'Ativado' : 'Desativado'}
                </Button>
              </div>
            )}
          </div>
          
          {/* Dev Mode Alert */}
          {devMode && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Modo Desenvolvedor Ativo</p>
                  <p className="text-sm text-yellow-700">
                    As limitações de plano foram desabilitadas temporariamente para testes e desenvolvimento.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Seção de Automação por E-mail */}
          {canAccessEmail && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Automação por E-mail
                  {devMode && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">DEV</span>}
                </CardTitle>
                <CardDescription>
                  Configure as mensagens de e-mail que serão enviadas automaticamente quando o status do pedido for atualizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Use <code className="bg-blue-100 px-1 rounded">{'{link_rastreamento}'}</code> para inserir automaticamente o link público de rastreio do cliente.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sender_name">Nome do Remetente</Label>
                    <Input
                      id="sender_name"
                      placeholder="Ex: Minha Loja"
                      value={emailConfig.sender_name}
                      onChange={(e) => setEmailConfig(prev => ({ ...prev, sender_name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email_subject">Assunto do E-mail</Label>
                    <Input
                      id="email_subject"
                      placeholder="Ex: Seu pedido está a caminho! 📦"
                      value={emailConfig.subject}
                      onChange={(e) => setEmailConfig(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email_body">Corpo do E-mail</Label>
                    <Textarea
                      id="email_body"
                      placeholder="Ex: Olá! Seu pedido saiu para entrega. Acompanhe em tempo real: {link_rastreamento}"
                      className="min-h-[120px]"
                      value={emailConfig.body}
                      onChange={(e) => setEmailConfig(prev => ({ ...prev, body: e.target.value }))}
                    />
                  </div>

                  <Button onClick={saveEmailSettings} disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Configurações de E-mail'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seção de Automação por WhatsApp */}
          {canAccessWhatsApp && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Automação por WhatsApp
                  {devMode && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">DEV</span>}
                </CardTitle>
                <CardDescription>
                  Configure as mensagens de WhatsApp que serão enviadas automaticamente quando o status do pedido for atualizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-green-600 mt-0.5" />
                    <p className="text-sm text-green-800">
                      Use <code className="bg-green-100 px-1 rounded">{'{link_rastreamento}'}</code> para inserir automaticamente o link público de rastreio do cliente.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp_message">Mensagem do WhatsApp</Label>
                    <Textarea
                      id="whatsapp_message"
                      placeholder="Ex: 🚚 Seu pedido saiu para entrega! Acompanhe em tempo real: {link_rastreamento}"
                      className="min-h-[120px]"
                      value={whatsappConfig.message}
                      onChange={(e) => setWhatsappConfig(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <Button onClick={saveWhatsAppSettings} disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Configurações de WhatsApp'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seção de Tutoriais */}
          <Card>
            <CardHeader>
              <CardTitle>Tutoriais</CardTitle>
              <CardDescription>
                Aprenda como configurar e usar a automação de envios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {canAccessEmail && (
                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Tutorial em breve</p>
                      </div>
                    </div>
                    <h3 className="font-medium">Como configurar envio automático por e-mail</h3>
                  </div>
                )}

                {canAccessWhatsApp && (
                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Tutorial em breve</p>
                      </div>
                    </div>
                    <h3 className="font-medium">Como configurar envio automático por WhatsApp</h3>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Aviso para planos menores - Only show if not in dev mode */}
          {!canAccessEmail && !canAccessWhatsApp && !devMode && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Recurso não disponível no seu plano</h3>
                  <p className="text-muted-foreground mb-4">
                    A automação de envios está disponível nos planos Golfinho e Tubarão.
                  </p>
                  <Button>Fazer upgrade do plano</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AutomacaoEnvios;
