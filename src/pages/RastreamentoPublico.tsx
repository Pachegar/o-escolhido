
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
    orderBump: [
      {
        id: '1',
        nome: 'Camiseta Premium',
        imagem: '/lovable-uploads/4452a6b2-830b-4a8e-a618-22a587835250.png',
        precoOriginal: 89.90,
        precoPromocional: 59.90,
        ctaLink: 'https://loja.exemplo.com/camiseta',
        titulo: 'Oferta Especial Para Você!',
        subtitulo: 'Aproveite enquanto seu pedido não chegou!'
      },
      {
        id: '2',
        nome: 'Tênis Esportivo',
        imagem: '/lovable-uploads/4452a6b2-830b-4a8e-a618-22a587835250.png',
        precoOriginal: 159.90,
        precoPromocional: 119.90,
        ctaLink: 'https://loja.exemplo.com/tenis',
        titulo: 'Oferta Especial Para Você!',
        subtitulo: 'Complete seu look!'
      }
    ],
    footerConfig: {
      showWebsite: true,
      websiteUrl: 'https://lojaexemplo.com.br',
      showWhatsApp: true,
      whatsappNumber: '+55 11 99999-9999',
      showEmail: false,
      emailContact: ''
    },
    nomeLoja: 'Minha Loja Virtual'
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
    ],
    footerConfig: {
      showWebsite: false,
      websiteUrl: '',
      showWhatsApp: true,
      whatsappNumber: '+55 21 98888-8888',
      showEmail: true,
      emailContact: 'contato@boutiquemaria.com.br'
    },
    nomeLoja: 'Boutique Elegante'
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
    orderBump: [],
    footerConfig: {
      showWebsite: true,
      websiteUrl: 'https://techstorebh.com.br',
      showWhatsApp: false,
      whatsappNumber: '',
      showEmail: true,
      emailContact: 'suporte@techstorebh.com.br'
    },
    nomeLoja: ''
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
    orderBump: [],
    footerConfig: {
      showWebsite: false,
      websiteUrl: '',
      showWhatsApp: false,
      whatsappNumber: '',
      showEmail: false,
      emailContact: ''
    },
    nomeLoja: 'Fashion Premium'
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
        orderBump: [],
        footerConfig: {
          showWebsite: false,
          websiteUrl: '',
          showWhatsApp: false,
          whatsappNumber: '',
          showEmail: false,
          emailContact: ''
        },
        nomeLoja: ''
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando rastreamento...</p>
        </div>
      </div>
    );
  }

  if (!rastreamento) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-gray-200 bg-white">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Código não encontrado</h2>
            <p className="text-gray-600">
              O código de rastreamento informado não existe ou foi removido.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine store name to display
  const displayStoreName = rastreamento.nomeLoja || rastreamento.loja || 'Loja do Lojista';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
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
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">{displayStoreName}</h1>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-900">Rastreamento</h1>
              <p className="text-sm text-gray-600">{rastreamento?.codigo}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Badge */}
      {slug && demoTrackingData[slug as keyof typeof demoTrackingData] && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-blue-600">💡</span>
              <span className="text-blue-600 font-medium">Página de demonstração</span>
              <span className="text-blue-500">- Visualização de como será a experiência do cliente</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border border-gray-200 bg-white mb-6">
          <CardContent className="p-6">
            {/* Progress Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                Olá, {rastreamento.cliente}! 👋
              </h2>
              <p className="text-gray-600 mb-6">
                Seu pedido está a caminho e chegará até <strong className="text-gray-900">{rastreamento.estimativa}</strong>
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-900">Progresso da entrega</span>
                  <span className="font-semibold text-gray-900">{rastreamento.progresso}%</span>
                </div>
                <Progress value={rastreamento.progresso} className="h-4" />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Acompanhe seu pedido:</h3>
              
              <div className="space-y-4">
                {rastreamento.eventos.map((evento, index) => (
                  <div key={evento.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        evento.concluido 
                          ? 'bg-black border-black' 
                          : 'border-gray-300 bg-white'
                      }`}></div>
                      {index !== rastreamento.eventos.length - 1 && (
                        <div className={`w-px h-16 mt-2 ${
                          evento.concluido ? 'bg-black' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <p className={`font-medium ${
                          evento.concluido ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {evento.mensagem}
                        </p>
                        <div className="text-xs text-gray-500 sm:text-right">
                          <div>{new Date(evento.data).toLocaleDateString('pt-BR')}</div>
                          <div>{new Date(evento.data).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{evento.local}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OrderBump Section */}
        {rastreamento.orderBump && rastreamento.orderBump.length > 0 && (
          <Card className="border border-gray-200 bg-white mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {rastreamento.orderBump[0].titulo}
              </h3>
              <p className="text-center text-gray-600 mb-6">
                {rastreamento.orderBump[0].subtitulo}
              </p>
              
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {rastreamento.orderBump.map((produto) => (
                  <div key={produto.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img 
                      src={produto.imagem} 
                      alt={produto.nome}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-gray-900 mb-2">{produto.nome}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      {produto.precoPromocional && produto.precoPromocional < produto.precoOriginal && (
                        <span className="text-sm text-gray-500 line-through">
                          R$ {produto.precoOriginal.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-black">
                        R$ {(produto.precoPromocional || produto.precoOriginal).toFixed(2)}
                      </span>
                    </div>
                    <a 
                      href={produto.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-center block"
                    >
                      Comprar agora
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">Dúvidas sobre sua entrega?</p>
                <p className="text-sm text-gray-600">
                  Entre em contato conosco através do WhatsApp ou email de suporte.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Custom Footer */}
      {rastreamento.footerConfig && (
        rastreamento.footerConfig.showWebsite || 
        rastreamento.footerConfig.showWhatsApp || 
        rastreamento.footerConfig.showEmail
      ) && (
        <div className="border-t border-gray-200 mt-8 py-6 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              {rastreamento.footerConfig.showWebsite && rastreamento.footerConfig.websiteUrl && (
                <a 
                  href={rastreamento.footerConfig.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-600 font-medium"
                >
                  🌐 Visitar site
                </a>
              )}
              
              {rastreamento.footerConfig.showWhatsApp && rastreamento.footerConfig.whatsappNumber && (
                <a 
                  href={`https://wa.me/${rastreamento.footerConfig.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-600 font-medium"
                >
                  📱 WhatsApp
                </a>
              )}
              
              {rastreamento.footerConfig.showEmail && rastreamento.footerConfig.emailContact && (
                <a 
                  href={`mailto:${rastreamento.footerConfig.emailContact}`}
                  className="text-black hover:text-gray-600 font-medium"
                >
                  ✉️ E-mail
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            Rastreamento powered by{' '}
            <span className="text-black font-semibold">RastreieTrack</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RastreamentoPublico;
