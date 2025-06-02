
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
    <div className="min-h-screen aviation-bg">
      {/* Floating aviation elements */}
      <div className="absolute top-10 right-10 text-blue-500/20 floating-element">
        <Plane className="w-12 h-12" />
      </div>
      <div className="absolute bottom-20 left-10 text-blue-400/25 floating-element" style={{ animationDelay: '2s' }}>
        <Cloud className="w-16 h-16" />
      </div>
      <div className="absolute top-1/3 right-1/4 text-blue-300/15 floating-element" style={{ animationDelay: '4s' }}>
        <Shield className="w-10 h-10" />
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md aviation-card aviation-pulse">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 w-24 h-24 flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl ring-4 ring-blue-100">
              <img 
                src={gladioImage} 
                alt="Gládio FAB" 
                className="w-20 h-20 object-contain filter brightness-0 invert"
              />
            </div>
            <CardTitle className="text-3xl font-bold aviation-text-gradient mb-2">
              Sistema de Gerenciamento de Passageiros
            </CardTitle>
            <div className="flex items-center justify-center gap-2 mt-3 bg-blue-50 px-4 py-2 rounded-full">
              <Shield className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-700 font-semibold">
                Força Aérea Brasileira
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-semibold">Nome de Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu username"
                  required
                  className="aviation-input transition-all duration-200 border-slate-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-slate-700 font-semibold">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="aviation-input transition-all duration-200 border-slate-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseAerea" className="text-slate-700 font-semibold">Base Aérea</Label>
                <Select value={baseAerea} onValueChange={setBaseAerea}>
                  <SelectTrigger className="aviation-input transition-all duration-200 border-slate-300">
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
                className="w-full aviation-button text-white font-semibold py-3 px-4 rounded-lg"
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
