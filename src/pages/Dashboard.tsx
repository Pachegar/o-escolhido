
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SmartInsights } from '@/components/SmartInsights';
import { Skeleton } from '@/components/ui/skeleton';
import { DebugSupabase } from '@/components/DebugSupabase';
import { Link } from 'react-router-dom';
import { useDashboardStats } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: stats, isLoading, error } = useDashboardStats();

  console.log('Dashboard render - User:', user?.email, 'Loading:', isLoading, 'Error:', error);

  // Estados de carregamento
  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <DebugSupabase />
          <div className="animate-pulse space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-32" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Tratamento de erros
  if (error) {
    console.error('Dashboard error:', error);
    return (
      <Layout>
        <div className="p-6">
          <DebugSupabase />
          <Card className="glass-card border-red-500/50 bg-red-500/10">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Erro ao carregar dados</h3>
              <p className="text-muted-foreground mb-4">
                Não foi possível carregar as informações do dashboard.
              </p>
              <div className="text-xs text-muted-foreground mb-4 font-mono">
                Erro: {error.message}
              </div>
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
          <DebugSupabase />
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Acesso necessário</h3>
              <p className="text-muted-foreground mb-4">
                Faça login para acessar seu dashboard personalizado.
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

  // Se não há dados (possível erro na query)
  if (!stats) {
    return (
      <Layout>
        <div className="p-6">
          <DebugSupabase />
          <Card className="glass-card border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Dados não encontrados</h3>
              <p className="text-muted-foreground mb-4">
                Não foi possível carregar seus dados. Isso pode acontecer se sua conta ainda não foi totalmente configurada.
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

  const showUpgradePrompt = stats.usagePercentage >= 80;
  const isNewUser = stats.totalActive === 0 && stats.totalDelivered === 0;

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
        <DebugSupabase />
        
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
              <p className="text-muted-foreground">
                {isNewUser ? 'Bem-vindo ao Pachegar!' : `Visão geral da sua conta`}
              </p>
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

        {/* Alerta para novos usuários */}
        {isNewUser && (
          <Card className="border-blue-500/50 bg-blue-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-medium text-white">Conta criada com sucesso!</p>
                  <p className="text-sm text-muted-foreground">
                    Você ainda não possui rastreamentos. Comece criando seu primeiro código de rastreamento.
                  </p>
                </div>
                <Link to="/rastreamentos/criar" className="ml-auto">
                  <Button variant="outline" size="sm" className="hover-button glow-button">
                    Criar primeiro rastreamento
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerta de upgrade */}
        {showUpgradePrompt && (
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-medium text-white">Limite do plano quase atingido</p>
                  <p className="text-sm text-muted-foreground">
                    Você está usando {stats.usagePercentage.toFixed(1)}% do seu plano. Considere fazer upgrade.
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
            trend={stats.monthlyGrowth}
            icon="📦"
          />

          <MetricCard
            title="Total Entregues"
            value={stats.totalDelivered}
            description="✅ Finalizados"
            icon="✅"
          />

          <MetricCard
            title="Total de Cliques"
            value={stats.totalClicks}
            description="👆 Nos links públicos"
            icon="👆"
          />

          <MetricCard
            title="Rastreamentos Restantes"
            value={stats.remainingTrackings}
            description={`De ${stats.planLimit}${stats.bonusCredits > 0 ? ` + ${stats.bonusCredits} bônus` : ''}`}
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
                  {(stats.totalActive + stats.totalDelivered)} de {stats.totalAllowed} utilizados
                  {stats.bonusCredits > 0 && (
                    <span className="text-white"> (incluindo {stats.bonusCredits} bônus)</span>
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
            <Progress value={Math.min(stats.usagePercentage, 100)} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{stats.usagePercentage.toFixed(1)}% utilizado</span>
              <span>{stats.remainingTrackings} restantes</span>
            </div>
            {stats.bonusCredits > 0 && (
              <p className="text-xs text-white mt-1">
                🎁 {stats.bonusCredits} rastreamentos bônus por indicações
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
