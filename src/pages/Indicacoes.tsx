
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useSupabaseData';

const Indicacoes = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: userProfile, isLoading } = useUserProfile();

  const userReferralCode = userProfile?.referral_code || 'REF-LOADING';
  const referralLink = `${window.location.origin}/planos?ref=${userReferralCode}`;
  const totalIndicacoes = 0; // Will be implemented with real data later
  const rastreiosGanhos = userProfile?.referral_credits || 0;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link copiado!",
      description: "O link de indicação foi copiado para a área de transferência",
    });
    
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Indique e Ganhe</h1>
          <p className="text-muted-foreground">
            Compartilhe nosso sistema e ganhe rastreios extras para cada amigo que assinar um plano
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="text-2xl font-bold text-white">{totalIndicacoes}</h3>
              <p className="text-muted-foreground">Indicações Realizadas</p>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="text-2xl font-bold text-white">{rastreiosGanhos}</h3>
              <p className="text-muted-foreground">Rastreios Extras Ganhos</p>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="text-2xl font-bold text-white">15</h3>
              <p className="text-muted-foreground">Rastreios por Indicação</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-center">Seu Link de Indicação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                onClick={copyReferralLink}
                className={`hover-button glow-button ${copied ? 'bg-green-500' : ''}`}
                disabled={copied}
              >
                {copied ? '✓ Copiado' : '📋 Copiar'}
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Compartilhe este link nas suas redes sociais ou envie diretamente para seus amigos
              </p>
              
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const whatsappText = encodeURIComponent(
                      `Olá! Descobri um sistema incrível para rastreamento de pedidos. Dá uma olhada: ${referralLink}`
                    );
                    window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
                  }}
                  className="hover-button"
                >
                  📱 WhatsApp
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const twitterText = encodeURIComponent(
                      `Descobri um sistema incrível para rastreamento de pedidos! ${referralLink}`
                    );
                    window.open(`https://twitter.com/intent/tweet?text=${twitterText}`, '_blank');
                  }}
                  className="hover-button"
                >
                  🐦 Twitter
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const emailSubject = encodeURIComponent('Sistema de Rastreamento Incrível');
                    const emailBody = encodeURIComponent(
                      `Olá!\n\nDescobri um sistema incrível para rastreamento de pedidos e achei que você pode se interessar.\n\nConfira aqui: ${referralLink}\n\nAbraços!`
                    );
                    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
                  }}
                  className="hover-button"
                >
                  ✉️ Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Como Funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <h3 className="font-semibold mb-2 text-white">Compartilhe</h3>
                <p className="text-sm text-muted-foreground">
                  Envie seu link de indicação para amigos que podem se interessar pelo sistema
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <h3 className="font-semibold mb-2 text-white">Amigo Assina</h3>
                <p className="text-sm text-muted-foreground">
                  Quando seu amigo assinar qualquer plano pago através do seu link
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <h3 className="font-semibold mb-2 text-white">Você Ganha</h3>
                <p className="text-sm text-muted-foreground">
                  Receba 15 rastreios extras na sua conta (bônus único, não renovável)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-semibold mb-1 text-white">Termos Importantes</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Os rastreios extras são adicionados apenas uma vez por indicação</li>
                  <li>• O bônus não é renovável mensalmente</li>
                  <li>• O amigo deve assinar um plano pago para validar a indicação</li>
                  <li>• Não há limite de indicações que você pode fazer</li>
                  <li>• Os rastreios são creditados automaticamente após confirmação do pagamento</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Indicacoes;
