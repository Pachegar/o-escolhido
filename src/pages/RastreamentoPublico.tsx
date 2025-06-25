
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';

// Dados fictícios para demonstração
const demoTrackingData = {
  'BR123456789SP': {
    codigo: 'BR123456789SP',
    cliente: 'João Silva',
    loja: 'Loja Teste Demo',
    logo: null,
    progresso: 75,
    eventos: [
      {
        id: '1',
        data: '2024-01-15T09:00:00',
        mensagem: '🎉 Pedido confirmado! Estamos preparando seu produto com muito carinho.',
        local: 'São Paulo - SP',
        concluido: true
      },
      {
        id: '2',
        data: '2024-01-15T14:30:00',
        mensagem: '📦 Produto saiu da nossa central de distribuição rumo ao seu endereço!',
        local: 'São Paulo - SP',
        concluido: true
      },
      {
        id: '3',
        data: '2024-01-16T08:15:00',
        mensagem: '🚛 Seu pedido está em trânsito e chegará em breve. Fique de olho!',
        local: 'São Paulo - SP',
        concluido: true
      },
      {
        id: '4',
        data: '2024-01-17T10:00:00',
        mensagem: '🏠 Saiu para entrega! Nosso entregador está a caminho do seu endereço.',
        local: 'São Paulo - SP',
        concluido: false
      }
    ],
    estimativa: '17 de Janeiro, 2024',
    orderBump: []
  },
  'BR987654321RJ': {
    codigo: 'BR987654321RJ',
    cliente: 'Maria Santos',
    loja: 'Boutique Maria',
    logo: null,
    progresso: 90,
    eventos: [
      {
        id: '1',
        data: '2024-01-14T10:00:00',
        mensagem: '✨ Pedido recebido e confirmado! Obrigada pela confiança.',
        local: 'Rio de Janeiro - RJ',
        concluido: true
      },
      {
        id: '2',
        data: '2024-01-14T16:20:00',
        mensagem: '📋 Produto separado e embalado com cuidado especial.',
        local: 'Rio de Janeiro - RJ',
        concluido: true
      },
      {
        id: '3',
        data: '2024-01-15T11:45:00',
        mensagem: '🚚 Produto coletado pelos Correios e em trânsito.',
        local: 'Rio de Janeiro - RJ',
        concluido: true
      },
      {
        id: '4',
        data: '2024-01-16T09:30:00',
        mensagem: '🏃‍♂️ Saiu para entrega! Prepare-se para receber seu produto.',
        local: 'Rio de Janeiro - RJ',
        concluido: true
      }
    ],
    estimativa: '16 de Janeiro, 2024',
    orderBump: [
      {
        id: '1',
        nome: 'Bolsa Premium',
        imagem: '/lovable-uploads/4452a6b2-830b-4a8e-a618-22a587835250.png',
        precoOriginal: 159.90,
        precoPromocional: 99.90,
        ctaLink: 'https://loja.exemplo.com/bolsa',
        titulo: 'Oferta Especial Para Você!',
        subtitulo: 'Complete seu look com nossa bolsa premium'
      }
    ]
  },
  'BR456789123MG': {
    codigo: 'BR456789123MG',
    cliente: 'Carlos Oliveira',
    loja: 'TechStore BH',
    logo: null,
    progresso: 25,
    eventos: [
      {
        id: '1',
        data: '2024-01-16T09:15:00',
        mensagem: '🎯 Pedido recebido! Vamos preparar seu produto com máxima qualidade.',
        local: 'Belo Horizonte - MG',
        concluido: true
      },
      {
        id: '2',
        data: '2024-01-16T15:30:00',
        mensagem: '🔧 Produto em preparação. Verificando qualidade antes do envio.',
        local: 'Belo Horizonte - MG',
        concluido: false
      },
      {
        id: '3',
        data: '2024-01-17T10:00:00',
        mensagem: '📦 Produto será despachado em breve.',
        local: 'Belo Horizonte - MG',
        concluido: false
      }
    ],
    estimativa: '20 de Janeiro, 2024',
    orderBump: []
  },
  'BR789123456PR': {
    codigo: 'BR789123456PR',
    cliente: 'Ana Costa',
    loja: 'Fashion Curitiba',
    logo: null,
    progresso: 100,
    eventos: [
      {
        id: '1',
        data: '2024-01-12T16:45:00',
        mensagem: '💖 Pedido confirmado! Muito obrigada pela sua compra.',
        local: 'Curitiba - PR',
        concluido: true
      },
      {
        id: '2',
        data: '2024-01-13T09:20:00',
        mensagem: '✂️ Produto separado e embalado com todo cuidado.',
        local: 'Curitiba - PR',
        concluido: true
      },
      {
        id: '3',
        data: '2024-01-13T14:10:00',
        mensagem: '🚛 Produto coletado e em rota de entrega.',
        local: 'Curitiba - PR',
        concluido: true
      },
      {
        id: '4',
        data: '2024-01-14T11:30:00',
        mensagem: '🎉 Produto entregue com sucesso! Esperamos que você ame.',
        local: 'Curitiba - PR',
        concluido: true
      }
    ],
    estimativa: '14 de Janeiro, 2024',
    orderBump: []
  }
};

