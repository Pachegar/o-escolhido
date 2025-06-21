
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (resetMode) {
      const { error } = await resetPassword(email);

      if (error) {
        console.error('Password reset error:', error);
        
        let errorMessage = 'Erro ao enviar email de recuperação';
        
        if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido. Verifique o formato do email.';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'Este email não está cadastrado. Verifique o email ou faça seu cadastro.';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
        
        toast({
          title: "Erro na recuperação de senha",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email de recuperação enviado!",
          description: "Verifique sua caixa de entrada e clique no link para redefinir sua senha.",
          duration: 8000,
        });
        setResetMode(false);
      }
    } else {
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Erro no login';
        
        if (error.message === 'Invalid login credentials') {
          errorMessage = 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
        } else if (error.message === 'Email not confirmed') {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação antes de fazer login.';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'Este email não está cadastrado. Faça seu cadastro primeiro.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido. Verifique o formato do email.';
        } else if (error.message.includes('Password')) {
          errorMessage = 'Senha incorreta. Verifique sua senha e tente novamente.';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
        
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Pachegar",
        });
        navigate('/dashboard');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Pachegar</CardTitle>
          <CardDescription>
            {resetMode ? 'Recuperar senha' : 'Entre na sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="seu@email.com"
              />
            </div>
            {!resetMode && (
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Sua senha"
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full hover-button"
              disabled={loading}
            >
              {loading ? 
                (resetMode ? 'Enviando...' : 'Entrando...') : 
                (resetMode ? 'Enviar email de recuperação' : 'Entrar')
              }
            </Button>
            
            {!resetMode && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}
            
            {resetMode && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setResetMode(false)}
                  className="text-sm text-primary hover:underline"
                >
                  Voltar ao login
                </button>
              </div>
            )}
          </form>
          
          {!resetMode && (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Não tem uma conta?{' '}
                <Link to="/registro" className="text-primary hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
