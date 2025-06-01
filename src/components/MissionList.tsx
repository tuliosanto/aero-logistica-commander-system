import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Mission, Passenger } from '../types/Mission';
import { User } from '../types/User';
import { MILITARY_RANKS, PRIORITIES, AERODROMOS } from '../utils/constants';
import { toast } from '@/hooks/use-toast';
import PriorityTooltip from './PriorityTooltip';

interface MissionListProps {
  missions: Mission[];
  onEdit: (mission: Mission) => void;
  onDelete: (missionId: string) => void;
  currentUser: User;
}

const MissionList = ({ missions, onEdit, onDelete, currentUser }: MissionListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState('');
  const [showPassengerList, setShowPassengerList] = useState(false);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [editingMissionId, setEditingMissionId] = useState<string | null>(null);

  const aircrafts = [...new Set(missions.map(mission => mission.aeronave))];

  const filteredMissions = missions.filter(mission => {
    const searchMatch =
      mission.ofrag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.aeronave.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.matricula.toLowerCase().includes(searchQuery.toLowerCase());

    const dateMatch = selectedDate ? format(new Date(mission.dataVoo), 'yyyy-MM-dd') === selectedDate : true;
    const aircraftMatch = selectedAircraft ? mission.aeronave === selectedAircraft : true;

    return searchMatch && dateMatch && aircraftMatch;
  });

  const handleCompleteMission = (missionId: string) => {
    const updatedMissions = missions.map(mission =>
      mission.id === missionId ? { ...mission, isCompleted: true } : mission
    );
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
    toast({
      title: "Missão concluída",
      description: `OFRAG ${missions.find(m => m.id === missionId)?.ofrag} foi marcada como concluída.`,
    });
  };

  const handleDeleteMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    if (confirm(`Tem certeza que deseja excluir a missão OFRAG ${mission.ofrag}?`)) {
      onDelete(missionId);
      toast({
        title: "Missão excluída",
        description: `OFRAG ${mission.ofrag} foi excluída com sucesso.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Buscar por OFRAG, aeronave ou matrícula..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por aeronave" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as aeronaves</SelectItem>
            {aircrafts.map(aircraft => (
              <SelectItem key={aircraft} value={aircraft}>{aircraft}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredMissions.length > 0 ? (
        <div className="space-y-4">
          {filteredMissions.map((mission) => {
            // Handle trechos as string, split by comma and join with dash
            const trechosFormatted = mission.trechos.split(',').map(t => t.trim()).join(' - ');
            
            return (
              <Card key={mission.id} className={mission.isCompleted ? 'opacity-70 border-green-500' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-blue-700">
                        OFRAG {mission.ofrag}
                        {mission.isCompleted && (
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Concluída
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="mt-2 space-y-1">
                        <p><strong>Aeronave:</strong> {mission.aeronave} ({mission.matricula})</p>
                        <p><strong>Trechos:</strong> {trechosFormatted}</p>
                        <p><strong>Data do Voo:</strong> {format(new Date(mission.dataVoo), 'dd/MM/yyyy')}</p>
                        <p><strong>Criada em:</strong> {format(new Date(mission.createdAt), 'dd/MM/yyyy \'às\' HH:mm')}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {!mission.isCompleted && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(mission)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompleteMission(mission.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Concluir
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteMission(mission.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhuma missão encontrada.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MissionList;
