
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '../types/User';
import { AIR_BASES } from '../utils/constants';
import { toast } from '@/hooks/use-toast';
import { Plane, Cloud, Shield } from 'lucide-react';
import gladioImage from '../images/gladio.png';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [baseAerea, setBaseAerea] = useState('BASM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Tentativa de login:', { username, senha: '***', baseAerea });
    
    if (!username || !senha) {
      toast({
        title: "Erro no login",
        description: "Por favor, preencha username e senha.",
        variant: "destructive",
      });
      return;
    }
    
    if (!baseAerea) {
      toast({
        title: "Erro no login",
        description: "Por favor, selecione sua base aérea.",
        variant: "destructive",
      });
      return;
    }
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Usuários encontrados:', users);
    
    // DADOS DE USUARIO ADMIN PARA ACESSO INICIAL - só adiciona se não existir
    const adminExists = users.some((u: User) => u.username === 'admin');
    if (!adminExists) {
      const defaultAdmin: User = {
        id: '1',
        posto: 'TB',
        nomeGuerra: 'admin',
        nomeCompleto: 'Administrador do Sistema',
        baseAerea: 'BASM',
        perfil: 'Supervisor',
        senha: 'admin',
        username: 'admin'
      };
      users.push(defaultAdmin);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Usuário admin padrão criado');
    }
    
    const user = users.find((u: User) => {
      // Add validation to ensure properties exist before calling toLowerCase
      if (!u.username || !u.senha) {
        console.log('Usuário com dados incompletos encontrado:', u);
        return false;
      }
      
      // Para supervisores, permitir login em qualquer base
      if (u.perfil === 'Supervisor') {
        return u.username.toLowerCase() === username.toLowerCase() && u.senha === senha;
      }
      
      // Para outros perfis, verificar também a base aérea
      if (!u.baseAerea) {
        console.log('Usuário sem base aérea encontrado:', u);
        return false;
      }
      
      return u.username.toLowerCase() === username.toLowerCase() && 
             u.senha === senha &&
             u.baseAerea === baseAerea;
    });
    
    console.log('Usuário encontrado:', user);
    
    if (user) {
      // Se for supervisor, usar a base selecionada no login
      const userToLogin = user.perfil === 'Supervisor' 
        ? { ...user, baseAerea } 
        : user;
      
      onLogin(userToLogin);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user.posto} ${user.nomeGuerra}!`,
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Username, senha ou base aérea incorretos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aviation themed background */}
      <div className="absolute inset-0 aviation-gradient"></div>
      
      {/* Animated clouds */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-16 bg-white/20 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-32 right-20 w-48 h-20 bg-white/15 rounded-full blur-sm animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-18 bg-white/10 rounded-full blur-sm animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-56 h-24 bg-white/12 rounded-full blur-sm animate-pulse delay-500"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 right-10 text-white/30">
        <Plane className="w-8 h-8 floating-card" />
      </div>
      <div className="absolute bottom-20 left-10 text-white/20">
        <Cloud className="w-12 h-12 floating-card" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md aviation-card shadow-2xl border-white/20 pulse-glow">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 w-24 h-24 flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg">
              <img 
                src={gladioImage} 
                alt="Gládio FAB" 
                className="w-20 h-20 object-contain filter brightness-0 invert"
              />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              Sistema de Gerenciamento de Passageiros
            </CardTitle>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">
                Força Aérea Brasileira
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-medium">Nome de Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu username"
                  required
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-slate-300 transition-all duration-200 hover:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-slate-700 font-medium">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-slate-300 transition-all duration-200 hover:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseAerea" className="text-slate-700 font-medium">Base Aérea</Label>
                <Select value={baseAerea} onValueChange={setBaseAerea}>
                  <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-slate-300 transition-all duration-200 hover:border-blue-400">
                    <SelectValue placeholder="Selecione sua base" />
                  </SelectTrigger>
                  <SelectContent>
                    {AIR_BASES.map(base => (
                      <SelectItem key={base.code} value={base.code}>
                        {base.code} - {base.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full aviation-button text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                Entrar no Sistema
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
