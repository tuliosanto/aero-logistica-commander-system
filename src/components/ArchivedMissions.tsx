
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, Printer, ChevronDown, ChevronUp, Archive, Undo } from 'lucide-react';
import { Mission } from '../types/Mission';
import { User } from '../types/User';
import { toast } from '@/hooks/use-toast';

interface ArchivedMissionsProps {
  currentUser: User;
}

const ArchivedMissions = ({ currentUser }: ArchivedMissionsProps) => {
  const [archivedMissions, setArchivedMissions] = useState<Mission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState('');
  const [collapsedMissions, setCollapsedMissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadArchivedMissions();
  }, [currentUser.baseAerea]);

  const loadArchivedMissions = () => {
    const allMissions = JSON.parse(localStorage.getItem('missions') || '[]');
    const archived = allMissions.filter((mission: Mission) => 
      mission.baseAerea === currentUser.baseAerea && mission.isArchived
    );
    setArchivedMissions(archived);
  };

  const aircrafts = [...new Set(archivedMissions.map(mission => mission.aeronave))];

  const filteredMissions = archivedMissions.filter(mission => {
    const searchMatch =
      mission.ofrag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.aeronave.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.matricula.toLowerCase().includes(searchQuery.toLowerCase());

    const dateMatch = selectedDate ? format(new Date(mission.dataVoo), 'yyyy-MM-dd') === selectedDate : true;
    const aircraftMatch = selectedAircraft ? mission.aeronave === selectedAircraft : true;

    return searchMatch && dateMatch && aircraftMatch;
  });

  const toggleMissionCollapse = (missionId: string) => {
    setCollapsedMissions(prev => ({
      ...prev,
      [missionId]: !prev[missionId]
    }));
  };

  const handleUnarchiveMission = (missionId: string) => {
    const mission = archivedMissions.find(m => m.id === missionId);
    if (!mission) return;

    if (confirm(`Tem certeza que deseja desarquivar a missão OFRAG ${mission.ofrag}?`)) {
      const allMissions = JSON.parse(localStorage.getItem('missions') || '[]');
      const updatedMissions = allMissions.map((m: Mission) =>
        m.id === missionId ? { ...m, isArchived: false, archivedAt: undefined } : m
      );
      localStorage.setItem('missions', JSON.stringify(updatedMissions));
      loadArchivedMissions();
      
      toast({
        title: "Missão desarquivada",
        description: `OFRAG ${mission.ofrag} foi desarquivada com sucesso.`,
      });
    }
  };

  const handleDeleteMission = (missionId: string) => {
    const mission = archivedMissions.find(m => m.id === missionId);
    if (!mission) return;

    if (confirm(`Tem certeza que deseja excluir permanentemente a missão OFRAG ${mission.ofrag}?`)) {
      const allMissions = JSON.parse(localStorage.getItem('missions') || '[]');
      const updatedMissions = allMissions.filter((m: Mission) => m.id !== missionId);
      localStorage.setItem('missions', JSON.stringify(updatedMissions));
      loadArchivedMissions();
      
      toast({
        title: "Missão excluída",
        description: `OFRAG ${mission.ofrag} foi excluída permanentemente.`,
      });
    }
  };

  const handlePrintMission = (mission: Mission) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const passengersHtml = mission.passageiros.map(passenger => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${passenger.posto} ${passenger.nome}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${passenger.cpf}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${passenger.destino}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${passenger.peso + passenger.pesoBagagem + passenger.pesoBagagemMao} kg</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${passenger.prioridade}</td>
      </tr>
    `).join('');

    const formatTrechos = (trechos: string | string[] | undefined): string => {
      if (!trechos) return '';
      if (typeof trechos === 'string') {
        return trechos.split(',').map(t => t.trim()).join(' - ');
      }
      if (Array.isArray(trechos)) {
        return trechos.map(t => t.trim()).join(' - ');
      }
      return String(trechos);
    };

    const trechosFormatted = formatTrechos(mission.trechos);

    printWindow.document.write(`
      <html>
        <head>
          <title>OFRAG ${mission.ofrag} (ARQUIVADA)</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .mission-info { margin-bottom: 20px; }
            .archived-stamp { color: red; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ORDEM DE VÔOO</h1>
            <h2>OFRAG ${mission.ofrag}</h2>
            <p class="archived-stamp">MISSÃO ARQUIVADA</p>
          </div>
          <div class="mission-info">
            <p><strong>Aeronave:</strong> ${mission.aeronave} (${mission.matricula})</p>
            <p><strong>Trechos:</strong> ${trechosFormatted}</p>
            <p><strong>Data do Voo:</strong> ${format(new Date(mission.dataVoo), 'dd/MM/yyyy')}</p>
            <p><strong>Base Aérea:</strong> ${mission.baseAerea}</p>
            <p><strong>Arquivada em:</strong> ${mission.archivedAt ? format(new Date(mission.archivedAt), 'dd/MM/yyyy \'às\' HH:mm') : ''}</p>
          </div>
          <h3>Lista de Passageiros</h3>
          <table>
            <thead>
              <tr>
                <th>Passageiro</th>
                <th>CPF</th>
                <th>Destino</th>
                <th>Peso Total</th>
                <th>Prioridade</th>
              </tr>
            </thead>
            <tbody>
              ${passengersHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
            const isCollapsed = collapsedMissions[mission.id];
            
            return (
              <Card key={mission.id} className="opacity-70 border-orange-500">
                <Collapsible>
                  <CollapsibleTrigger 
                    className="w-full"
                    onClick={() => toggleMissionCollapse(mission.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 text-left">
                          <CardTitle className="text-xl text-blue-700 flex items-center">
                            OFRAG {mission.ofrag}
                            <Badge className="ml-2 bg-orange-100 text-orange-800">
                              <Archive className="w-3 h-3 mr-1" />
                              Arquivada
                            </Badge>
                            {isCollapsed ? (
                              <ChevronDown className="w-4 h-4 ml-2" />
                            ) : (
                              <ChevronUp className="w-4 h-4 ml-2" />
                            )}
                          </CardTitle>
                          <div className="mt-2 space-y-1">
                            <p><strong>Aeronave:</strong> {mission.aeronave} ({mission.matricula})</p>
                            <p><strong>Data do Voo:</strong> {format(new Date(mission.dataVoo), 'dd/MM/yyyy')}</p>
                            {mission.archivedAt && (
                              <p><strong>Arquivada em:</strong> {format(new Date(mission.archivedAt), 'dd/MM/yyyy \'às\' HH:mm')}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <p><strong>Criada em:</strong> {format(new Date(mission.createdAt), 'dd/MM/yyyy \'às\' HH:mm')}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintMission(mission)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimir
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnarchiveMission(mission.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Undo className="w-4 h-4 mr-2" />
                            Desarquivar
                          </Button>
                          
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

                      {mission.passageiros && mission.passageiros.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Passageiros ({mission.passageiros.length})</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>CPF</TableHead>
                                <TableHead>Destino</TableHead>
                                <TableHead>Peso Total</TableHead>
                                <TableHead>Prioridade</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {mission.passageiros.map((passenger) => (
                                <TableRow key={passenger.id}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{passenger.posto} {passenger.nome}</p>
                                      {passenger.parentesco && (
                                        <p className="text-sm text-gray-500">({passenger.parentesco})</p>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>{passenger.cpf}</TableCell>
                                  <TableCell>{passenger.destino}</TableCell>
                                  <TableCell>
                                    {passenger.peso + passenger.pesoBagagem + passenger.pesoBagagemMao} kg
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">
                                      {passenger.prioridade}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhuma missão arquivada encontrada.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArchivedMissions;
