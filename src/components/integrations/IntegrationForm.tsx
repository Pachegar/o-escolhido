
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface IntegrationFormProps {
  platformName: string;
  platformType: 'checkout' | 'gateway' | 'store';
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const getFormFields = (platformName: string) => {
  const fields: Record<string, { label: string; type: string; placeholder: string; required: boolean }[]> = {
    'Yampi': [
      { label: 'API Token', type: 'text', placeholder: 'Seu token da API Yampi', required: true },
      { label: 'Alias da Loja', type: 'text', placeholder: 'alias-da-sua-loja', required: true },
    ],
    'CartPanda': [
      { label: 'API Key', type: 'text', placeholder: 'Sua chave API CartPanda', required: true },
      { label: 'Secret Key', type: 'password', placeholder: 'Sua chave secreta', required: true },
    ],
    'AppMax': [
      { label: 'Client ID', type: 'text', placeholder: 'Seu Client ID AppMax', required: true },
      { label: 'Client Secret', type: 'password', placeholder: 'Seu Client Secret', required: true },
    ],
    'Pagar.me': [
      { label: 'API Key', type: 'text', placeholder: 'Sua chave API Pagar.me', required: true },
      { label: 'Encryption Key', type: 'password', placeholder: 'Sua chave de encriptação', required: true },
    ],
    'Converte.me': [
      { label: 'API Token', type: 'text', placeholder: 'Seu token Converte.me', required: true },
      { label: 'Webhook URL', type: 'url', placeholder: 'URL do webhook (opcional)', required: false },
    ],
    'Mercado Pago': [
      { label: 'Access Token', type: 'text', placeholder: 'Seu Access Token Mercado Pago', required: true },
      { label: 'Public Key', type: 'text', placeholder: 'Sua Public Key', required: true },
    ],
    'Shopify': [
      { label: 'Nome da Loja', type: 'text', placeholder: 'minha-loja', required: true },
      { label: 'API Key', type: 'text', placeholder: 'Sua API Key Shopify', required: true },
      { label: 'API Secret', type: 'password', placeholder: 'Seu API Secret', required: true },
    ],
    'WooCommerce': [
      { label: 'URL da Loja', type: 'url', placeholder: 'https://minha-loja.com', required: true },
      { label: 'Consumer Key', type: 'text', placeholder: 'ck_xxxxxxxxxx', required: true },
      { label: 'Consumer Secret', type: 'password', placeholder: 'cs_xxxxxxxxxx', required: true },
    ],
    'Nuvemshop': [
      { label: 'User ID', type: 'text', placeholder: 'Seu User ID Nuvemshop', required: true },
      { label: 'Access Token', type: 'text', placeholder: 'Seu Access Token', required: true },
    ],
    'Loja Integrada': [
      { label: 'Chave de Aplicação', type: 'text', placeholder: 'Sua chave de aplicação', required: true },
      { label: 'Chave de Usuário', type: 'text', placeholder: 'Sua chave de usuário', required: true },
    ],
  };

  return fields[platformName] || [];
};

export const IntegrationForm: React.FC<IntegrationFormProps> = ({
  platformName,
  platformType,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const fields = getFormFields(platformName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar campos obrigatórios
    const requiredFields = fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.label]);
    
    if (missingFields.length > 0) {
      return;
    }
    
    onSubmit(formData);
  };

  const handleInputChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  return (
    <Card className="glass-card w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Conectar {platformName}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.label} className="space-y-2">
              <Label htmlFor={field.label} className="text-white">
                {field.label}
                {field.required && <span className="text-red-400"> *</span>}
              </Label>
              <Input
                id={field.label}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.label] || ''}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
                required={field.required}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          ))}
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 hover-button glow-button"
              disabled={isLoading}
            >
              {isLoading ? 'Conectando...' : 'Conectar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
