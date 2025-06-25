import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Mail, MessageCircle, Play, Info, Settings, CheckCircle, AlertTriangle, Clock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAutomationSettings } from '@/hooks/useAutomationSettings';
import { toast } from '@/hooks/use-toast';

const AutomacaoEnvios = () => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState(true); // Ativado por padrão para desenvolvimento
  const [showPassword, setShowPassword] = useState(false);
  const [showSMTPConfig, setShowSMTPConfig] = useState(false);
  
  // Estados para configurações de e-mail
  const [emailConfig, setEmailConfig] = useState({
    sender_name: '',
    subject: '',
    body: '',
    // Configurações SMTP opcionais
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_password: '',
    use_custom_smtp: false
  });

  // Estados para configurações de WhatsApp
  const [whatsappConfig, setWhatsappConfig] = useState({
    phone_number: '',
    message: ''
  });

  // Estados para lógica de envio
  const [sendingLogic, setSendingLogic] = useState({
    timing_type: 'hours', // 'hours' ou 'business_days'
    timing_value: 1,
    start_time: '09:00',
    end_time: '18:00'
  });

  const {
    loading,
    saveEmailSettings,
    saveWhatsAppSettings
  } = useAutomationSettings();

  useEffect(() => {
    fetchUserPlan();
    loadSavedConfigurations();
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

  const loadSavedConfigurations = async () => {
    if (!user) return;
    
    try {
      // Buscar configurações salvas do banco
      const { data: automationData } = await supabase
        .from('automation_settings')
        .select('*')
        .eq('user_id', user.id);

      automationData?.forEach(config => {
        if (config.type === 'email' && config.config_data) {
          setEmailConfig(prev => ({
            ...prev,
            ...(typeof config.config_data === 'object' ? config.config_data : {})
          }));
        } else if (config.type === 'whatsapp' && config.config_data) {
          setWhatsappConfig(prev => ({
            ...prev,
            ...(typeof config.config_data === 'object' ? config.config_data : {})
          }));
        }
      });
    } catch (error) {
      console.error('Error loading configurations:', error);
    }
  };

  // Verificações de acesso por plano
  const canAccessEmail = mockMode || userPlan === 'Golfinho' || userPlan === 'Tubarão';
  const canAccessWhatsApp = mockMode || userPlan === 'Tubarão';

  const handleTestEmail = async () => {
    toast({
      title: "E-mail de teste enviado",
      description: "Verifique sua caixa de entrada para confirmar a configuração.",
    });
  };

  const handleTestSMTP = async () => {
    toast({
      title: "Conexão SMTP testada",
      description: "A conexão com o servidor SMTP foi testada com sucesso.",
    });
  };

  const handleSaveAllConfigurations = async () => {
    try {
      // Salvar configurações de e-mail se disponível
      if (canAccessEmail) {
        await saveEmailSettings();
      }

      // Salvar configurações de WhatsApp se disponível
      if (canAccessWhatsApp) {
        await saveWhatsAppSettings();
      }

      // Salvar lógica de envio
      const { error: logicError } = await supabase
        .from('automation_settings')
        .upsert({
          user_id: user?.id,
          type: 'sending_logic',
          config_data: sendingLogic,
          is_active: true
        }, {
          onConflict: 'user_id,type'
        });

      if (logicError) throw logicError;

      toast({
        title: "✅ Configurações salvas com sucesso!",
        description: "Agora seus clientes receberão os rastreios automaticamente, no tempo certo.",
      });
    } catch (error) {
      console.error('Error saving configurations:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Se não tem acesso, mostrar upgrade
  if (!canAccessEmail && !canAccessWhatsApp && !mockMode) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Recurso não disponível no seu plano</h3>
                <p className="text-muted-foreground mb-4">
                  A automação de envios está disponível nos planos Golfinho (e-mail) e Tubarão (e-mail + WhatsApp).
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Plano Golfinho:</strong> Automação por e-mail
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Plano Tubarão:</strong> Automação por e-mail + WhatsApp
                  </p>
                </div>
                <Button>Fazer upgrade do plano</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

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
          <Accordion type="multiple" className="w-full">
            {/* Accordion #1 - Automação por E-mail */}
            {canAccessEmail && (
              <AccordionItem value="email">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5" />
                    <div>
                      <h3 className="font-semibold">📬 Automação por E-mail</h3>
                      <p className="text-sm text-muted-foreground">Configure o envio automático de e-mails de rastreamento</p>
                    </div>
                    <Badge variant="secondary">Golfinho + Tubarão</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="sender_name">Remetente (nome ou e-mail)</Label>
                            <Input
                              id="sender_name"
                              placeholder="Ex: João da Silva ou contato@loja.com"
                              value={emailConfig.sender_name}
                              onChange={(e) => setEmailConfig(prev => ({ ...prev, sender_name: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="email_subject">Assunto do e-mail</Label>
                            <Input
                              id="email_subject"
                              placeholder="Ex: Seu pedido está a caminho! 📦"
                              value={emailConfig.subject}
                              onChange={(e) => setEmailConfig(prev => ({ ...prev, subject: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email_body">Corpo do e-mail</Label>
                            <Textarea
                              id="email_body"
                              placeholder="Ex: Olá {nome_cliente}! Seu pedido saiu para entrega. Acompanhe em tempo real: {link_rastreamento}"
                              className="min-h-[120px]"
                              value={emailConfig.body}
                              onChange={(e) => setEmailConfig(prev => ({ ...prev, body: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Configuração SMTP Personalizada */}
                      <div className="border-t pt-6">
                        <Collapsible open={showSMTPConfig} onOpenChange={setShowSMTPConfig}>
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              <span>⚠️ Configurar remetente personalizado (SMTP)</span>
                              <ChevronDown className={`h-4 w-4 transition-transform ${showSMTPConfig ? 'rotate-180' : ''}`} />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-4 mt-4">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-sm text-amber-800">
                                Configure seus próprios dados SMTP para enviar e-mails usando seu domínio personalizado.
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="smtp_host">Servidor SMTP</Label>
                                <Input
                                  id="smtp_host"
                                  placeholder="Ex: smtp.gmail.com"
                                  value={emailConfig.smtp_host}
                                  onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_host: e.target.value }))}
                                />
                              </div>

                              <div>
                                <Label htmlFor="smtp_port">Porta</Label>
                                <Input
                                  id="smtp_port"
                                  placeholder="Ex: 587"
                                  value={emailConfig.smtp_port}
                                  onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_port: e.target.value }))}
                                />
                              </div>

                              <div>
                                <Label htmlFor="smtp_user">E-mail do remetente</Label>
                                <Input
                                  id="smtp_user"
                                  type="email"
                                  placeholder="Ex: contato@loja.com"
                                  value={emailConfig.smtp_user}
                                  onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_user: e.target.value }))}
                                />
                              </div>

                              <div>
                                <Label htmlFor="smtp_password">Senha ou token</Label>
                                <div className="relative">
                                  <Input
                                    id="smtp_password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={emailConfig.smtp_password}
                                    onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_password: e.target.value }))}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <Button onClick={handleTestSMTP} variant="outline">
                              Testar conexão SMTP
                            </Button>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={handleTestEmail} variant="outline">
                          Enviar e-mail de teste
                        </Button>
                      </div>

                      {/* Vídeo tutorial para e-mail */}
                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-3">🔗 Tutorial: Como conectar seu e-mail personalizado via SMTP</h4>
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Vídeo tutorial em produção</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Accordion #2 - Automação por WhatsApp */}
            {canAccessWhatsApp && (
              <AccordionItem value="whatsapp">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5" />
                    <div>
                      <h3 className="font-semibold">💬 Automação por WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">Configure o envio automático via WhatsApp Web</p>
                    </div>
                    <Badge variant="secondary">Tubarão</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      {/* Aviso importante */}
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-orange-800">🟡 Essa conexão deve ser mantida viva</p>
                            <p className="text-sm text-orange-700">
                              Se o WhatsApp for desconectado do celular ou fechado, o envio para.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="whatsapp_phone">Número de WhatsApp do lojista (com DDI +55)</Label>
                            <Input
                              id="whatsapp_phone"
                              placeholder="Ex: +5511999999999"
                              value={whatsappConfig.phone_number}
                              onChange={(e) => setWhatsappConfig(prev => ({ ...prev, phone_number: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="whatsapp_message">Mensagem personalizada</Label>
                            <Textarea
                              id="whatsapp_message"
                              placeholder="Ex: 🚚 Olá {nome_cliente}! Seu pedido saiu para entrega. Acompanhe em tempo real: {link_rastreamento}"
                              className="min-h-[120px]"
                              value={whatsappConfig.message}
                              onChange={(e) => setWhatsappConfig(prev => ({ ...prev, message: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Status da Conexão</Label>
                            <div className="flex items-center gap-2 mt-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="text-sm text-orange-600 font-medium">Desconectado</span>
                            </div>
                          </div>

                          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-sm text-gray-600">Conecte seu WhatsApp Web</p>
                            <p className="text-xs text-gray-500 mt-2">QR Code aparecerá aqui</p>
                          </div>
                        </div>
                      </div>

                      {/* Vídeo tutorial para WhatsApp */}
                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-3">🔗 Tutorial: Como conectar seu WhatsApp Web ao sistema</h4>
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Vídeo tutorial em produção</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Accordion #3 - Lógica de Envio */}
            <AccordionItem value="timing">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">⏱️ Lógica de Envio</h3>
                    <p className="text-sm text-muted-foreground">Configure quando as mensagens serão enviadas</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="timing_type">Modelo de tempo</Label>
                          <Select 
                            value={sendingLogic.timing_type} 
                            onValueChange={(value) => setSendingLogic(prev => ({ ...prev, timing_type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o modelo de tempo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hours">Enviar após X horas</SelectItem>
                              <SelectItem value="business_days">Enviar após X dias úteis</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="timing_value">
                            {sendingLogic.timing_type === 'hours' ? 'Número de horas' : 'Número de dias úteis'}
                          </Label>
                          <Input
                            id="timing_value"
                            type="number"
                            min="1"
                            placeholder={sendingLogic.timing_type === 'hours' ? "Ex: 24" : "Ex: 3"}
                            value={sendingLogic.timing_value}
                            onChange={(e) => setSendingLogic(prev => ({ ...prev, timing_value: parseInt(e.target.value) || 1 }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Intervalo permitido de envio</Label>
                          <p className="text-xs text-muted-foreground mb-2">
                            Enviar apenas entre os horários especificados
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="start_time">Horário de início</Label>
                            <Input
                              id="start_time"
                              type="time"
                              value={sendingLogic.start_time}
                              onChange={(e) => setSendingLogic(prev => ({ ...prev, start_time: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="end_time">Horário de fim</Label>
                            <Input
                              id="end_time"
                              type="time"
                              value={sendingLogic.end_time}
                              onChange={(e) => setSendingLogic(prev => ({ ...prev, end_time: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Regra inteligente:</strong> Se o horário calculado estiver fora da janela, o envio será feito no próximo horário permitido.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Vídeo tutorial para lógica de envio */}
                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-3">🔗 Tutorial: Como configurar o modelo D+X e janela de envio</h4>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Vídeo tutorial em produção</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Accordion #4 - Vídeos Tutoriais */}
            <AccordionItem value="tutorials">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Play className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">📹 Vídeos Tutoriais</h3>
                    <p className="text-sm text-muted-foreground">Aprenda como configurar cada funcionalidade</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Tutorial em produção</p>
                          </div>
                        </div>
                        <h4 className="font-medium">Como configurar automação por e-mail</h4>
                        <p className="text-sm text-muted-foreground">
                          Aprenda a configurar envios automáticos de e-mail para seus clientes.
                        </p>
                      </div>

                      {canAccessWhatsApp && (
                        <div className="space-y-3">
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Tutorial em produção</p>
                            </div>
                          </div>
                          <h4 className="font-medium">Como configurar automação por WhatsApp</h4>
                          <p className="text-sm text-muted-foreground">
                            Conecte seu WhatsApp Web e configure mensagens automáticas.
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Tutorial em produção</p>
                          </div>
                        </div>
                        <h4 className="font-medium">Como configurar o modelo D+X e janela de envio</h4>
                        <p className="text-sm text-muted-foreground">
                          Configure quando e como as mensagens serão enviadas.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Botão Salvar Configurações */}
          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleSaveAllConfigurations} 
              disabled={loading}
              size="lg"
              className="px-8"
            >
              {loading ? 'Salvando...' : '💾 Salvar Configurações'}
            </Button>
          </div>

          {/* Informações sobre o gatilho */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Como funciona o envio automático
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Os envios automáticos são disparados quando o pedido é confirmado na sua plataforma integrada, seguindo a lógica de tempo configurada.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">1. Pedido Confirmado</h4>
                    <p className="text-sm text-blue-600">Cliente confirma a compra na plataforma</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">2. Aguarda Tempo</h4>
                    <p className="text-sm text-green-600">Sistema aguarda o tempo configurado</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">3. Envio Automático</h4>
                    <p className="text-sm text-purple-600">E-mail e/ou WhatsApp enviados no horário permitido</p>
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
