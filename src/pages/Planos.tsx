
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const planos = [
  {
    name: 'Peixe',
    price: 'R$ 49,90/mês',
    trackings: 60,
    features: [
      '60 rastreamentos por mês',
      'Páginas públicas básicas',
      'Suporte por email',
      'Tom de voz neutro'
      'Acesso exclusivo ao grupo networking peixes'
    ],
    current: true,
    upgrade: false
  },
  {
    name: 'Cavalo-marinho',
    price: 'R$ 97,90/mês',
    trackings: 200,
    features: [
      '200 rastreamentos por mês',
      'Cores personalizadas na página de rastreio',
      'Logo da sua loja na página de rastreio',
      'Todos os tons de voz',
      'Suporte prioritário',
      'Acesso exclusivo ao grupo networking cavalo-marinho'
    ],
    current: false,
    upgrade: true,
    popular: true
  },
  {
    name: 'Golfinho',
    price: 'R$ 49,90/mês',
    trackings: 500,
    features: [
      '500 rastreamentos por mês',
      'Subdomínio personalizado na página de rastreio',
      'Todas as funcionalidades anteriores',
      'Analytics avançados enviadas por e-mail',
      'Automação de envio de rastreio pelo e-mail',
      'Acesso exclusivo ao grupo networking golfinho'
    ],
    current: false,
    upgrade: true
  },
  {
    name: 'Tubarão',
    price: 'R$ 99,90/mês',
    trackings: 'Ilimitado',
    features: [
      'Rastreamentos ilimitados',
      'Domínio customizado',
      'Todas as funcionalidades anteriores',
      'Suporte 24/7',
      'Gerente de conta dedicado',
      'Automação de envio de rastreio pelo WhatsApp',
      'Acesso exclusivo ao grupo networking tubarão'
    ],
    current: false,
    upgrade: true
  }
];

const Planos = () => {
  const currentPlan = planos.find(p => p.current);
  const usagePercentage = 75; // Mock current usage

  const handleUpgrade = (planName: string) => {
    // Here you would integrate with Stripe
    console.log('Upgrading to:', planName);
    window.open('https://stripe.com', '_blank');
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Planos e Assinatura</h1>
          <p className="text-muted-foreground">Escolha o plano ideal para o seu negócio</p>
        </div>

        {/* Current Plan Status */}
        {currentPlan && (
          <Card className="glass-card border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Plano Atual: {currentPlan.name}</CardTitle>
                <Badge variant="outline">Ativo</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Uso mensal</span>
                  <span>45 de {currentPlan.trackings} rastreamentos</span>
                </div>
                <Progress value={usagePercentage} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-xs text-muted-foreground">Utilizados</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-xs text-muted-foreground">Restantes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Dias de teste</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">892</p>
                  <p className="text-xs text-muted-foreground">Total de cliques</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {planos.map((plano) => (
            <Card 
              key={plano.name} 
              className={`glass-card relative ${
                plano.popular ? 'border-primary shadow-lg scale-105' : ''
              } ${plano.current ? 'border-green-500' : ''}`}
            >
              {plano.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">
                  {plano.name === 'Peixe' && '🐟'}
                  {plano.name === 'Cavalo-marinho' && '🦄'}
                  {plano.name === 'Golfinho' && '🐬'}
                  {plano.name === 'Tubarão' && '🦈'}
                </div>
                <CardTitle className="text-xl">{plano.name}</CardTitle>
                <div className="text-2xl font-bold text-primary">{plano.price}</div>
                <p className="text-sm text-muted-foreground">
                  {typeof plano.trackings === 'number' 
                    ? `${plano.trackings} rastreamentos`
                    : plano.trackings
                  }
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plano.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plano.current ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled
                  >
                    Plano Atual
                  </Button>
                ) : plano.upgrade ? (
                  <Button 
                    className="w-full hover-button"
                    onClick={() => handleUpgrade(plano.name)}
                  >
                    Fazer Upgrade
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled
                  >
                    Downgrade
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Comparação de Recursos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3">Recurso</th>
                    <th className="text-center py-3">🐟 Peixe</th>
                    <th className="text-center py-3">🦄 Cavalo-marinho</th>
                    <th className="text-center py-3">🐬 Golfinho</th>
                    <th className="text-center py-3">🦈 Tubarão</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-border/50">
                    <td className="py-3">Rastreamentos/mês</td>
                    <td className="text-center">60</td>
                    <td className="text-center">200</td>
                    <td className="text-center">500</td>
                    <td className="text-center">∞</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Logo personalizado</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Cor de destaque</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Subdomínio</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Domínio customizado</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Como funciona o período de teste?</h4>
              <p className="text-sm text-muted-foreground">
                Todos os novos usuários têm 7 dias gratuitos no plano Peixe para testar a plataforma.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Posso cancelar a qualquer momento?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, você pode cancelar sua assinatura a qualquer momento. Não há fidelidade.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">O que acontece se eu exceder o limite?</h4>
              <p className="text-sm text-muted-foreground">
                Quando atingir o limite do plano, você precisará fazer upgrade ou aguardar o próximo ciclo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Planos;
