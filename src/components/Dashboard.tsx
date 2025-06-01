import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MissionList from './MissionList';
import MissionForm from './MissionForm';
import UserManagement from './UserManagement';
import BaseConfigComponent from './BaseConfig';
import { Mission } from '../types/Mission';
import { User } from '../types/User';
import { toast } from '@/hooks/use-toast';

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const Dashboard = ({ currentUser, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('missions');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = () => {
    try {
      const storedMissions = localStorage.getItem('missions');
      if (storedMissions) {
        setMissions(JSON.parse(storedMissions));
      }
    } catch (error) {
      console.error("Failed to load missions from local storage", error);
      toast({
        title: "Erro ao carregar missões",
        description: "Não foi possível carregar as missões salvas.",
        variant: "destructive",
      });
    }
  };

  const saveMissions = (missionsToSave: Mission[]) => {
    try {
      localStorage.setItem('missions', JSON.stringify(missionsToSave));
    } catch (error) {
      console.error("Failed to save missions to local storage", error);
      toast({
        title: "Erro ao salvar missões",
        description: "Não foi possível salvar as missões.",
        variant: "destructive",
      });
    }
  };

  const handleCreateMission = (newMission: Mission) => {
    const updatedMissions = [...missions, newMission];
    setMissions(updatedMissions);
    saveMissions(updatedMissions);
    setActiveTab('missions');
    toast({
      title: "Missão criada",
      description: `OFRAG ${newMission.ofrag} foi criada com sucesso.`,
    });
  };

  const handleEditMission = (mission: Mission) => {
    setSelectedMission(mission);
    setActiveTab('edit-mission');
  };

  const handleUpdateMission = (updatedMission: Mission) => {
    const updatedMissions = missions.map(mission =>
      mission.id === updatedMission.id ? updatedMission : mission
    );
    setMissions(updatedMissions);
    saveMissions(updatedMissions);
    setSelectedMission(null);
    setActiveTab('missions');
    toast({
      title: "Missão atualizada",
      description: `OFRAG ${updatedMission.ofrag} foi atualizada com sucesso.`,
    });
  };

  const handleDeleteMission = (missionId: string) => {
    const updatedMissions = missions.filter(mission => mission.id !== missionId);
    setMissions(updatedMissions);
    saveMissions(updatedMissions);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'missions':
        return (
          <MissionList
            missions={missions}
            onEdit={handleEditMission}
            onDelete={handleDeleteMission}
            currentUser={currentUser}
          />
        );
      case 'new-mission':
        return (
          <MissionForm
            onSubmit={handleCreateMission}
            currentUser={currentUser}
          />
        );
      case 'edit-mission':
        return selectedMission ? (
          <MissionForm
            mission={selectedMission}
            onSubmit={handleUpdateMission}
            currentUser={currentUser}
          />
        ) : null;
      case 'users':
        return currentUser.perfil !== 'Operador' ? (
          <UserManagement currentUser={currentUser} />
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">Acesso negado. Apenas Administradores e Supervisores podem gerenciar usuários.</p>
          </div>
        );
      case 'config':
        return <BaseConfigComponent currentUser={currentUser} />;
      default:
        return (
          <MissionList
            missions={missions}
            onEdit={handleEditMission}
            onDelete={handleDeleteMission}
            currentUser={currentUser}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-700">Sistema CAN</h1>
              <div className="text-sm text-gray-600">
                {currentUser.posto} {currentUser.nomeGuerra} - {currentUser.baseAerea}
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('missions')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'missions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Missões
            </button>
            <button
              onClick={() => setActiveTab('new-mission')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'new-mission'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Nova Missão
            </button>
            {currentUser.perfil !== 'Operador' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Usuários
              </button>
            )}
            {currentUser.perfil !== 'Operador' && (
              <button
                onClick={() => setActiveTab('config')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'config'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Configurações
              </button>
            )}
          </nav>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
