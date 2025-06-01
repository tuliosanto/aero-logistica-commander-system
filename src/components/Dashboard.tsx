
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Users, Settings, LogOut, Plane, UserPlus, Archive } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Mission } from '../types/Mission';
import { User } from '../types/User';
import MissionForm from './MissionForm';
import MissionList from './MissionList';
import UserManagement from './UserManagement';
import BaseConfigComponent from './BaseConfig';
import CANWaitlist from './CANWaitlist';
import ArchivedMissions from './ArchivedMissions';
import { useBaseImage } from '../hooks/useBaseImage';

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const Dashboard = ({
  currentUser,
  onLogout
}: DashboardProps) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [activeTab, setActiveTab] = useState(currentUser.perfil === 'Secretario' ? 'waitlist' : 'missions');
  const baseImage = useBaseImage(currentUser.baseAerea);

  useEffect(() => {
    loadMissions();
  }, [currentUser.baseAerea]);

  const loadMissions = () => {
    const allMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    // Filter missions only from the logged user's air base and exclude archived ones
    const baseMissions = allMissions.filter((mission: Mission) => 
      mission.baseAerea === currentUser.baseAerea && !mission.isArchived
    );
    setMissions(baseMissions);
  };

  const handleCreateMission = () => {
    setEditingMission(null);
    setShowMissionForm(true);
  };

  const handleEditMission = (mission: Mission) => {
    setEditingMission(mission);
    setShowMissionForm(true);
  };

  const handleSaveMission = (missionData: Mission) => {
    const allMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    if (editingMission) {
      const updatedMissions = allMissions.map((m: Mission) => m.id === editingMission.id ? {
        ...missionData,
        id: editingMission.id,
        createdAt: editingMission.createdAt
      } : m);
      localStorage.setItem('missions', JSON.stringify(updatedMissions));
      toast({
        title: "Missão atualizada",
        description: `OFRAG ${missionData.ofrag} foi atualizada com sucesso.`
      });
    } else {
      const newMission: Mission = {
        ...missionData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        baseAerea: currentUser.baseAerea
      };
      allMissions.push(newMission);
      localStorage.setItem('missions', JSON.stringify(allMissions));
      toast({
        title: "Missão criada",
        description: `OFRAG ${missionData.ofrag} foi criada com sucesso.`
      });
    }
    loadMissions();
    setShowMissionForm(false);
    setEditingMission(null);
  };

  const handleDeleteMission = (missionId: string) => {
    const allMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    const updatedMissions = allMissions.filter((m: Mission) => m.id !== missionId);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    loadMissions();
  };

  const getTabsCount = () => {
    if (currentUser.perfil === 'Operador') return 'grid-cols-3';
    if (currentUser.perfil === 'Secretario') return 'grid-cols-1';
    return 'grid-cols-5';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={baseImage} alt={`Logo da ${currentUser.baseAerea}`} className="h-8 w-8 object-contain" />
            <h1 className="text-xl font-bold text-blue-700">Sistema de Gerenciamento de Passageiros</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {currentUser.posto} {currentUser.nomeGuerra}
              </p>
              <p className="text-xs text-gray-600">
                {currentUser.baseAerea} - {currentUser.perfil}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout} className="text-gray-600 hover:text-gray-800">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${getTabsCount()} mb-6`}>
            {currentUser.perfil !== 'Secretario' && (
              <>
                <TabsTrigger value="missions" className="flex items-center space-x-2">
                  <Plane className="w-4 h-4" />
                  <span>Missões</span>
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex items-center space-x-2">
                  <Archive className="w-4 h-4" />
                  <span>Arquivadas</span>
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="waitlist" className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Inscrições CAN</span>
            </TabsTrigger>
            {currentUser.perfil !== 'Operador' && currentUser.perfil !== 'Secretario' && (
              <>
                <TabsTrigger value="users" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Usuários</span>
                </TabsTrigger>
                <TabsTrigger value="config" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Configurações</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {currentUser.perfil !== 'Secretario' && (
            <>
              <TabsContent value="missions" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Missões</h2>
                    <p className="text-gray-600">Gerencie as missões do Correio Aéreo Nacional</p>
                  </div>
                  <Button onClick={handleCreateMission} className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Nova Missão
                  </Button>
                </div>

                {showMissionForm ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {editingMission ? 'Editar Missão' : 'Nova Missão'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MissionForm 
                        mission={editingMission} 
                        onSave={handleSaveMission} 
                        onCancel={() => {
                          setShowMissionForm(false);
                          setEditingMission(null);
                        }} 
                        currentUser={currentUser} 
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <MissionList 
                    missions={missions} 
                    onEdit={handleEditMission} 
                    onDelete={handleDeleteMission} 
                    currentUser={currentUser} 
                  />
                )}
              </TabsContent>

              <TabsContent value="archived" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Missões Arquivadas</h2>
                  <p className="text-gray-600">Consulte as missões arquivadas do Correio Aéreo Nacional</p>
                </div>
                <ArchivedMissions currentUser={currentUser} />
              </TabsContent>
            </>
          )}

          <TabsContent value="waitlist" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Inscrições Ativas</h2>
              <p className="text-gray-600">Gerencie passageiros na lista de espera do Correio Aéreo Nacional</p>
            </div>
            <CANWaitlist currentUser={currentUser} missions={missions} />
          </TabsContent>

          {currentUser.perfil !== 'Operador' && currentUser.perfil !== 'Secretario' && (
            <>
              <TabsContent value="users" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Usuários</h2>
                  <p className="text-gray-600">Gerencie os usuários do sistema</p>
                </div>
                <UserManagement currentUser={currentUser} />
              </TabsContent>

              <TabsContent value="config" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Configurações da Base</h2>
                  <p className="text-gray-600">Configure os dados da sua base aérea</p>
                </div>
                <BaseConfigComponent currentUser={currentUser} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
