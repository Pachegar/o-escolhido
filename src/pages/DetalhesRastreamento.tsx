
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const DetalhesRastreamento = () => {
  const { id } = useParams();

  const { data: rastreamento, isLoading } = useQuery({
    queryKey: ['rastreamento', id],
    queryFn: async () => {
      // Mock data for demonstration
      return {
        id: id,
        codigo: 'BR123456789',
        cliente: 'João Silva',
        cidade: 'São Paulo',
        estado: 'SP',
        status: 'em_transito',
        created_at: '2024-01-15',
        clicks: 23,
        linkPublico: `/r/BR123456789`,
        eventos: [
          {
            id: '1',
            data: '2024-01-15T09:00:00',
            mensagem: 'Objeto postado nos Correios',
            local: 'Cotia - SP'
          },
          {
            id: '2',
            data: '2024-01-15T14:30:00',
            mensagem: 'Objeto em trânsito para unidade de distribuição',
            local: 'São Paulo - SP'
          },
          {
            id: '3',
            data: '2024-01-16T08:15:00',
            mensagem: 'Objeto saiu para entrega',
            local: 'São Paulo - SP'
          }
        ]
      };
    },
  });

  const copyLink = () => {
    const link = `https://rastreietrack.com.br${rastreamento?.linkPublico}`;
    navigator.clipboard.writeText(link);
    // Add toast notification here
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      postado: { label: 'Postado', variant: 'secondary' as const },
      em_transito: { label: 'Em trânsito', variant: 'default' as const },
      eminente_entrega: { label: 'Eminente Entrega', variant: 'default' as const },
      em_atraso: { label: 'Em Atraso', variant: 'destructive' as const }
    };
    
    const config = variants[status as keyof typeof variants] || variants.postado;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!rastreamento) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="glass-card">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold mb-2">Rastreamento não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                O rastreamento solicitado não existe ou foi removido.
              </p>
              <Link to="/rastreamentos">
                <Button className="hover-button">
                  Voltar para rastreamentos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{rastreamento.codigo}</h1>
            <p className="text-muted-foreground">Detalhes do rastreamento</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/rastreamentos/${id}/editar`}>
              <Button variant="outline" className="hover-button">
                ✏️ Editar
              </Button>
            </Link>
            <Button
              onClick={copyLink}
              className="hover-button"
            >
              🔗 Copiar link
            </Button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-white">{rastreamento.cliente}</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Destino</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-white">{rastreamento.cidade}, {rastreamento.estado}</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge(rastreamento.status)}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cliques</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-white">{rastreamento.clicks}</p>
              <p className="text-sm text-muted-foreground">no link público</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Linha do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rastreamento.eventos.map((evento, index) => (
                <div key={evento.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-primary' : 'bg-muted'
                    }`}></div>
                    {index !== rastreamento.eventos.length - 1 && (
                      <div className="w-px h-12 bg-border mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-medium text-white">{evento.mensagem}</p>
                        <p className="text-sm text-muted-foreground">{evento.local}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(evento.data).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Public Link Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Link Público</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-sm text-white">
                https://rastreietrack.com.br{rastreamento.linkPublico}
              </code>
              <Button
                size="sm"
                onClick={copyLink}
                className="hover-button"
              >
                📋 Copiar
              </Button>
              <a
                href={`https://rastreietrack.com.br${rastreamento.linkPublico}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="hover-button"
                >
                  🔗 Abrir
                </Button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Compartilhe este link com seu cliente para que ele possa acompanhar o rastreamento.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DetalhesRastreamento;
