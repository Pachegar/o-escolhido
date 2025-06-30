import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useTrackings, useDeleteTracking } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Pencil } from 'lucide-react';

// Dados fictícios para demonstração
const demoTrackings = [
  {
    id: 'demo-1',
    tracking_code: 'BR123456789SP',
    customer_name: 'João Silva',
    destination_city: 'São Paulo',
    destination_state: 'SP',
    current_status: 'Em trânsito',
    clicks: 15,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'demo-2',
    tracking_code: 'BR987654321RJ',
    customer_name: 'Maria Santos',
    destination_city: 'Rio de Janeiro',
    destination_state: 'RJ',
    current_status: 'Saiu para entrega',
    clicks: 23,
    created_at: '2024-01-14T14:20:00Z'
  },
  {
    id: 'demo-3',
    tracking_code: 'BR456789123MG',
    customer_name: 'Carlos Oliveira',
    destination_city: 'Belo Horizonte',
    destination_state: 'MG',
    current_status: 'Postado',
    clicks: 8,
    created_at: '2024-01-16T09:15:00Z'
  },
  {
    id: 'demo-4',
    tracking_code: 'BR789123456PR',
    customer_name: 'Ana Costa',
    destination_city: 'Curitiba',
    destination_state: 'PR',
    current_status: 'Entregue',
    clicks: 31,
    created_at: '2024-01-12T16:45:00Z'
  }
];

const Rastreamentos = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [cityFilter, setCityFilter] = useState('');

  const { data: realTrackings, isLoading } = useTrackings();
  const deleteTrackingMutation = useDeleteTracking();

  // Combinar dados reais com dados fictícios
  const allTrackings = [...demoTrackings, ...(realTrackings || [])];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Postado': { label: 'Postado', variant: 'secondary' as const },
      'Em trânsito': { label: 'Em trânsito', variant: 'default' as const },
      'Saiu para entrega': { label: 'Saiu para entrega', variant: 'default' as const },
      'Eminente Entrega': { label: 'Eminente Entrega', variant: 'default' as const },
      'Em Atraso': { label: 'Em Atraso', variant: 'destructive' as const },
      'Entregue': { label: 'Entregue', variant: 'default' as const }
    };
    
    const config = variants[status as keyof typeof variants] || variants['Postado'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const copyLink = (codigo: string) => {
    const link = `${window.location.origin}/r/${codigo}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "O link de rastreamento foi copiado para a área de transferência.",
    });
  };

  const openPublicPage = (codigo: string) => {
    const link = `${window.location.origin}/r/${codigo}`;
    window.open(link, '_blank');
  };

  const handleDelete = async (id: string) => {
    // Não permitir deletar dados de demonstração
    if (id.startsWith('demo-')) {
      toast({
        title: "Ação não permitida",
        description: "Não é possível excluir rastreamentos de demonstração.",
        variant: "destructive",
      });
      return;
    }
    
    if (!confirm('Tem certeza que deseja excluir este rastreamento?')) return;
    deleteTrackingMutation.mutate(id);
  };

  const filteredRastreamentos = allTrackings.filter((item) => {
    const matchesSearch = item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tracking_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || item.current_status === statusFilter;
    const matchesCity = !cityFilter || item.destination_city.toLowerCase().includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCity;
  });

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

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Rastreamentos</h1>
            <p className="text-muted-foreground">Gerencie todos os seus códigos de rastreamento</p>
          </div>
          <Link to="/rastreamentos/criar">
            <Button className="hover-button">
              📦 Criar rastreamento
            </Button>
          </Link>
        </div>

        {/* Demo Alert */}
        <Card className="border-blue-500/50 bg-blue-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium text-white">Demonstração Ativa</p>
                <p className="text-sm text-muted-foreground">
                  Os rastreamentos abaixo incluem dados fictícios para demonstração. 
                  Clique em "Ver público" para visualizar como será a experiência do cliente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
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
                  <SelectItem value="Em trânsito">Em trânsito</SelectItem>
                  <SelectItem value="Saiu para entrega">Saiu para entrega</SelectItem>
                  <SelectItem value="Eminente Entrega">Eminente Entrega</SelectItem>
                  <SelectItem value="Em Atraso">Em Atraso</SelectItem>
                  <SelectItem value="Entregue">Entregue</SelectItem>
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

        {/* Table */}
        <Card className="glass-card">
          <CardContent className="p-0">
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
                  {filteredRastreamentos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-white">{item.tracking_code}</TableCell>
                      <TableCell className="text-white">{item.customer_name}</TableCell>
                      <TableCell className="text-white">{item.destination_city}, {item.destination_state}</TableCell>
                      <TableCell>{getStatusBadge(item.current_status)}</TableCell>
                      <TableCell className="text-white">{item.clicks || 0}</TableCell>
                      <TableCell className="text-white">{new Date(item.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!item.id.startsWith('demo-') && (
                            <>
                              <Link to={`/rastreamentos/${item.id}`}>
                                <Button variant="outline" size="sm" className="hover-button">
                                  👁️
                                </Button>
                              </Link>
                              <Link to={`/rastreamentos/${item.id}/editar`}>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="hover-button bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
                                  title="Editar mensagens"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </Link>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPublicPage(item.tracking_code)}
                            className="hover-button bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
                            title="Ver página pública"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyLink(item.tracking_code)}
                            className="hover-button"
                          >
                            🔗
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            disabled={deleteTrackingMutation.isPending}
                          >
                            🗑️
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRastreamentos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold mb-2 text-white">Nenhum rastreamento encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros de busca
                </p>
                <Link to="/rastreamentos/criar">
                  <Button className="hover-button">
                    Criar primeiro rastreamento
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
