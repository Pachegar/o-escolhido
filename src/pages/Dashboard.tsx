
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SmartInsights } from '@/components/SmartInsights';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

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
        trialDaysLeft: 5,
        bonusTickets: 45, // From referrals
        monthlyComparison: {
          totalActive: 12, // +12%
          totalDelivered: -5, // -5%
          totalClicks: 23 // +23%
        }
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

  const usagePercentage = ((stats.planLimit - stats.remainingTrackings + stats.bonusTickets) / (stats.planLimit + stats.bonusTickets)) * 100;
  const showUpgradePrompt = usagePercentage >= 80;

  const MetricCard = ({ title, value, description, trend, icon }: {
    title: string;
    value: number | string;
    description: string;
    trend?: number;
    icon: string;
  }) => (
    <Card className="glass-card hover-scale group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          {trend !== undefined && (
            <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
              {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : trend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <CardTitle className="text-3xl flex items-center gap-2 group-hover:text-white transition-colors">
          <span className="text-2xl">{icon}</span>
          <span className="text-white">{value}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">vs. mês anterior</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Smart Insights */}
        <SmartInsights />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/eb8d8e3b-2f97-4b6a-b22a-6a8273307baa.png" 
              alt="Pachegar" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-muted-foreground">Visão geral da sua conta</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/rastreamentos/criar">
              <Button className="hover-button glow-button w-full sm:w-auto">
                📦 Criar rastreamento
              </Button>
            </Link>
            <Link to="/planos">
              <Button variant="outline" className="hover-button w-full sm:w-auto">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Fazer upgrade
              </Button>
            </Link>
          </div>
        </div>

        {/* Trial Alert */}
        {stats.trialDaysLeft > 0 && (
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-medium text-white">Período de teste</p>
                  <p className="text-sm text-muted-foreground">
                    Restam {stats.trialDaysLeft} dias no seu período gratuito
                  </p>
                </div>
                <Link to="/planos" className="ml-auto">
                  <Button variant="outline" size="sm" className="hover-button glow-button">
                    Ver planos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Rastreamentos Ativos"
            value={stats.totalActive}
            description="📦 Em andamento"
            trend={stats.monthlyComparison.totalActive}
            icon="📦"
          />

          <MetricCard
            title="Total Entregues"
            value={stats.totalDelivered}
            description="✅ Finalizados"
            trend={stats.monthlyComparison.totalDelivered}
            icon="✅"
          />

          <MetricCard
            title="Total de Cliques"
            value={stats.totalClicks}
            description="👆 Nos links públicos"
            trend={stats.monthlyComparison.totalClicks}
            icon="👆"
          />

          <MetricCard
            title="Rastreamentos Restantes"
            value={stats.remainingTrackings + stats.bonusTickets}
            description={`De ${stats.planLimit} + ${stats.bonusTickets} bônus`}
            icon="🎯"
          />
        </div>

        {/* Usage Progress */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Uso do Plano</CardTitle>
                <CardDescription>
                  {stats.planLimit - stats.remainingTrackings} de {stats.planLimit} utilizados
                  {stats.bonusTickets > 0 && (
                    <span className="text-white"> + {stats.bonusTickets} bônus</span>
                  )}
                </CardDescription>
              </div>
              {showUpgradePrompt && (
                <Link to="/planos">
                  <Button size="sm" className="glow-button">
                    Fazer upgrade
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={usagePercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{usagePercentage.toFixed(1)}% utilizado</span>
              <span>{stats.remainingTrackings + stats.bonusTickets} restantes</span>
            </div>
            {stats.bonusTickets > 0 && (
              <p className="text-xs text-white mt-1">
                🎁 {stats.bonusTickets} rastreamentos bônus por indicações
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card cursor-pointer hover-scale">
            <Link to="/rastreamentos/criar">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-semibold mb-2 text-white">Novo Rastreamento</h3>
                <p className="text-sm text-muted-foreground">
                  Criar um novo código de rastreamento
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="glass-card cursor-pointer hover-scale">
            <Link to="/indicacoes">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="font-semibold mb-2 text-white">Indique e Ganhe</h3>
                <p className="text-sm text-muted-foreground">
                  Convide amigos e ganhe rastreamentos extras
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="glass-card cursor-pointer hover-scale">
            <Link to="/configuracoes">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="font-semibold mb-2 text-white">Configurações</h3>
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
