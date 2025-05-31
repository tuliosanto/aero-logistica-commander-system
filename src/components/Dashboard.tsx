
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '../types/User';
import MissionList from './MissionList';
import UserManagement from './UserManagement';
import MissionForm from './MissionForm';
import { Mission } from '../types/Mission';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [missions, setMissions] = useState<Mission[]>(() => {
    return JSON.parse(localStorage.getItem('missions') || '[]');
  });
  const [activeTab, setActiveTab] = useState('missions');
  const [isCreatingMission, setIsCreatingMission] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  const handleMissionSave = (mission: Mission) => {
    const updatedMissions = missions.some(m => m.id === mission.id)
      ? missions.map(m => m.id === mission.id ? mission : m)
      : [...missions, mission];
    
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    setIsCreatingMission(false);
    setEditingMission(null);
  };

  const handleMissionDelete = (missionId: string) => {
    const updatedMissions = missions.filter(m => m.id !== missionId);
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
  };

  const handleEditMission = (mission: Mission) => {
    setEditingMission(mission);
    setIsCreatingMission(true);
  };

  const handleCancelEdit = () => {
    setIsCreatingMission(false);
    setEditingMission(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">FAB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Sistema de Voos Logísticos</h1>
                <p className="text-green-200 text-sm">Força Aérea Brasileira</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold">{user.posto} {user.nomeGuerra}</p>
                <p className="text-green-200 text-sm">{user.baseAerea} - {user.perfil}</p>
              </div>
              <Button 
                onClick={onLogout}
                variant="outline"
                className="bg-transparent border-green-300 text-green-100 hover:bg-green-700"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${(user.perfil === 'Administrador' || user.perfil === 'Supervisor') ? 'grid-cols-2' : 'grid-cols-1'} lg:w-1/2`}>
            <TabsTrigger value="missions">Missões</TabsTrigger>
            {(user.perfil === 'Administrador' || user.perfil === 'Supervisor') && (
              <TabsTrigger value="users">Usuários</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="missions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Missões Cadastradas</span>
                  {!isCreatingMission && (
                    <Button 
                      onClick={() => setIsCreatingMission(true)}
                      className="bg-green-700 hover:bg-green-800"
                    >
                      Nova Missão
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isCreatingMission ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {editingMission ? 'Editar Missão' : 'Cadastrar Nova Missão'}
                      </h3>
                      <Button 
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </Button>
                    </div>
                    <MissionForm 
                      onSave={handleMissionSave}
                      currentUser={user}
                      mission={editingMission}
                    />
                  </div>
                ) : (
                  <MissionList 
                    missions={missions}
                    onEdit={handleEditMission}
                    onDelete={handleMissionDelete}
                    currentUser={user}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {(user.perfil === 'Administrador' || user.perfil === 'Supervisor') && (
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserManagement currentUser={user} />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
