
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      // Mock data for demonstration
      return {
        totalActive: 45,
        totalDelivered: 128,
        totalClicks: 892,
        remainingTrackings: 15,
        planLimit: 60,
        trialDaysLeft: 5
      };
    },
  });

  if (isLoading || !stats) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const usagePercentage = ((stats.planLimit - stats.remainingTrackings) / stats.planLimit) * 100;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral da sua conta</p>
          </div>
          <Link to="/rastreamentos/criar">
            <Button className="hover-button">
              📦 Criar rastreamento
            </Button>
          </Link>
        </div>

        {/* Trial Alert */}
        {stats.trialDaysLeft > 0 && (
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-medium">Período de teste</p>
                  <p className="text-sm text-muted-foreground">
                    Restam {stats.trialDaysLeft} dias no seu período gratuito
                  </p>
                </div>
                <Link to="/planos" className="ml-auto">
                  <Button variant="outline" size="sm" className="hover-button">
                    Ver planos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Rastreamentos Ativos</CardDescription>
              <CardTitle className="text-3xl">{stats.totalActive}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                📦 Em andamento
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Total Entregues</CardDescription>
              <CardTitle className="text-3xl">{stats.totalDelivered}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                ✅ Finalizados
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Total de Cliques</CardDescription>
              <CardTitle className="text-3xl">{stats.totalClicks}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                👆 Nos links públicos
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Rastreamentos Restantes</CardDescription>
              <CardTitle className="text-3xl">{stats.remainingTrackings}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                De {stats.planLimit} no plano atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Progress */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Uso do Plano</CardTitle>
            <CardDescription>
              {stats.planLimit - stats.remainingTrackings} de {stats.planLimit} rastreamentos utilizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={usagePercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{usagePercentage.toFixed(1)}% utilizado</span>
              <span>{stats.remainingTrackings} restantes</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card cursor-pointer hover-button">
            <Link to="/rastreamentos/criar">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-semibold mb-2">Novo Rastreamento</h3>
                <p className="text-sm text-muted-foreground">
                  Criar um novo código de rastreamento
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="glass-card cursor-pointer hover-button">
            <Link to="/modelos">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🚛</div>
                <h3 className="font-semibold mb-2">Modelos de Entrega</h3>
                <p className="text-sm text-muted-foreground">
                  Gerenciar seus modelos de entrega
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="glass-card cursor-pointer hover-button">
            <Link to="/configuracoes">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="font-semibold mb-2">Configurações</h3>
                <p className="text-sm text-muted-foreground">
                  Personalizar sua conta
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
