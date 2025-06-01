
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '../types/User';
import { AIR_BASES } from '../utils/constants';
import { toast } from '@/hooks/use-toast';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <Card className="w-full max-w-md relative z-10 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src={gladioImage} 
              alt="Gládio FAB" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">
            Sistema de Voos Logísticos
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Força Aérea Brasileira
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu username"
                required
                className="focus:ring-blue-500 focus:border-blue-500"
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
                className="focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseAerea">Base Aérea</Label>
              <Select value={baseAerea} onValueChange={setBaseAerea}>
                <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
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
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
