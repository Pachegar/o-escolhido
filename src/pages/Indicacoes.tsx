
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Gift, Users, Star } from 'lucide-react';
import { useState } from 'react';

const Indicacoes = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Mock data - seria vindo do Supabase
  const referralCode = `PACHEGAR${user?.id?.slice(-6).toUpperCase()}`;
  const referralLink = `https://pachegar.com.br/cadastro?ref=${referralCode}`;
  const referralsCount = 3;
  const bonusTickets = 45; // 3 referrals × 15 tickets each
  const pendingReferrals = 1;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Gift className="h-8 w-8 text-primary" />
              Indique e Ganhe
            </h1>
            <p className="text-muted-foreground">
              Convide amigos e ganhe rastreamentos extras para sua conta
            </p>
          </div>
        </div>

        {/* Como Funciona */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-3xl mb-2">1️⃣</div>
                <h3 className="font-semibold mb-2">Compartilhe seu link</h3>
                <p className="text-sm text-muted-foreground">
                  Envie seu link único para amigos e colegas
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-3xl mb-2">2️⃣</div>
                <h3 className="font-semibold mb-2">Eles se cadastram</h3>
                <p className="text-sm text-muted-foreground">
                  Quando se registram pelo seu link
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-3xl mb-2">3️⃣</div>
                <h3 className="font-semibold mb-2">Você ganha +15</h3>
                <p className="text-sm text-muted-foreground">
                  Rastreamentos extras quando assinam um plano
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Indicações Confirmadas</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {referralsCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                ✅ Amigos que assinaram planos
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Rastreamentos Bônus</CardDescription>
              <CardTitle className="text-3xl text-primary">+{bonusTickets}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                🎁 Ganhos por indicações
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Aguardando Assinatura</CardDescription>
              <CardTitle className="text-3xl">{pendingReferrals}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                ⏳ Cadastros pendentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Link de Indicação */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Seu Link de Indicação</CardTitle>
            <CardDescription>
              Compartilhe este link para ganhar rastreamentos extras
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="bg-muted/50"
              />
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="hover-button flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p><strong>Seu código:</strong> {referralCode}</p>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Indicações */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Histórico de Indicações</CardTitle>
            <CardDescription>
              Acompanhe suas indicações e recompensas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium">loja***@email.com</p>
                    <p className="text-xs text-muted-foreground">Plano Cavalo-marinho • há 2 dias</p>
                  </div>
                </div>
                <div className="text-green-500 font-medium">+15 rastreamentos</div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium">drop***@email.com</p>
                    <p className="text-xs text-muted-foreground">Plano Peixe • há 1 semana</p>
                  </div>
                </div>
                <div className="text-green-500 font-medium">+15 rastreamentos</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div>
                    <p className="font-medium">nova***@email.com</p>
                    <p className="text-xs text-muted-foreground">Cadastrado • aguardando assinatura</p>
                  </div>
                </div>
                <div className="text-yellow-500 font-medium">Pendente</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Indicacoes;
