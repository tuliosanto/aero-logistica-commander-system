
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
    perfil: 'Operador' as 'Operador' | 'Administrador' | 'Supervisor',
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

  const getFilteredUsers = () => {
    if (currentUser.perfil === 'Supervisor') {
      // Supervisor can see all users
      return users;
    } else if (currentUser.perfil === 'Administrador') {
      // Administrador can only see users from their base
      return users.filter(user => user.baseAerea === currentUser.baseAerea);
    }
    // Operadores shouldn't access this component, but just in case
    return [];
  };

  const resetForm = () => {
    setFormData({
      posto: '',
      nomeGuerra: '',
      nomeCompleto: '',
      baseAerea: currentUser.perfil === 'Administrador' ? currentUser.baseAerea : '',
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

    // Validation: Administrador can only create users for their base
    if (currentUser.perfil === 'Administrador' && formData.baseAerea !== currentUser.baseAerea) {
      toast({
        title: "Erro",
        description: "Você só pode cadastrar usuários para sua própria base aérea.",
        variant: "destructive",
      });
      return;
    }

    // Validation: Only Supervisor can create Administrador or Supervisor profiles
    if ((formData.perfil === 'Administrador' || formData.perfil === 'Supervisor') && currentUser.perfil !== 'Supervisor') {
      toast({
        title: "Erro",
        description: "Apenas Supervisores podem criar perfis de Administrador ou Supervisor.",
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
    // Check permissions before allowing edit
    if (currentUser.perfil === 'Administrador' && user.baseAerea !== currentUser.baseAerea) {
      toast({
        title: "Erro",
        description: "Você só pode editar usuários da sua própria base aérea.",
        variant: "destructive",
      });
      return;
    }

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

    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    // Check permissions before allowing delete
    if (currentUser.perfil === 'Administrador' && userToDelete.baseAerea !== currentUser.baseAerea) {
      toast({
        title: "Erro",
        description: "Você só pode excluir usuários da sua própria base aérea.",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o usuário ${userToDelete?.posto} ${userToDelete?.nomeGuerra}?`)) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: "Usuário excluído",
        description: `${userToDelete?.posto} ${userToDelete?.nomeGuerra} foi excluído.`,
      });
    }
  };

  const changeUserProfile = (userId: string, newProfile: 'Operador' | 'Administrador' | 'Supervisor') => {
    if (userId === currentUser.id) {
      toast({
        title: "Erro",
        description: "Você não pode alterar seu próprio perfil.",
        variant: "destructive",
      });
      return;
    }

    const userToChange = users.find(u => u.id === userId);
    if (!userToChange) return;

    // Check permissions before allowing profile change
    if (currentUser.perfil === 'Administrador' && userToChange.baseAerea !== currentUser.baseAerea) {
      toast({
        title: "Erro",
        description: "Você só pode alterar perfis de usuários da sua própria base aérea.",
        variant: "destructive",
      });
      return;
    }

    // Only Supervisor can set Administrador or Supervisor profiles
    if ((newProfile === 'Administrador' || newProfile === 'Supervisor') && currentUser.perfil !== 'Supervisor') {
      toast({
        title: "Erro",
        description: "Apenas Supervisores podem definir perfis de Administrador ou Supervisor.",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, perfil: newProfile } : u
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    toast({
      title: "Perfil alterado",
      description: `${userToChange?.posto} ${userToChange?.nomeGuerra} agora é ${newProfile}.`,
    });
  };

  const getBaseInfo = (baseCode: string) => {
    const base = AIR_BASES.find(b => b.code === baseCode);
    return base ? `${base.code} - ${base.name}` : baseCode;
  };

  const getAvailableProfiles = () => {
    if (currentUser.perfil === 'Supervisor') {
      return ['Operador', 'Administrador', 'Supervisor'];
    } else {
      return ['Operador'];
    }
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gerenciamento de Usuários</h3>
          <p className="text-sm text-gray-600">
            {currentUser.perfil === 'Supervisor' 
              ? 'Gerenciando usuários de todas as bases aéreas' 
              : `Gerenciando usuários da ${currentUser.baseAerea}`
            }
          </p>
        </div>
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
                  <Select 
                    value={formData.baseAerea} 
                    onValueChange={(value) => setFormData({...formData, baseAerea: value})}
                    disabled={currentUser.perfil === 'Administrador'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a base" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentUser.perfil === 'Supervisor' ? (
                        AIR_BASES.map(base => (
                          <SelectItem key={base.code} value={base.code}>
                            {base.code} - {base.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={currentUser.baseAerea}>
                          {getBaseInfo(currentUser.baseAerea)}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perfil">Perfil de Acesso *</Label>
                  <Select value={formData.perfil} onValueChange={(value: 'Operador' | 'Administrador' | 'Supervisor') => setFormData({...formData, perfil: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableProfiles().map(profile => (
                        <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                      ))}
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
        {filteredUsers.map((user) => (
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
                        variant={user.perfil === 'Supervisor' ? 'default' : user.perfil === 'Administrador' ? 'secondary' : 'outline'}
                        className={
                          user.perfil === 'Supervisor' ? 'bg-purple-100 text-purple-800' :
                          user.perfil === 'Administrador' ? 'bg-red-100 text-red-800' : ''
                        }
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
                        onValueChange={(value: 'Operador' | 'Administrador' | 'Supervisor') => changeUserProfile(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableProfiles().map(profile => (
                            <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                          ))}
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum usuário cadastrado ainda.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
