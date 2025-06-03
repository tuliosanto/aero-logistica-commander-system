
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
import { supabase } from '@/integrations/supabase/client';
import gladioImage from '../images/gladio.png';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [baseAerea, setBaseAerea] = useState('BASM');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Tentativa de login:', { username, senha: '***', baseAerea });
    
    if (!username || !senha) {
      toast({
        title: "Erro no login",
        description: "Por favor, preencha username e senha.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (!baseAerea) {
      toast({
        title: "Erro no login",
        description: "Por favor, selecione sua base aérea.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Buscar usuário no Supabase
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('senha', senha);

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        toast({
          title: "Erro no login",
          description: "Erro interno do sistema. Tente novamente.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!users || users.length === 0) {
        // Fallback para localStorage se não encontrar no Supabase
        let localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // DADOS DE USUARIO ADMIN PARA ACESSO INICIAL - só adiciona se não existir
        const adminExists = localUsers.some((u: User) => u.username === 'admin');
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
          localUsers.push(defaultAdmin);
          localStorage.setItem('users', JSON.stringify(localUsers));
          console.log('Usuário admin padrão criado no localStorage');
        }
        
        const localUser = localUsers.find((u: User) => {
          if (!u.username || !u.senha) return false;
          
          if (u.perfil === 'Supervisor') {
            return u.username.toLowerCase() === username.toLowerCase() && u.senha === senha;
          }
          
          if (!u.baseAerea) return false;
          
          return u.username.toLowerCase() === username.toLowerCase() && 
                 u.senha === senha &&
                 u.baseAerea === baseAerea;
        });

        if (localUser) {
          const userToLogin = localUser.perfil === 'Supervisor' 
            ? { ...localUser, baseAerea } 
            : localUser;
          
          onLogin(userToLogin);
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${localUser.posto} ${localUser.nomeGuerra}!`,
          });
        } else {
          toast({
            title: "Erro no login",
            description: "Username, senha ou base aérea incorretos.",
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      const user = users[0];
      
      // Para supervisores, permitir login em qualquer base
      if (user.perfil === 'Supervisor') {
        const userToLogin = { ...user, baseAerea };
        onLogin(userToLogin);
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${user.posto} ${user.nome_guerra}!`,
        });
      } else {
        // Para outros perfis, verificar também a base aérea
        if (user.base_aerea === baseAerea) {
          onLogin({
            id: user.id,
            posto: user.posto,
            nomeGuerra: user.nome_guerra,
            nomeCompleto: user.nome_guerra, // Usar nome_guerra como fallback
            baseAerea: user.base_aerea,
            perfil: user.perfil,
            senha: user.senha,
            username: user.username
          });
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${user.posto} ${user.nome_guerra}!`,
          });
        } else {
          toast({
            title: "Erro no login",
            description: "Base aérea incorreta para este usuário.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Erro durante login:', error);
      toast({
        title: "Erro no login",
        description: "Erro interno do sistema. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            <div className="mx-auto mb-3 w-24 h-24 flex items-center justify-center rounded-full">
              <img 
                src={gladioImage} 
                alt="Gládio FAB" 
                className="w-30 h-20 object-contain"
              />
            </div>
            <CardTitle className="text-3xl font-bold aviation-text-gradient mb-2">
              Sistema de Gerenciamento de Passageiros
            </CardTitle>
            <div className="flex items-center justify-center gap-2 mt-3 bg-blue-50 px-4 py-2 rounded-full">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                  className="aviation-input transition-all duration-200 border-slate-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseAerea" className="text-slate-700 font-semibold">Base Aérea</Label>
                <Select value={baseAerea} onValueChange={setBaseAerea} disabled={isLoading}>
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
                disabled={isLoading}
                className="w-full aviation-button text-white font-semibold py-3 px-4 rounded-lg"
              >
                {isLoading ? 'Entrando...' : 'Entrar no Sistema'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
