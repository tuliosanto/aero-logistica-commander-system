
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Users, Settings, LogOut, Plane, UserPlus, Archive } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Mission } from '../types/Mission';
import { User } from '../types/User';
import { CANWaitlistPassenger } from '../types/CANWaitlist';
import MissionForm from './MissionForm';
import MissionList from './MissionList';
import UserManagement from './UserManagement';
import BaseConfigComponent from './BaseConfig';
import CANWaitlist from './CANWaitlist';
import CANWaitlistForm from './CANWaitlistForm';
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
  const [archivedMissions, setArchivedMissions] = useState<Mission[]>([]);
  const [waitlist, setWaitlist] = useState<CANWaitlistPassenger[]>([]);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [editingWaitlistPassenger, setEditingWaitlistPassenger] = useState<CANWaitlistPassenger | null>(null);
  const [activeTab, setActiveTab] = useState(currentUser.perfil === 'Secretario' ? 'waitlist' : 'missions');
  const baseImage = useBaseImage(currentUser.baseAerea);

  useEffect(() => {
    loadMissions();
    loadWaitlist();
  }, [currentUser.baseAerea]);

  const loadMissions = () => {
    const allMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    // Filtrar missões apenas da base aérea do usuário logado
    const baseMissions = allMissions.filter((mission: Mission) => mission.baseAerea === currentUser.baseAerea);
    
    // Separar missões ativas e arquivadas
    const activeMissions = baseMissions.filter((mission: Mission) => !mission.isArchived);
    const archived = baseMissions.filter((mission: Mission) => mission.isArchived);
    
    setMissions(activeMissions);
    setArchivedMissions(archived);
  };

  const loadWaitlist = () => {
    const allWaitlist = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
    const baseWaitlist = allWaitlist.filter((entry: CANWaitlistPassenger) => 
      entry.baseAerea === currentUser.baseAerea
    );
    setWaitlist(baseWaitlist);
  };

  const handleCreateMission = () => {
    setEditingMission(null);
    setShowMissionForm(true);
  };

  const handleCreateWaitlistEntry = () => {
    setEditingWaitlistPassenger(null);
    setShowWaitlistForm(true);
  };

  const handleEditMission = (mission: Mission) => {
    setEditingMission(mission);
    setShowMissionForm(true);
  };

  const handleEditWaitlistPassenger = (passenger: CANWaitlistPassenger) => {
    setEditingWaitlistPassenger(passenger);
    setShowWaitlistForm(true);
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

  const handleSaveWaitlistEntry = (entry: Omit<CANWaitlistPassenger, 'id' | 'dataInscricao' | 'baseAerea'>) => {
    const allWaitlist = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
    
    if (editingWaitlistPassenger) {
      // Atualizar passageiro existente
      const updatedWaitlist = allWaitlist.map((p: CANWaitlistPassenger) =>
        p.id === editingWaitlistPassenger.id 
          ? { ...editingWaitlistPassenger, ...entry }
          : p
      );
      localStorage.setItem('canWaitlist', JSON.stringify(updatedWaitlist));
      toast({
        title: "Passageiro atualizado",
        description: `${entry.posto} ${entry.nome} foi atualizado na lista de espera CAN.`
      });
    } else {
      // Criar novo passageiro
      const newEntry: CANWaitlistPassenger = {
        ...entry,
        id: Date.now().toString(),
        dataInscricao: new Date().toISOString(),
        baseAerea: currentUser.baseAerea
      };
      allWaitlist.push(newEntry);
      localStorage.setItem('canWaitlist', JSON.stringify(allWaitlist));
      toast({
        title: "Inscrição registrada",
        description: `${entry.posto} ${entry.nome} foi inscrito na lista de espera CAN.`
      });
    }
    
    loadWaitlist();
    setShowWaitlistForm(false);
    setEditingWaitlistPassenger(null);
  };

  const handleDeleteMission = (missionId: string) => {
    const allMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    const updatedMissions = allMissions.filter((m: Mission) => m.id !== missionId);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    loadMissions();
  };

  const handleCompleteMission = (missionId: string) => {
    const allMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    const mission = allMissions.find((m: Mission) => m.id === missionId);
    if (!mission) return;
    
    const updatedMissions = allMissions.map((m: Mission) => 
      m.id === missionId ? { ...m, isCompleted: true } : m
    );
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    
    // Remover passageiros da lista de espera se vieram dela
    if (mission.passageiros && mission.passageiros.length > 0) {
      const allWaitlist = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
      const waitlistIdsToRemove = mission.passageiros
        .filter(p => p.fromWaitlist && p.waitlistId)
        .map(p => p.waitlistId);
      
      if (waitlistIdsToRemove.length > 0) {
        const updatedWaitlist = allWaitlist.filter((entry: CANWaitlistPassenger) => 
          !waitlistIdsToRemove.includes(entry.id)
        );
        localStorage.setItem('canWaitlist', JSON.stringify(updatedWaitlist));
        loadWaitlist();
      }
    }
    
    loadMissions();
    
    toast({
      title: "Missão concluída",
      description: `OFRAG ${mission.ofrag} foi concluída com sucesso.`
    });
  };

  const handleArchiveMission = (missionId: string) => {
    const allMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    const mission = allMissions.find((m: Mission) => m.id === missionId);
    if (!mission) return;
    
    const updatedMissions = allMissions.map((m: Mission) => 
      m.id === missionId ? { ...m, isArchived: true } : m
    );
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    loadMissions();
    
    toast({
      title: "Missão arquivada",
      description: `OFRAG ${mission.ofrag} foi arquivada com sucesso.`
    });
  };

  const handleAddToMission = (entry: CANWaitlistPassenger) => {
    // This function can be implemented to add waitlist passengers to missions
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Em breve você poderá adicionar passageiros diretamente às missões."
    });
  };

  const handleRemoveFromWaitlist = (id: string) => {
    const allWaitlist = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
    const updatedWaitlist = allWaitlist.filter((entry: CANWaitlistPassenger) => entry.id !== id);
    localStorage.setItem('canWaitlist', JSON.stringify(updatedWaitlist));
    loadWaitlist();
    
    toast({
      title: "Passageiro removido",
      description: "Passageiro foi removido da lista de espera."
    });
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
              <TabsTrigger value="missions" className="flex items-center space-x-2">
                <Plane className="w-4 h-4" />
                <span>Missões</span>
              </TabsTrigger>
            )}
            {currentUser.perfil !== 'Secretario' && (
              <TabsTrigger value="archived" className="flex items-center space-x-2">
                <Archive className="w-4 h-4" />
                <span>Arquivadas</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="waitlist" className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Inscrições CAN</span>
            </TabsTrigger>
            {currentUser.perfil !== 'Operador' && currentUser.perfil !== 'Secretario' && (
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Usuários</span>
              </TabsTrigger>
            )}
            {currentUser.perfil !== 'Operador' && currentUser.perfil !== 'Secretario' && (
              <TabsTrigger value="config" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </TabsTrigger>
            )}
          </TabsList>

          {currentUser.perfil !== 'Secretario' && (
            <TabsContent value="missions" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Missões Ativas</h2>
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
                      waitlist={waitlist}
                      onUpdateWaitlist={loadWaitlist}
                    />
                  </CardContent>
                </Card>
              ) : (
                <MissionList 
                  missions={missions} 
                  onEdit={handleEditMission} 
                  onDelete={handleDeleteMission} 
                  onComplete={handleCompleteMission}
                  onArchive={handleArchiveMission}
                  currentUser={currentUser} 
                />
              )}
            </TabsContent>
          )}

          {currentUser.perfil !== 'Secretario' && (
            <TabsContent value="archived" className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Missões Arquivadas</h2>
                <p className="text-gray-600">Histórico de missões concluídas e arquivadas</p>
              </div>
              <ArchivedMissions 
                missions={archivedMissions} 
                currentUser={currentUser} 
              />
            </TabsContent>
          )}

          <TabsContent value="waitlist" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Inscrições Ativas</h2>
                <p className="text-gray-600">Gerencie passageiros na lista de espera do Correio Aéreo Nacional</p>
              </div>
              <Button onClick={handleCreateWaitlistEntry} className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="w-4 h-4 mr-2" />
                Nova Inscrição CAN
              </Button>
            </div>
            
            {showWaitlistForm ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingWaitlistPassenger ? 'Editar Inscrição CAN' : 'Nova Inscrição CAN'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CANWaitlistForm 
                    passenger={editingWaitlistPassenger}
                    onSave={handleSaveWaitlistEntry}
                    onCancel={() => {
                      setShowWaitlistForm(false);
                      setEditingWaitlistPassenger(null);
                    }}
                    currentUser={currentUser}
                  />
                </CardContent>
              </Card>
            ) : (
              <CANWaitlist 
                waitlist={waitlist}
                onAddToMission={handleAddToMission}
                onRemove={handleRemoveFromWaitlist}
                onEdit={handleEditWaitlistPassenger}
              />
            )}
          </TabsContent>

          {currentUser.perfil !== 'Operador' && currentUser.perfil !== 'Secretario' && (
            <TabsContent value="users" className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Usuários</h2>
                <p className="text-gray-600">Gerencie os usuários do sistema</p>
              </div>
              <UserManagement currentUser={currentUser} />
            </TabsContent>
          )}

          {currentUser.perfil !== 'Operador' && currentUser.perfil !== 'Secretario' && (
            <TabsContent value="config" className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Configurações da Base</h2>
                <p className="text-gray-600">Configure os dados da sua base aérea</p>
              </div>
              <BaseConfigComponent currentUser={currentUser} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
