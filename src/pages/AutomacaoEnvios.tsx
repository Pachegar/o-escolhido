
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageCircle, Play, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Tipos para as configurações
interface EmailConfig {
  sender_name: string;
  subject: string;
  body: string;
}

interface WhatsAppConfig {
  message: string;
}

const AutomacaoEnvios = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  
  // Email automation state
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    sender_name: '',
    subject: '',
    body: ''
  });
  
  // WhatsApp automation state
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    message: ''
  });

  useEffect(() => {
    fetchUserPlan();
    fetchAutomationSettings();
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

  const fetchAutomationSettings = async () => {
    if (!user) return;
    
    try {
      // Buscar configurações de e-mail
      const { data: emailData } = await supabase
        .from('automation_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'email')
        .single();
      
      if (emailData && emailData.config_data) {
        const configData = emailData.config_data as EmailConfig;
        setEmailConfig({
          sender_name: configData.sender_name || '',
          subject: configData.subject || '',
          body: configData.body || ''
        });
      }

      // Buscar configurações de WhatsApp
      const { data: whatsappData } = await supabase
        .from('automation_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'whatsapp')
        .single();
      
      if (whatsappData && whatsappData.config_data) {
        const configData = whatsappData.config_data as WhatsAppConfig;
        setWhatsappConfig({
          message: configData.message || ''
        });
      }
    } catch (error) {
      console.error('Error fetching automation settings:', error);
    }
  };

  const saveEmailSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('automation_settings')
        .upsert({
          user_id: user.id,
          type: 'email',
          config_data: emailConfig,
          is_active: true
        }, {
          onConflict: 'user_id,type'
        });

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "As configurações de e-mail foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações de e-mail.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveWhatsAppSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('automation_settings')
        .upsert({
          user_id: user.id,
          type: 'whatsapp',
          config_data: whatsappConfig,
          is_active: true
        }, {
          onConflict: 'user_id,type'
        });

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "As configurações de WhatsApp foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving WhatsApp settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações de WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canAccessEmail = userPlan === 'Golfinho' || userPlan === 'Tubarão';
  const canAccessWhatsApp = userPlan === 'Tubarão';

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Automação de Envios</h1>
          <p className="text-muted-foreground">
            Configure o envio automático de notificações de rastreamento para seus clientes
          </p>
        </div>

        <div className="space-y-8">
          {/* Seção de Automação por E-mail */}
          {canAccessEmail && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Automação por E-mail
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
                    Salvar Configurações de E-mail
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
                    Salvar Configurações de WhatsApp
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

          {/* Aviso para planos menores */}
          {!canAccessEmail && !canAccessWhatsApp && (
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
