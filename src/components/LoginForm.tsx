
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '../types/User';
import { toast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [nomeGuerra, setNomeGuerra] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // For demo purposes, create default admin if no users exist
    if (users.length === 0) {
      const defaultAdmin: User = {
        id: '1',
        posto: 'TC',
        nomeGuerra: 'admin',
        nomeCompleto: 'Administrador do Sistema',
        baseAerea: 'SBGL',
        perfil: 'Administrador',
        senha: 'admin123'
      };
      users.push(defaultAdmin);
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    const user = users.find((u: User) => 
      u.nomeGuerra.toLowerCase() === nomeGuerra.toLowerCase() && u.senha === senha
    );
    
    if (user) {
      onLogin(user);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user.posto} ${user.nomeGuerra}!`,
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Nome de guerra ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 via-green-700 to-green-900 p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <Card className="w-full max-w-md relative z-10 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-20 h-20 bg-green-700 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">FAB</span>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Sistema de Voos Logísticos
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Força Aérea Brasileira
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeGuerra">Nome de Guerra</Label>
              <Input
                id="nomeGuerra"
                type="text"
                value={nomeGuerra}
                onChange={(e) => setNomeGuerra(e.target.value)}
                placeholder="Digite seu nome de guerra"
                required
                className="focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
                className="focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Entrar
            </Button>
          </form>
          <div className="mt-6 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
            <strong>Demo:</strong> Use "admin" / "admin123" para acesso inicial
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
