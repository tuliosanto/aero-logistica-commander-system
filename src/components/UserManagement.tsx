import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from '../types/User';
import { MILITARY_RANKS, AIR_BASES } from '../utils/constants';
import { toast } from '@/hooks/use-toast';

interface UserManagementProps {
  currentUser: User;
}

const UserManagement = ({ currentUser }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    posto: '',
    nomeGuerra: '',
    nomeCompleto: '',
    baseAerea: '',
    perfil: 'Operador' as 'Operador' | 'Administrador',
    senha: '',
    username: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  };

  const resetForm = () => {
    setFormData({
      posto: '',
      nomeGuerra: '',
      nomeCompleto: '',
      baseAerea: '',
      perfil: 'Operador',
      senha: '',
      username: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if username is already taken (excluding current editing user)
    const existingUser = users.find(u => 
      u.username.toLowerCase() === formData.username.toLowerCase() && 
      u.id !== editingUser
    );
    
    if (existingUser) {
      toast({
        title: "Erro",
        description: "Este username já está em uso.",
        variant: "destructive",
      });
      return;
    }

    const userData: User = {
      id: editingUser || Date.now().toString(),
      posto: formData.posto,
      nomeGuerra: formData.nomeGuerra,
      nomeCompleto: formData.nomeCompleto,
      baseAerea: formData.baseAerea,
      perfil: formData.perfil,
      senha: formData.senha,
      username: formData.username
    };

    let updatedUsers;
    if (editingUser) {
      updatedUsers = users.map(u => u.id === editingUser ? userData : u);
      toast({
        title: "Usuário atualizado",
        description: `${userData.posto} ${userData.nomeGuerra} foi atualizado.`,
      });
    } else {
      updatedUsers = [...users, userData];
      toast({
        title: "Usuário cadastrado",
        description: `${userData.posto} ${userData.nomeGuerra} foi cadastrado com sucesso.`,
      });
    }

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    resetForm();
    setIsAddingUser(false);
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setFormData({
      posto: user.posto,
      nomeGuerra: user.nomeGuerra,
      nomeCompleto: user.nomeCompleto,
      baseAerea: user.baseAerea,
      perfil: user.perfil,
      senha: user.senha,
      username: user.username
    });
    setEditingUser(user.id);
    setIsAddingUser(true);
  };

  const handleDelete = (userId: string) => {
    if (userId === currentUser.id) {
      toast({
        title: "Erro",
        description: "Você não pode excluir seu próprio usuário.",
        variant: "destructive",
      });
      return;
    }

    const user = users.find(u => u.id === userId);
    if (confirm(`Tem certeza que deseja excluir o usuário ${user?.posto} ${user?.nomeGuerra}?`)) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: "Usuário excluído",
        description: `${user?.posto} ${user?.nomeGuerra} foi excluído.`,
      });
    }
  };

  const changeUserProfile = (userId: string, newProfile: 'Operador' | 'Administrador') => {
    if (userId === currentUser.id) {
      toast({
        title: "Erro",
        description: "Você não pode alterar seu próprio perfil.",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, perfil: newProfile } : u
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const user = users.find(u => u.id === userId);
    toast({
      title: "Perfil alterado",
      description: `${user?.posto} ${user?.nomeGuerra} agora é ${newProfile}.`,
    });
  };

  const getBaseInfo = (baseCode: string) => {
    const base = AIR_BASES.find(b => b.code === baseCode);
    return base ? `${base.code} - ${base.name}` : baseCode;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gerenciamento de Usuários</h3>
        <Button 
          onClick={() => {
            setIsAddingUser(true);
            resetForm();
            setEditingUser(null);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          Cadastrar Usuário
        </Button>
      </div>

      {isAddingUser && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>
              {editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="posto">Posto Militar *</Label>
                  <Select value={formData.posto} onValueChange={(value) => setFormData({...formData, posto: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o posto" />
                    </SelectTrigger>
                    <SelectContent>
                      {MILITARY_RANKS.map(rank => (
                        <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Username único para login"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeGuerra">Nome de Guerra *</Label>
                  <Input
                    id="nomeGuerra"
                    value={formData.nomeGuerra}
                    onChange={(e) => setFormData({...formData, nomeGuerra: e.target.value})}
                    placeholder="Nome de guerra"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseAerea">Base Aérea *</Label>
                  <Select value={formData.baseAerea} onValueChange={(value) => setFormData({...formData, baseAerea: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a base" />
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
                <div className="space-y-2">
                  <Label htmlFor="perfil">Perfil de Acesso *</Label>
                  <Select value={formData.perfil} onValueChange={(value: 'Operador' | 'Administrador') => setFormData({...formData, perfil: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operador">Operador</SelectItem>
                      <SelectItem value="Administrador">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha *</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  placeholder="Senha de acesso"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingUser ? 'Atualizar' : 'Cadastrar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsAddingUser(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id} className={`${user.id === currentUser.id ? 'border-green-300 bg-green-50' : ''}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold">
                        {user.posto} {user.nomeGuerra}
                      </p>
                      <Badge 
                        variant={user.perfil === 'Administrador' ? 'default' : 'secondary'}
                        className={user.perfil === 'Administrador' ? 'bg-red-100 text-red-800' : ''}
                      >
                        {user.perfil}
                      </Badge>
                      {user.id === currentUser.id && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-800">
                          Você
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.nomeCompleto}</p>
                    <p className="text-sm text-gray-500">Username: {user.username}</p>
                    <p className="text-sm text-gray-500">Base: {getBaseInfo(user.baseAerea)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {user.id !== currentUser.id && (
                    <>
                      <Select 
                        value={user.perfil} 
                        onValueChange={(value: 'Operador' | 'Administrador') => changeUserProfile(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operador">Operador</SelectItem>
                          <SelectItem value="Administrador">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        Excluir
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum usuário cadastrado ainda.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
