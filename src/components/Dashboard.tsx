
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

  const handleMissionSave = (mission: Mission) => {
    const updatedMissions = missions.some(m => m.id === mission.id)
      ? missions.map(m => m.id === mission.id ? mission : m)
      : [...missions, mission];
    
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
  };

  const handleMissionDelete = (missionId: string) => {
    const updatedMissions = missions.filter(m => m.id !== missionId);
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
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
          <TabsList className="grid w-full grid-cols-3 lg:w-1/2">
            <TabsTrigger value="missions">Missões</TabsTrigger>
            <TabsTrigger value="new-mission">Nova Missão</TabsTrigger>
            {user.perfil === 'Administrador' && (
              <TabsTrigger value="users">Usuários</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="missions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Missões Cadastradas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MissionList 
                  missions={missions}
                  onEdit={(mission) => {
                    // TODO: Implement edit functionality
                    console.log('Edit mission:', mission);
                  }}
                  onDelete={handleMissionDelete}
                  currentUser={user}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new-mission">
            <Card>
              <CardHeader>
                <CardTitle>Cadastrar Nova Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <MissionForm 
                  onSave={handleMissionSave}
                  currentUser={user}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {user.perfil === 'Administrador' && (
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
