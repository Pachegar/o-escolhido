
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

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
          errorMessage = 'Este email não está cadastrado. Verifique o email.';
        } else if (error.message.includes('For security purposes')) {
          errorMessage = 'Por motivos de segurança, só é possível solicitar recuperação de senha a cada 60 segundos.';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
        
        toast.error(errorMessage);
      } else {
        toast.success("Email de recuperação enviado! Verifique sua caixa de entrada e clique no link para redefinir sua senha. Você será redirecionado para a página de configurações para alterar sua senha.");
        setResetMode(false);
      }
    } else {
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Login error:', error);
        
        toast.error("❌ E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.");
      } else {
        toast.success("Login realizado com sucesso! Bem-vindo ao Pachegar");
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
              <>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Sua senha"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember-me" className="text-sm text-white">
                    Lembrar-me neste dispositivo
                  </Label>
                </div>
              </>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
