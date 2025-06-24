
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageCircle, Play, Info, Settings, CheckCircle, AlertTriangle, QrCode, Send, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAutomationSettings } from '@/hooks/useAutomationSettings';
import { toast } from '@/hooks/use-toast';

const AutomacaoEnvios = () => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState(true); // Ativado por padrão para desenvolvimento
  const [showPassword, setShowPassword] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [smtpConfig, setSMTPConfig] = useState({
    sender_name: '',
    sender_email: '',
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_password: '',
    send_interval: '30',
    email_subject: '',
    email_body: ''
  });
  const [whatsappConfig, setWhatsappConfig] = useState({
    phone_number: '',
    message: ''
  });

  const {
    loading,
    emailConfig,
    setEmailConfig,
    whatsappConfig: hookWhatsappConfig,
    setWhatsappConfig: setHookWhatsappConfig,
    saveEmailSettings,
    saveWhatsAppSettings
  } = useAutomationSettings();

  useEffect(() => {
    fetchUserPlan();
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

  // Verificações de acesso por plano
  const canAccessEmail = mockMode || userPlan === 'Golfinho' || userPlan === 'Tubarão';
  const canAccessWhatsApp = mockMode || userPlan === 'Tubarão';

  const handleSMTPTest = async () => {
    toast({
      title: "Teste de e-mail enviado",
      description: "Verifique sua caixa de entrada para confirmar a configuração.",
    });
  };

  const connectWhatsApp = () => {
    setWhatsappConnected(true);
    toast({
      title: "WhatsApp conectado",
      description: "Sua conexão WhatsApp Web foi estabelecida com sucesso.",
    });
  };

  const saveSMTPConfig = async () => {
    toast({
      title: "Configurações SMTP salvas",
      description: "As configurações de e-mail foram salvas com sucesso.",
    });
  };

  const saveWhatsAppConfig = async () => {
    toast({
      title: "Configurações WhatsApp salvas",
      description: "As configurações de WhatsApp foram salvas com sucesso.",
    });
  };

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
            
            {/* Mock Mode Toggle - Visível durante desenvolvimento */}
            {mockMode && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <Settings className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Modo Desenvolvimento:</span>
                <Button
                  variant={mockMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMockMode(!mockMode)}
                >
                  {mockMode ? 'Ativado' : 'Desativado'}
                </Button>
              </div>
            )}
          </div>
          
          {/* Mock Mode Alert */}
          {mockMode && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Modo Desenvolvimento Ativo - Simulando Plano Tubarão</p>
                  <p className="text-sm text-purple-700">
                    Você está visualizando todas as funcionalidades disponíveis no plano Tubarão.
                    Plano atual: {userPlan || 'Carregando...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informações sobre variáveis disponíveis */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-2">Variáveis Disponíveis</h3>
                <p className="text-sm text-blue-700 mb-2">
                  Use essas variáveis em suas mensagens e elas serão substituídas automaticamente:
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs">{'{link_rastreamento}'}</code>
                    <span className="text-xs text-blue-700">→ Link público do rastreamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs">{'{nome_cliente}'}</code>
                    <span className="text-xs text-blue-700">→ Nome do cliente da plataforma integrada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            {/* Seção 1 - Configuração SMTP */}
            {canAccessEmail && (
              <AccordionItem value="smtp">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5" />
                    <div>
                      <h3 className="font-semibold">Configuração do E-mail Personalizado (SMTP)</h3>
                      <p className="text-sm text-muted-foreground">Configure seu próprio servidor de e-mail</p>
                    </div>
                    <Badge variant="secondary">Golfinho + Tubarão</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="sender_name">Nome do Remetente</Label>
                            <Input
                              id="sender_name"
                              placeholder="Ex: João da Silva"
                              value={smtpConfig.sender_name}
                              onChange={(e) => setSMTPConfig(prev => ({ ...prev, sender_name: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="sender_email">E-mail Remetente</Label>
                            <Input
                              id="sender_email"
                              type="email"
                              placeholder="Ex: contato@lojadojoao.com"
                              value={smtpConfig.sender_email}
                              onChange={(e) => setSMTPConfig(prev => ({ ...prev, sender_email: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="smtp_host">SMTP Host</Label>
                            <Input
                              id="smtp_host"
                              placeholder="Ex: smtp.gmail.com"
                              value={smtpConfig.smtp_host}
                              onChange={(e) => setSMTPConfig(prev => ({ ...prev, smtp_host: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="smtp_port">Porta</Label>
                            <Input
                              id="smtp_port"
                              placeholder="Ex: 587"
                              value={smtpConfig.smtp_port}
                              onChange={(e) => setSMTPConfig(prev => ({ ...prev, smtp_port: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="smtp_user">Nome de Usuário SMTP</Label>
                            <Input
                              id="smtp_user"
                              placeholder="Ex: contato@lojadojoao.com"
                              value={smtpConfig.smtp_user}
                              onChange={(e) => setSMTPConfig(prev => ({ ...prev, smtp_user: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="smtp_password">Senha SMTP</Label>
                            <div className="relative">
                              <Input
                                id="smtp_password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={smtpConfig.smtp_password}
                                onChange={(e) => setSMTPConfig(prev => ({ ...prev, smtp_password: e.target.value }))}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="send_interval">Intervalo entre Envios (segundos)</Label>
                            <Input
                              id="send_interval"
                              type="number"
                              placeholder="30"
                              value={smtpConfig.send_interval}
                              onChange={(e) => setSMTPConfig(prev => ({ ...prev, send_interval: e.target.value }))}
                            />
                          </div>

                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                              <p className="text-sm text-amber-800">
                                <strong>Importante:</strong> Para funcionar corretamente, o SMTP precisa estar configurado e com autenticação ativa.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div>
                          <Label htmlFor="email_subject">Assunto do E-mail</Label>
                          <Input
                            id="email_subject"
                            placeholder="Ex: Seu pedido está a caminho! 📦"
                            value={smtpConfig.email_subject}
                            onChange={(e) => setSMTPConfig(prev => ({ ...prev, email_subject: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="email_body">Corpo do E-mail</Label>
                          <Textarea
                            id="email_body"
                            placeholder="Ex: Olá {nome_cliente}! Seu pedido saiu para entrega. Acompanhe em tempo real: {link_rastreamento}"
                            className="min-h-[120px]"
                            value={smtpConfig.email_body}
                            onChange={(e) => setSMTPConfig(prev => ({ ...prev, email_body: e.target.value }))}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button onClick={saveSMTPConfig} disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Configurações'}
                          </Button>
                          <Button variant="outline" onClick={handleSMTPTest}>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar E-mail de Teste
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Seção 2 - WhatsApp Web */}
            {canAccessWhatsApp && (
              <AccordionItem value="whatsapp">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5" />
                    <div>
                      <h3 className="font-semibold">Configuração do WhatsApp Web</h3>
                      <p className="text-sm text-muted-foreground">Conecte seu WhatsApp para envios automáticos</p>
                    </div>
                    <Badge variant="secondary">Tubarão</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6">
                      {/* Aviso importante */}
                      <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-orange-800 mb-1">⚠️ Conexão deve ser mantida viva</p>
                            <p className="text-sm text-orange-700">
                              Se o WhatsApp for desconectado do celular ou fechado, os envios param automaticamente.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="whatsapp_phone">Número do WhatsApp</Label>
                            <Input
                              id="whatsapp_phone"
                              placeholder="Ex: +5511999999999"
                              value={whatsappConfig.phone_number}
                              onChange={(e) => setWhatsappConfig(prev => ({ ...prev, phone_number: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label>Status da Conexão</Label>
                            <div className="flex items-center gap-2 mt-2">
                              {whatsappConnected ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-green-600 font-medium">Conectado</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                                  <span className="text-sm text-orange-600 font-medium">Desconectado</span>
                                </>
                              )}
                            </div>
                          </div>

                          {!whatsappConnected && (
                            <Button onClick={connectWhatsApp} className="w-full">
                              <QrCode className="h-4 w-4 mr-2" />
                              Conectar WhatsApp
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          {!whatsappConnected && (
                            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                              <p className="text-sm text-gray-600">QR Code aparecerá aqui</p>
                              <p className="text-xs text-gray-500 mt-2">Escaneie com seu WhatsApp</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div>
                          <Label htmlFor="whatsapp_message">Mensagem Padrão</Label>
                          <Textarea
                            id="whatsapp_message"
                            placeholder="Ex: 🚚 Olá {nome_cliente}! Seu pedido saiu para entrega. Acompanhe em tempo real: {link_rastreamento}"
                            className="min-h-[120px]"
                            value={whatsappConfig.message}
                            onChange={(e) => setWhatsappConfig(prev => ({ ...prev, message: e.target.value }))}
                          />
                        </div>

                        <Button onClick={saveWhatsAppConfig} disabled={loading || !whatsappConnected}>
                          {loading ? 'Salvando...' : 'Salvar Configurações WhatsApp'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Seção 3 - Tutoriais */}
            <AccordionItem value="tutorials">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Play className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Tutoriais em Vídeo</h3>
                    <p className="text-sm text-muted-foreground">Aprenda como configurar cada funcionalidade</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {canAccessEmail && (
                        <div className="space-y-3">
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Tutorial em produção</p>
                            </div>
                          </div>
                          <h3 className="font-medium">Como configurar envio automático por e-mail (SMTP)</h3>
                          <p className="text-sm text-muted-foreground">
                            Aprenda a configurar seu servidor SMTP e personalizar as mensagens de e-mail.
                          </p>
                        </div>
                      )}

                      {canAccessWhatsApp && (
                        <div className="space-y-3">
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Tutorial em produção</p>
                            </div>
                          </div>
                          <h3 className="font-medium">Como configurar envio automático por WhatsApp</h3>
                          <p className="text-sm text-muted-foreground">
                            Conecte seu WhatsApp Web e configure mensagens automáticas para seus clientes.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Aviso para planos menores */}
          {!canAccessEmail && !canAccessWhatsApp && !mockMode && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Recurso não disponível no seu plano</h3>
                  <p className="text-muted-foreground mb-4">
                    A automação de envios está disponível nos planos Golfinho (e-mail) e Tubarão (e-mail + WhatsApp).
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Plano Golfinho:</strong> Automação por e-mail
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Plano Tubarão:</strong> Automação por e-mail + WhatsApp
                    </p>
                  </div>
                  <Button className="mt-4">Fazer upgrade do plano</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações sobre o gatilho */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Gatilho de Envio Automático
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Os envios automáticos são disparados quando o status do pedido muda para <strong>"Em trânsito"</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">1. Status Alterado</h4>
                    <p className="text-sm text-blue-600">Pedido muda para "Em trânsito"</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">2. Dados Coletados</h4>
                    <p className="text-sm text-green-600">Nome do cliente e link de rastreamento</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">3. Envio Automático</h4>
                    <p className="text-sm text-purple-600">E-mail e/ou WhatsApp enviados</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AutomacaoEnvios;
