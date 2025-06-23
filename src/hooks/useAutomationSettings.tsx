
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface EmailConfig {
  sender_name: string;
  subject: string;
  body: string;
}

interface WhatsAppConfig {
  message: string;
}

export const useAutomationSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    sender_name: '',
    subject: '',
    body: ''
  });
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    message: ''
  });

  const fetchAutomationSettings = async () => {
    if (!user) return;
    
    try {
      // Buscar configurações de e-mail
      const { data: emailData } = await supabase
        .from('automation_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'email')
        .maybeSingle();
      
      if (emailData?.config_data) {
        const configData = emailData.config_data as unknown as EmailConfig;
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
        .maybeSingle();
      
      if (whatsappData?.config_data) {
        const configData = whatsappData.config_data as unknown as WhatsAppConfig;
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
          config_data: emailConfig as any,
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
          config_data: whatsappConfig as any,
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

  useEffect(() => {
    fetchAutomationSettings();
  }, [user]);

  return {
    loading,
    emailConfig,
    setEmailConfig,
    whatsappConfig,
    setWhatsappConfig,
    saveEmailSettings,
    saveWhatsAppSettings,
    fetchAutomationSettings
  };
};
