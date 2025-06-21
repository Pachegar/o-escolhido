
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';

const RastreamentoPublico = () => {
  const { slug } = useParams();

  const { data: rastreamento, isLoading } = useQuery({
    queryKey: ['public-tracking', slug],
    queryFn: async () => {
      // Here you would fetch from Supabase and increment click count
      console.log('Tracking public page view for:', slug);
      
      // Mock data for demonstration
      return {
        codigo: slug,
        cliente: 'João Silva',
        logo: null, // Could be a custom logo URL
        progresso: 75,
        eventos: [
          {
            id: '1',
            data: '2024-01-15T09:00:00',
            mensagem: '🎉 Pedido confirmado! Estamos preparando seu produto com muito carinho.',
            local: 'Cotia - SP',
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
        estimativa: '17 de Janeiro, 2024'
      };
    },
  });

  // Track page view
  useEffect(() => {
    if (slug) {
      // Here you would increment the click counter in Supabase
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
            <h2 className="text-xl font-semibold mb-2">Código não encontrado</h2>
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
                <img 
                  src="/lovable-uploads/4abe2cf8-daf0-4fdb-ad47-074c17544f3c.png" 
                  alt="Pachegar" 
                  className="h-10 w-auto"
                />
              )}
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold">Rastreamento</h1>
              <p className="text-sm text-muted-foreground">{rastreamento?.codigo}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            {/* Progress Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">
                Olá, {rastreamento.cliente}! 👋
              </h2>
              <p className="text-muted-foreground mb-6">
                Seu pedido está a caminho e chegará até <strong>{rastreamento.estimativa}</strong>
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progresso da entrega</span>
                  <span className="font-semibold">{rastreamento.progresso}%</span>
                </div>
                <Progress value={rastreamento.progresso} className="h-4" />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Acompanhe seu pedido:</h3>
              
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
                          evento.concluido ? 'text-foreground' : 'text-muted-foreground'
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

        {/* Info Card */}
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-left">
                <p className="font-medium">Dúvidas sobre sua entrega?</p>
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
            <span className="text-primary font-semibold">Pachegar</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RastreamentoPublico;
