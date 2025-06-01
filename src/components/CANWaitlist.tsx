
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '../types/User';
import { CANWaitlistPassenger } from '../types/CANWaitlist';
import { Mission } from '../types/Mission';
import CANWaitlistForm from './CANWaitlistForm';
import { AERODROMOS } from '../utils/constants';
import { toast } from '@/hooks/use-toast';
import PriorityTooltip from './PriorityTooltip';

interface CANWaitlistProps {
  currentUser: User;
  missions?: Mission[];
  onPassengerAllocated?: (passenger: CANWaitlistPassenger, missionId: string) => void;
}

const CANWaitlist = ({ currentUser, missions = [], onPassengerAllocated }: CANWaitlistProps) => {
  const [waitlistPassengers, setWaitlistPassengers] = useState<CANWaitlistPassenger[]>([]);
  const [compatiblePassengers, setCompatiblePassengers] = useState<CANWaitlistPassenger[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // Helper function to safely parse trechos
  const parseTrechos = (trechos: string | string[] | undefined): string[] => {
    if (!trechos) return [];
    
    // If it's already an array, return it
    if (Array.isArray(trechos)) {
      return trechos;
    }
    
    // If it's a string, split by comma
    if (typeof trechos === 'string') {
      return trechos.split(',').map(t => t.trim()).filter(t => t);
    }
    
    // Fallback
    return [];
  };

  useEffect(() => {
    loadWaitlistPassengers();
  }, [currentUser.baseAerea]);

  useEffect(() => {
    if (selectedMission) {
      updateCompatiblePassengers();
    }
  }, [selectedMission, waitlistPassengers]);

  const loadWaitlistPassengers = () => {
    const stored = localStorage.getItem(`waitlist_${currentUser.baseAerea}`);
    if (stored) {
      const passengers = JSON.parse(stored) as CANWaitlistPassenger[];
      setWaitlistPassengers(passengers.filter(p => !p.isAllocated));
    }
  };

  const updateCompatiblePassengers = () => {
    if (!selectedMission) {
      setCompatiblePassengers([]);
      return;
    }

    // Use the safe parseTrechos function instead of direct .split()
    const trechosArray = parseTrechos(selectedMission.trechos);
    const missionDestinations = trechosArray
      .flatMap(trecho => trecho.split('-').map(dest => dest.trim()))
      .filter(dest => dest.length > 0);

    const compatible = waitlistPassengers.filter(passenger => 
      !passenger.isAllocated && 
      missionDestinations.includes(passenger.destino)
    );

    // Sort by priority first, then by military rank
    compatible.sort((a, b) => {
      if (a.prioridade !== b.prioridade) {
        return a.prioridade - b.prioridade;
      }
      return a.posto.localeCompare(b.posto);
    });

    setCompatiblePassengers(compatible);
  };

  const saveWaitlistPassengers = (passengers: CANWaitlistPassenger[]) => {
    localStorage.setItem(`waitlist_${currentUser.baseAerea}`, JSON.stringify(passengers));
    setWaitlistPassengers(passengers.filter(p => !p.isAllocated));
  };

  const addToWaitlist = (passenger: Omit<CANWaitlistPassenger, 'id' | 'dataInscricao' | 'baseAerea'>) => {
    const newPassenger: CANWaitlistPassenger = {
      ...passenger,
      id: Date.now().toString(),
      dataInscricao: new Date().toISOString(),
      baseAerea: currentUser.baseAerea,
    };

    const allPassengers = [...waitlistPassengers, newPassenger];
    saveWaitlistPassengers(allPassengers);
    
    toast({
      title: "Passageiro adicionado à lista de espera",
      description: `${passenger.posto} ${passenger.nome} foi adicionado com sucesso.`,
    });
  };

  const removeFromWaitlist = (passengerId: string) => {
    const passenger = waitlistPassengers.find(p => p.id === passengerId);
    if (!passenger) return;

    if (confirm(`Tem certeza que deseja remover ${passenger.posto} ${passenger.nome} da lista de espera?`)) {
      const updated = waitlistPassengers.filter(p => p.id !== passengerId);
      saveWaitlistPassengers(updated);
      
      toast({
        title: "Passageiro removido",
        description: `${passenger.posto} ${passenger.nome} foi removido da lista de espera.`,
      });
    }
  };

  const allocateToMission = (passenger: CANWaitlistPassenger) => {
    if (!selectedMission || !onPassengerAllocated) return;

    // Mark passenger as allocated
    const updatedPassengers = waitlistPassengers.map(p =>
      p.id === passenger.id
        ? { ...p, isAllocated: true, missionId: selectedMission.id }
        : p
    );

    const allStoredPassengers = JSON.parse(localStorage.getItem(`waitlist_${currentUser.baseAerea}`) || '[]');
    const allUpdatedPassengers = allStoredPassengers.map((p: CANWaitlistPassenger) =>
      p.id === passenger.id
        ? { ...p, isAllocated: true, missionId: selectedMission.id }
        : p
    );

    localStorage.setItem(`waitlist_${currentUser.baseAerea}`, JSON.stringify(allUpdatedPassengers));
    setWaitlistPassengers(updatedPassengers.filter(p => !p.isAllocated));

    onPassengerAllocated(passenger, selectedMission.id);
    
    toast({
      title: "Passageiro alocado à missão",
      description: `${passenger.posto} ${passenger.nome} foi alocado à missão OFRAG ${selectedMission.ofrag}.`,
    });
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 3) return 'bg-red-100 text-red-800';
    if (priority <= 6) return 'bg-orange-100 text-orange-800';
    if (priority <= 9) return 'bg-yellow-100 text-yellow-800';
    if (priority <= 12) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  // Group passengers by destination with colors
  const groupedPassengers = waitlistPassengers.reduce((groups, passenger) => {
    if (!groups[passenger.destino]) {
      groups[passenger.destino] = [];
    }
    groups[passenger.destino].push(passenger);
    return groups;
  }, {} as Record<string, CANWaitlistPassenger[]>);

  const destinationColors = [
    'bg-blue-50 border-blue-200',
    'bg-green-50 border-green-200',
    'bg-yellow-50 border-yellow-200',
    'bg-purple-50 border-purple-200',
    'bg-pink-50 border-pink-200',
    'bg-indigo-50 border-indigo-200',
    'bg-red-50 border-red-200',
    'bg-orange-50 border-orange-200'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lista de Espera CAN</h2>
        <p className="text-sm text-gray-600">Base: {currentUser.baseAerea}</p>
      </div>

      <Tabs defaultValue="waitlist" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waitlist">Lista de Espera</TabsTrigger>
          <TabsTrigger value="add">Adicionar Passageiro</TabsTrigger>
          {missions.length > 0 && (
            <TabsTrigger value="allocate">Alocar para Missões</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="waitlist" className="space-y-4">
          {Object.keys(groupedPassengers).length > 0 ? (
            Object.entries(groupedPassengers).map(([destination, passengers], index) => {
              const colorClass = destinationColors[index % destinationColors.length];
              const aeroporto = AERODROMOS.find(a => a.code === destination);
              
              return (
                <Card key={destination} className={`border-2 ${colorClass}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Destino: {destination} - {aeroporto?.name || 'Aeroporto não identificado'}
                      <Badge className="ml-2" variant="secondary">
                        {passengers.length} passageiro{passengers.length !== 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Passageiro</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Peso Total</TableHead>
                          <TableHead>Prioridade</TableHead>
                          <TableHead>Data Inscrição</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {passengers
                          .sort((a, b) => {
                            if (a.prioridade !== b.prioridade) {
                              return a.prioridade - b.prioridade;
                            }
                            return a.posto.localeCompare(b.posto);
                          })
                          .map((passenger) => (
                            <TableRow key={passenger.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{passenger.posto} {passenger.nome}</p>
                                  {passenger.parentesco && (
                                    <p className="text-sm text-gray-500">({passenger.parentesco})</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono text-sm">{passenger.cpf}</span>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono text-sm">{passenger.telefone}</span>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {passenger.peso + passenger.pesoBagagem + passenger.pesoBagagemMao} kg
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PAX: {passenger.peso}kg | Desp: {passenger.pesoBagagem}kg | Mão: {passenger.pesoBagagemMao}kg
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <PriorityTooltip priority={passenger.prioridade}>
                                  <Badge className={getPriorityColor(passenger.prioridade)}>
                                    {passenger.prioridade}
                                  </Badge>
                                </PriorityTooltip>
                              </TableCell>
                              <TableCell>
                                {new Date(passenger.dataInscricao).toLocaleDateString('pt-BR')}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeFromWaitlist(passenger.id)}
                                >
                                  Remover
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhum passageiro na lista de espera.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="add">
          <CANWaitlistForm 
            currentUser={currentUser}
            onSubmit={addToWaitlist}
          />
        </TabsContent>

        {missions.length > 0 && (
          <TabsContent value="allocate" className="space-y-4">
            <h3 className="text-xl font-semibold">Alocar Passageiros para Missões</h3>
            {missions.length === 0 ? (
              <p className="text-gray-500">Nenhuma missão cadastrada para alocação.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor="missionSelect" className="text-sm font-medium text-gray-700">
                    Selecione a Missão:
                  </label>
                  <select
                    id="missionSelect"
                    className="px-4 py-2 border rounded-md text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => {
                      const missionId = e.target.value;
                      const mission = missions.find(m => m.id === missionId);
                      setSelectedMission(mission || null);
                    }}
                    value={selectedMission?.id || ''}
                  >
                    <option value="">Selecione...</option>
                    {missions.map((mission) => (
                      <option key={mission.id} value={mission.id}>
                        {mission.ofrag} - {mission.aeronave} ({mission.matricula})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMission ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Passageiros Compatíveis para OFRAG {selectedMission.ofrag}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {compatiblePassengers.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Passageiro</TableHead>
                              <TableHead>CPF</TableHead>
                              <TableHead>Telefone</TableHead>
                              <TableHead>Peso Total</TableHead>
                              <TableHead>Prioridade</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {compatiblePassengers.map((passenger) => (
                              <TableRow key={passenger.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{passenger.posto} {passenger.nome}</p>
                                    {passenger.parentesco && (
                                      <p className="text-sm text-gray-500">({passenger.parentesco})</p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="font-mono text-sm">{passenger.cpf}</span>
                                </TableCell>
                                <TableCell>
                                  <span className="font-mono text-sm">{passenger.telefone}</span>
                                </TableCell>
                                <TableCell>
                                  {passenger.peso + passenger.pesoBagagem + passenger.pesoBagagemMao} kg
                                </TableCell>
                                <TableCell>
                                  <Badge className={getPriorityColor(passenger.prioridade)}>
                                    {passenger.prioridade}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    onClick={() => allocateToMission(passenger)}
                                  >
                                    Alocar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-gray-500">
                          Nenhum passageiro compatível encontrado para esta missão.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <p className="text-gray-500">Selecione uma missão para ver os passageiros compatíveis.</p>
                )}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CANWaitlist;
