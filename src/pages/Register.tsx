
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasMinLength = password.length >= 8;

    return {
      isValid: hasLowercase && hasUppercase && hasNumber && hasSymbol && hasMinLength,
      requirements: {
        hasLowercase,
        hasUppercase,
        hasNumber,
        hasSymbol,
        hasMinLength
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem. Digite a mesma senha nos dois campos.");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const missing = [];
      if (!passwordValidation.requirements.hasMinLength) missing.push('pelo menos 8 caracteres');
      if (!passwordValidation.requirements.hasLowercase) missing.push('letras minúsculas');
      if (!passwordValidation.requirements.hasUppercase) missing.push('letras maiúsculas');
      if (!passwordValidation.requirements.hasNumber) missing.push('números');
      if (!passwordValidation.requirements.hasSymbol) missing.push('símbolos');

      toast.error(`A senha deve conter: ${missing.join(', ')}.`);
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);

    if (error) {
      console.error('Signup error:', error);
      
      // Specific error message for existing email as requested
      if (error.message === 'User already registered' || error.message.includes('already been registered')) {
        toast.error("❌ Este e-mail já está cadastrado. Tente fazer login ou redefinir sua senha.");
      } else if (error.message.includes('Invalid email')) {
        toast.error("Email inválido. Verifique o formato do email.");
      } else if (error.message.includes('Password should be')) {
        toast.error("Senha muito fraca. Use pelo menos 8 caracteres incluindo letras maiúsculas, minúsculas, números e símbolos.");
      } else if (error.message.includes('rate limit') || error.message.includes('too many')) {
        toast.error("Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.");
      } else if (error.message.includes('signup is disabled')) {
        toast.error("Cadastro temporariamente desabilitado. Tente novamente mais tarde.");
      } else {
        toast.error(`Erro: ${error.message}`);
      }
    } else {
      // Redirect to login with success message as requested
      navigate('/login');
      setTimeout(() => {
        toast.success("✅ Conta criada! Enviamos um e-mail de confirmação para você ativar seu acesso.");
      }, 100);
    }

    setLoading(false);
  };

  const passwordValidation = validatePassword(password);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Pachegar</CardTitle>
          <CardDescription>Crie sua conta</CardDescription>
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
            <div>
              <Label htmlFor="password">Senha</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                placeholder="Crie uma senha forte"
              />
              {password && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-white mb-2">A senha deve conter:</p>
                  <ul className="text-xs space-y-1">
                    <li className={passwordValidation.requirements.hasMinLength ? 'text-green-400' : 'text-red-400'}>
                      ✓ Pelo menos 8 caracteres
                    </li>
                    <li className={passwordValidation.requirements.hasLowercase ? 'text-green-400' : 'text-red-400'}>
                      ✓ Letras minúsculas
                    </li>
                    <li className={passwordValidation.requirements.hasUppercase ? 'text-green-400' : 'text-red-400'}>
                      ✓ Letras maiúsculas
                    </li>
                    <li className={passwordValidation.requirements.hasNumber ? 'text-green-400' : 'text-red-400'}>
                      ✓ Números
                    </li>
                    <li className={passwordValidation.requirements.hasSymbol ? 'text-green-400' : 'text-red-400'}>
                      ✓ Símbolos (!@#$%^&* etc.)
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
                placeholder="Digite a senha novamente"
              />
            </div>
            <Button
              type="submit"
              className="w-full hover-button"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
