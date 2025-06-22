
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { useTrackings } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Rastreamentos = () => {
  const { user } = useAuth();
  const { data: trackings, isLoading, error } = useTrackings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [cityFilter, setCityFilter] = useState('');

  const getStatusBadge = (status: string) => {
    const variants = {
      'Postado': { label: 'Postado', variant: 'secondary' as const },
      'Coletado': { label: 'Coletado', variant: 'default' as const },
      'Em trânsito': { label: 'Em trânsito', variant: 'default' as const },
      'Saiu para entrega': { label: 'Saiu para entrega', variant: 'default' as const },
      'Entregue': { label: 'Entregue', variant: 'default' as const },
      'Em atraso': { label: 'Em Atraso', variant: 'destructive' as const }
    };
    
    const config = variants[status as keyof typeof variants] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const copyLink = (codigo: string) => {
    const link = `${window.location.origin}/rastreamento/${codigo}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "O link do rastreamento foi copiado para a área de transferência.",
    });
  };

  const filteredTrackings = trackings?.filter((item) => {
    const matchesSearch = item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tracking_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || item.current_status === statusFilter;
    const matchesCity = !cityFilter || item.destination_city.toLowerCase().includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCity;
  }) || [];

  // Estados de carregamento
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </Layout>
    );
  }

  // Tratamento de erros
  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="glass-card border-red-500/50 bg-red-500/10">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Erro ao carregar rastreamentos</h3>
              <p className="text-muted-foreground mb-4">
                Não foi possível carregar seus rastreamentos. Tente recarregar a página.
              </p>
              <Button onClick={() => window.location.reload()} className="hover-button">
                Recarregar página
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Se não há usuário logado
  if (!user) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Acesso necessário</h3>
              <p className="text-muted-foreground mb-4">
                Faça login para acessar seus rastreamentos.
              </p>
              <Link to="/login">
                <Button className="hover-button">
                  Fazer login
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
            <h1 className="text-3xl font-bold text-white">Rastreamentos</h1>
            <p className="text-muted-foreground">
              {trackings?.length === 0 
                ? 'Você ainda não possui rastreamentos' 
                : `Gerencie seus ${trackings?.length} códigos de rastreamento`
              }
            </p>
          </div>
          <Link to="/rastreamentos/criar">
            <Button className="hover-button">
              📦 Criar rastreamento
            </Button>
          </Link>
        </div>

        {/* Exibir filtros apenas se houver rastreamentos */}
        {trackings && trackings.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Buscar por cliente ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="Postado">Postado</SelectItem>
                    <SelectItem value="Coletado">Coletado</SelectItem>
                    <SelectItem value="Em trânsito">Em trânsito</SelectItem>
                    <SelectItem value="Saiu para entrega">Saiu para entrega</SelectItem>
                    <SelectItem value="Entregue">Entregue</SelectItem>
                    <SelectItem value="Em atraso">Em Atraso</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Filtrar por cidade..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                />

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('todos');
                    setCityFilter('');
                  }}
                  className="hover-button"
                >
                  Limpar filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table ou Estado Vazio */}
        <Card className="glass-card">
          <CardContent className="p-0">
            {trackings && trackings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Código</TableHead>
                      <TableHead className="text-white">Cliente</TableHead>
                      <TableHead className="text-white">Destino</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Cliques</TableHead>
                      <TableHead className="text-white">Criado</TableHead>
                      <TableHead className="text-white">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrackings.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-white">{item.tracking_code}</TableCell>
                        <TableCell className="text-white">{item.customer_name}</TableCell>
                        <TableCell className="text-white">{item.destination_city}, {item.destination_state}</TableCell>
                        <TableCell>{getStatusBadge(item.current_status)}</TableCell>
                        <TableCell className="text-white">{item.clicks || 0}</TableCell>
                        <TableCell className="text-white">{new Date(item.created_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link to={`/rastreamentos/${item.id}`}>
                              <Button variant="outline" size="sm" className="hover-button">
                                👁️
                              </Button>
                            </Link>
                            <Link to={`/rastreamentos/${item.id}/editar`}>
                              <Button variant="outline" size="sm" className="hover-button">
                                ✏️
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyLink(item.tracking_code)}
                              className="hover-button"
                            >
                              🔗
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Mensagem quando filtros não retornam resultados */}
                {filteredTrackings.length === 0 && trackings.length > 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Nenhum resultado encontrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Tente ajustar os filtros de busca para encontrar seus rastreamentos.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('todos');
                        setCityFilter('');
                      }}
                      className="hover-button"
                    >
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              // Estado vazio - nenhum rastreamento criado
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold mb-2 text-white">Nenhum rastreamento encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não criou nenhum rastreamento. Comece criando seu primeiro código de rastreamento personalizado.
                </p>
                <Link to="/rastreamentos/criar">
                  <Button className="hover-button glow-button">
                    📦 Criar primeiro rastreamento
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Rastreamentos;
