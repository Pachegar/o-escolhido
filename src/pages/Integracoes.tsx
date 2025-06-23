
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Play } from 'lucide-react';
import { IntegrationForm } from '@/components/integrations/IntegrationForm';
import { useIntegrations, useCreateIntegration, useDisconnectIntegration } from '@/hooks/useIntegrations';

interface Platform {
  name: string;
  type: 'checkout' | 'gateway' | 'store';
  logo: string;
}

const platforms: Platform[] = [
  // Plataformas de Checkout
  { name: 'Yampi', type: 'checkout', logo: '🛒' },
  { name: 'CartPanda', type: 'checkout', logo: '🐼' },
  
  // Plataformas de Gateway
  { name: 'AppMax', type: 'gateway', logo: '💳' },
  { name: 'Pagar.me', type: 'gateway', logo: '💰' },
  { name: 'Converte.me', type: 'gateway', logo: '🔄' },
  { name: 'Mercado Pago', type: 'gateway', logo: '🏪' },
  
  // Plataformas de Loja
  { name: 'Shopify', type: 'store', logo: '🛍️' },
  { name: 'WooCommerce', type: 'store', logo: '🌐' },
  { name: 'Nuvemshop', type: 'store', logo: '☁️' },
  { name: 'Loja Integrada', type: 'store', logo: '🔗' },
];

const platformTypeLabels = {
  checkout: '🧾 Plataformas de Checkout',
  gateway: '💳 Plataformas de Gateway',
  store: '🛒 Plataformas de Loja',
};

const Integracoes = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const { data: integrations = [], isLoading } = useIntegrations();
  const createIntegration = useCreateIntegration();
  const disconnectIntegration = useDisconnectIntegration();

  const activeIntegration = integrations.find(integration => integration.is_active);
  const hasActiveIntegration = !!activeIntegration;

  const handleConnectPlatform = (platform: Platform) => {
    if (hasActiveIntegration) {
      return; // Não permitir conectar se já tem integração ativa
    }
    setSelectedPlatform(platform);
  };

  const handleFormSubmit = async (configData: Record<string, any>) => {
    if (!selectedPlatform) return;
    
    await createIntegration.mutateAsync({
      platform_name: selectedPlatform.name,
      platform_type: selectedPlatform.type,
      config_data: configData,
    });
    
    setSelectedPlatform(null);
  };

  const handleDisconnect = async () => {
    if (activeIntegration) {
      await disconnectIntegration.mutateAsync(activeIntegration.id);
    }
  };

  const isPlatformConnected = (platformName: string) => {
    return activeIntegration?.platform_name === platformName;
  };

  const groupedPlatforms = platforms.reduce((acc, platform) => {
    if (!acc[platform.type]) {
      acc[platform.type] = [];
    }
    acc[platform.type].push(platform);
    return acc;
  }, {} as Record<string, Platform[]>);

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-96"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedPlatform) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <IntegrationForm
            platformName={selectedPlatform.name}
            platformType={selectedPlatform.type}
            onSubmit={handleFormSubmit}
            onCancel={() => setSelectedPlatform(null)}
            isLoading={createIntegration.isPending}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Integre sua loja, checkout ou plataforma de pagamento à Pachegar
          </h1>
          <p className="text-muted-foreground">
            Conecte sua plataforma para automatizar a criação de rastreamentos
          </p>
        </div>

        {/* Status da Integração Ativa */}
        {hasActiveIntegration && (
          <Card className="glass-card border-green-500/50 bg-green-500/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {activeIntegration.platform_name} conectado
                    </p>
                    <p className="text-sm text-green-200">
                      Sua integração está ativa e funcionando
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={disconnectIntegration.isPending}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  {disconnectIntegration.isPending ? 'Desconectando...' : 'Desconectar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plataformas por Categoria */}
        <div className="space-y-8">
          {Object.entries(groupedPlatforms).map(([type, platformList]) => (
            <div key={type} className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                {platformTypeLabels[type as keyof typeof platformTypeLabels]}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {platformList.map((platform) => {
                  const isConnected = isPlatformConnected(platform.name);
                  const isDisabled = hasActiveIntegration && !isConnected;
                  
                  return (
                    <Card
                      key={platform.name}
                      className={`glass-card cursor-pointer transition-all duration-200 hover:scale-105 ${
                        isConnected 
                          ? 'border-green-500/50 bg-green-500/10' 
                          : isDisabled 
                            ? 'opacity-50 cursor-not-allowed hover:scale-100' 
                            : 'hover:border-primary/50'
                      }`}
                      onClick={() => !isDisabled && handleConnectPlatform(platform)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{platform.logo}</div>
                        <h3 className="font-medium text-white mb-2">{platform.name}</h3>
                        
                        {isConnected ? (
                          <div className="flex items-center justify-center gap-2 text-green-400">
                            <Check className="h-4 w-4" />
                            <span className="text-sm">Conectado</span>
                          </div>
                        ) : (
                          <Button
                            variant={isDisabled ? "secondary" : "outline"}
                            size="sm"
                            className={isDisabled ? "cursor-not-allowed" : "hover-button"}
                            disabled={isDisabled}
                          >
                            {isDisabled ? 'Indisponível' : 'Conectar'}
                          </Button>
                        )}
                        
                        {isDisabled && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Você já tem uma integração ativa
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Seção de Vídeos Explicativos */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              📺 Aprenda a integrar
            </h2>
            <p className="text-muted-foreground mb-6">
              Assista aos nossos tutoriais passo a passo para configurar cada integração
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.slice(0, 6).map((platform) => (
                <Card key={platform.name} className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center mb-3">
                      <Play className="h-8 w-8 text-white/70" />
                    </div>
                    <h4 className="font-medium text-white text-sm">
                      Como integrar {platform.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tutorial em vídeo - Em breve
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Integracoes;