const RastreamentoPublico = () => {
  const { slug } = useParams();

  const { data: rastreamento, isLoading } = useQuery({
    queryKey: ['public-tracking', slug],
    queryFn: async () => {
      console.log('Tracking public page view for:', slug);
      
      // Verificar se é um código de demonstração
      if (slug && demoTrackingData[slug as keyof typeof demoTrackingData]) {
        return demoTrackingData[slug as keyof typeof demoTrackingData];
      }
      
      // Aqui seria a busca real no Supabase para códigos reais
      // Por enquanto, retornar dados mock para códigos não encontrados nos demos
      return {
        codigo: slug,
        cliente: 'Cliente Exemplo',
        loja: 'Loja Exemplo',
        logo: null,
        progresso: 50,
        eventos: [
          {
            id: '1',
            data: '2024-01-15T09:00:00',
            mensagem: '🎉 Pedido confirmado! Estamos preparando seu produto com muito carinho.',
            local: 'São Paulo - SP',
            concluido: true
          },
          {
            id: '2',
            data: '2024-01-15T14:30:00',
            mensagem: '📦 Produto em preparação.',
            local: 'São Paulo - SP',
            concluido: false
          }
        ],
        estimativa: '20 de Janeiro, 2024',
        orderBump: []
      };
    },
  });

  // Track page view
  useEffect(() => {
    if (slug) {
      console.log('Page view tracked for:', slug);
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando rastreamento...</p>
        </div>
      </div>
    );
  }

  if (!rastreamento) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2 text-white">Código não encontrado</h2>
            <p className="text-muted-foreground">
              O código de rastreamento informado não existe ou foi removido.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {rastreamento?.logo ? (
                <img 
                  src={rastreamento.logo} 
                  alt="Logo" 
                  className="h-10 w-auto"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">{rastreamento?.loja || 'RastreieTrack'}</h1>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-white">Rastreamento</h1>
              <p className="text-sm text-muted-foreground">{rastreamento?.codigo}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Badge */}
      {slug && demoTrackingData[slug as keyof typeof demoTrackingData] && (
        <div className="bg-blue-500/20 border-b border-blue-500/30">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-blue-400">💡</span>
              <span className="text-blue-400 font-medium">Página de demonstração</span>
              <span className="text-blue-300">- Visualização de como será a experiência do cliente</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            {/* Progress Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-white">
                Olá, {rastreamento.cliente}! 👋
              </h2>
              <p className="text-muted-foreground mb-6">
                Seu pedido está a caminho e chegará até <strong className="text-white">{rastreamento.estimativa}</strong>
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white">Progresso da entrega</span>
                  <span className="font-semibold text-white">{rastreamento.progresso}%</span>
                </div>
                <Progress value={rastreamento.progresso} className="h-4" />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Acompanhe seu pedido:</h3>
              
              <div className="space-y-4">
                {rastreamento.eventos.map((evento, index) => (
                  <div key={evento.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        evento.concluido 
                          ? 'bg-primary border-primary' 
                          : 'border-muted bg-background'
                      }`}></div>
                      {index !== rastreamento.eventos.length - 1 && (
                        <div className={`w-px h-16 mt-2 ${
                          evento.concluido ? 'bg-primary' : 'bg-border'
                        }`}></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <p className={`font-medium ${
                          evento.concluido ? 'text-white' : 'text-muted-foreground'
                        }`}>
                          {evento.mensagem}
                        </p>
                        <div className="text-xs text-muted-foreground sm:text-right">
                          <div>{new Date(evento.data).toLocaleDateString('pt-BR')}</div>
                          <div>{new Date(evento.data).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{evento.local}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OrderBump Section */}
        {rastreamento.orderBump && rastreamento.orderBump.length > 0 && (
          <Card className="glass-card mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                {rastreamento.orderBump[0].titulo}
              </h3>
              <p className="text-center text-muted-foreground mb-6">
                {rastreamento.orderBump[0].subtitulo}
              </p>
              
              <div className="grid gap-4">
                {rastreamento.orderBump.map((produto) => (
                  <div key={produto.id} className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                    <img 
                      src={produto.imagem} 
                      alt={produto.nome}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{produto.nome}</h4>
                      <div className="flex items-center gap-2">
                        {produto.precoPromocional && (
                          <span className="text-sm text-muted-foreground line-through">
                            R$ {produto.precoOriginal.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-primary">
                          R$ {(produto.precoPromocional || produto.precoOriginal).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <a 
                      href={produto.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Comprar
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-left">
                <p className="font-medium text-white">Dúvidas sobre sua entrega?</p>
                <p className="text-sm text-muted-foreground">
                  Entre em contato conosco através do WhatsApp ou email de suporte.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Rastreamento powered by{' '}
            <span className="text-primary font-semibold">RastreieTrack</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RastreamentoPublico;
