
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const Rastreamentos = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [cityFilter, setCityFilter] = useState('');

  const { data: rastreamentos, isLoading } = useQuery({
    queryKey: ['rastreamentos', user?.id],
    queryFn: async () => {
      // Mock data for demonstration
      return [
        {
          id: '1',
          codigo: 'BR123456789',
          cliente: 'João Silva',
          cidade: 'São Paulo',
          estado: 'SP',
          status: 'em_transito',
          created_at: '2024-01-15',
          clicks: 23
        },
        {
          id: '2',
          codigo: 'BR987654321',
          cliente: 'Maria Santos',
          cidade: 'Rio de Janeiro',
          estado: 'RJ',
          status: 'entregue',
          created_at: '2024-01-14',
          clicks: 45
        },
        {
          id: '3',
          codigo: 'BR456789123',
          cliente: 'Pedro Oliveira',
          cidade: 'Belo Horizonte',
          estado: 'MG',
          status: 'postado',
          created_at: '2024-01-16',
          clicks: 12
        }
      ];
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      postado: { label: 'Postado', variant: 'secondary' as const },
      em_transito: { label: 'Em trânsito', variant: 'default' as const },
      entregue: { label: 'Entregue', variant: 'default' as const },
      tentativa: { label: 'Tentativa', variant: 'destructive' as const }
    };
    
    const config = variants[status as keyof typeof variants] || variants.postado;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const copyLink = (codigo: string) => {
    const link = `${window.location.origin}/r/${codigo}`;
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  const filteredRastreamentos = rastreamentos?.filter((item) => {
    const matchesSearch = item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
    const matchesCity = !cityFilter || item.cidade.toLowerCase().includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCity;
  }) || [];

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
            <h1 className="text-3xl font-bold">Rastreamentos</h1>
            <p className="text-muted-foreground">Gerencie todos os seus códigos de rastreamento</p>
          </div>
          <Link to="/rastreamentos/criar">
            <Button className="hover-button">
              📦 Criar rastreamento
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
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
                  <SelectItem value="postado">Postado</SelectItem>
                  <SelectItem value="em_transito">Em trânsito</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="tentativa">Tentativa</SelectItem>
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
                    <TableHead>Código</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cliques</TableHead>
                    <TableHead>Criado</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRastreamentos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.codigo}</TableCell>
                      <TableCell>{item.cliente}</TableCell>
                      <TableCell>{item.cidade}, {item.estado}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.clicks}</TableCell>
                      <TableCell>{new Date(item.created_at).toLocaleDateString('pt-BR')}</TableCell>
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
                            onClick={() => copyLink(item.codigo)}
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
            </div>

            {filteredRastreamentos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold mb-2">Nenhum rastreamento encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {rastreamentos?.length === 0 
                    ? 'Crie seu primeiro rastreamento para começar'
                    : 'Tente ajustar os filtros de busca'
                  }
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
