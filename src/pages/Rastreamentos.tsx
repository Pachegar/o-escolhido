
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

const Rastreamentos = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [cityFilter, setCityFilter] = useState('');

  const { data: rastreamentos, isLoading } = useTrackings();
  const deleteTrackingMutation = useDeleteTracking();

  const getStatusBadge = (status: string) => {
    const variants = {
      'Postado': { label: 'Postado', variant: 'secondary' as const },
      'Em trânsito': { label: 'Em trânsito', variant: 'default' as const },
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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este rastreamento?')) return;
    deleteTrackingMutation.mutate(id);
  };

  const filteredRastreamentos = rastreamentos?.filter((item) => {
    const matchesSearch = item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tracking_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || item.current_status === statusFilter;
    const matchesCity = !cityFilter || item.destination_city.toLowerCase().includes(cityFilter.toLowerCase());
    
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
            <h1 className="text-3xl font-bold text-white">Rastreamentos</h1>
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
