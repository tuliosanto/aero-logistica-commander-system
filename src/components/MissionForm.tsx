
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserPlus, ArrowLeft, Calendar, CheckCircle } from 'lucide-react';
import { Mission, Passenger } from '../types/Mission';
import { User } from '../types/User';
import { CANWaitlistPassenger } from '../types/CANWaitlist';
import PassengerList from './PassengerList';
import { toast } from '@/hooks/use-toast';
import { AERODROMOS, getAerodromoByBase } from '../utils/constants';

interface MissionFormProps {
  onSave: (mission: Mission) => void;
  onCancel?: () => void;
  currentUser: User;
  mission?: Mission;
  onComplete?: (mission: Mission) => void;
}

const MissionForm = ({
  onSave,
  onCancel,
  currentUser,
  mission,
  onComplete
}: MissionFormProps) => {
  const [aeronave, setAeronave] = useState(mission?.aeronave || '');
  const [matricula, setMatricula] = useState(mission?.matricula || '');
  const [dataVoo, setDataVoo] = useState(mission?.dataVoo || '');
  const [ofrag, setOfrag] = useState(mission?.ofrag || '');
  const [passageiros, setPassageiros] = useState<Passenger[]>(mission?.passageiros || []);
  const [waitlistPassengers, setWaitlistPassengers] = useState<CANWaitlistPassenger[]>([]);
  
  // Estados para os trechos como text inputs
  const [origem, setOrigem] = useState('');
  const [trecho1, setTrecho1] = useState('');
  const [trecho2, setTrecho2] = useState('');
  const [trecho3, setTrecho3] = useState('');
  const [trecho4, setTrecho4] = useState('');
  const [trecho5, setTrecho5] = useState('');
  const [trecho6, setTrecho6] = useState('');

  useEffect(() => {
    // Define origem padrão baseada na base aérea do usuário
    const defaultOrigem = getAerodromoByBase(currentUser.baseAerea);
    setOrigem(defaultOrigem);

    // Se estiver editando uma missão, carrega os trechos existentes
    if (mission && mission.trechos.length > 0) {
      setOrigem(mission.trechos[0] || defaultOrigem);
      setTrecho1(mission.trechos[1] || '');
      setTrecho2(mission.trechos[2] || '');
      setTrecho3(mission.trechos[3] || '');
      setTrecho4(mission.trechos[4] || '');
      setTrecho5(mission.trechos[5] || '');
      setTrecho6(mission.trechos[6] || '');
    }

    // Carregar lista de espera
    loadWaitlistPassengers();
  }, [currentUser.baseAerea, mission]);

  const loadWaitlistPassengers = () => {
    const allPassengers = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
    const basePassengers = allPassengers.filter((passenger: CANWaitlistPassenger) => 
      passenger.baseAerea === currentUser.baseAerea
    );
    setWaitlistPassengers(basePassengers);
  };

  const getCompatibleWaitlistPassengers = () => {
    const trechos = [origem, trecho1, trecho2, trecho3, trecho4, trecho5, trecho6].filter(t => t.trim());
    if (trechos.length === 0) return [];
    
    // Buscar passageiros cujo destino coincida com qualquer um dos trechos
    return waitlistPassengers.filter(passenger => 
      trechos.includes(passenger.destino) &&
      !passageiros.some(p => p.cpf === passenger.cpf)
    ).sort((a, b) => a.prioridade - b.prioridade);
  };

  const getDestinationsText = () => {
    const trechos = [origem, trecho1, trecho2, trecho3, trecho4, trecho5, trecho6].filter(t => t.trim());
    return trechos.length > 1 ? trechos.slice(1).join("-").toUpperCase() : 'Nenhum destino definido';
  };

  const moveFromWaitlistToMission = (waitlistPassenger: CANWaitlistPassenger) => {
    const newPassenger: Passenger = {
      id: Date.now().toString(),
      posto: waitlistPassenger.posto,
      nome: waitlistPassenger.nome,
      cpf: waitlistPassenger.cpf,
      destino: waitlistPassenger.destino,
      peso: waitlistPassenger.peso,
      pesoBagagem: waitlistPassenger.pesoBagagem,
      pesoBagagemMao: waitlistPassenger.pesoBagagemMao,
      prioridade: waitlistPassenger.prioridade,
      responsavelInscricao: waitlistPassenger.responsavelInscricao,
      parentesco: waitlistPassenger.parentesco,
      checkedIn: false,
      fromWaitlist: true,
      waitlistId: waitlistPassenger.id
    };

    setPassageiros([...passageiros, newPassenger]);
    
    // Marcar como alocado na lista de espera
    const allWaitlistPassengers = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
    const updatedWaitlistPassengers = allWaitlistPassengers.map((p: CANWaitlistPassenger) =>
      p.id === waitlistPassenger.id 
        ? { ...p, isAllocated: true, missionId: mission?.id || 'new' }
        : p
    );
    localStorage.setItem('canWaitlist', JSON.stringify(updatedWaitlistPassengers));
    loadWaitlistPassengers();
    
    toast({
      title: "Passageiro adicionado",
      description: `${waitlistPassenger.posto} ${waitlistPassenger.nome} foi movido da lista de espera para a missão.`,
    });
  };

  const moveFromMissionToWaitlist = (passenger: Passenger) => {
    // Só permite mover se o passageiro veio da lista de espera
    if (!passenger.fromWaitlist) {
      toast({
        title: "Ação não permitida",
        description: "Apenas passageiros que vieram da lista de espera podem ser retornados a ela.",
        variant: "destructive"
      });
      return;
    }

    setPassageiros(passageiros.filter(p => p.id !== passenger.id));
    
    // Desmarcar como alocado na lista de espera
    if (passenger.waitlistId) {
      const allWaitlistPassengers = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
      const updatedWaitlistPassengers = allWaitlistPassengers.map((p: CANWaitlistPassenger) =>
        p.id === passenger.waitlistId 
          ? { ...p, isAllocated: false, missionId: undefined }
          : p
      );
      localStorage.setItem('canWaitlist', JSON.stringify(updatedWaitlistPassengers));
      loadWaitlistPassengers();
    }
    
    toast({
      title: "Passageiro removido",
      description: `${passenger.posto} ${passenger.nome} foi removido da missão e retornado à lista de espera.`,
    });
  };

  const handleCompleteMission = () => {
    if (!mission) return;

    const completedMission: Mission = {
      ...mission,
      isCompleted: true,
      passageiros
    };

    // Remover passageiros da lista de espera que estão na missão
    const allWaitlistPassengers = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
    const passageirosFromWaitlist = passageiros.filter(p => p.fromWaitlist && p.waitlistId);
    const waitlistIdsToRemove = passageirosFromWaitlist.map(p => p.waitlistId);
    
    const updatedWaitlistPassengers = allWaitlistPassengers.filter((p: CANWaitlistPassenger) => 
      !waitlistIdsToRemove.includes(p.id)
    );
    localStorage.setItem('canWaitlist', JSON.stringify(updatedWaitlistPassengers));

    if (onComplete) {
      onComplete(completedMission);
    }

    toast({
      title: "Missão concluída",
      description: `OFRAG ${mission.ofrag} foi concluída com sucesso. Passageiros da lista de espera foram removidos.`,
    });
  };

  const setTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setDataVoo(today);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Monta array de trechos, incluindo apenas os preenchidos
    const trechos = [origem, trecho1, trecho2, trecho3, trecho4, trecho5, trecho6].filter(t => t.trim());
    
    const missionData: Mission = {
      id: mission?.id || Date.now().toString(),
      aeronave,
      matricula: matricula || '',
      trechos,
      dataVoo: dataVoo || new Date().toISOString().split('T')[0],
      ofrag: ofrag || '',
      operadorId: currentUser.id,
      passageiros,
      createdAt: mission?.createdAt || new Date().toISOString(),
      baseAerea: currentUser.baseAerea
    };

    onSave(missionData);
    if (!mission) {
      // Reset form for new mission
      setAeronave('');
      setMatricula('');
      setDataVoo('');
      setOfrag('');
      setPassageiros([]);
      const defaultOrigem = getAerodromoByBase(currentUser.baseAerea);
      setOrigem(defaultOrigem);
      setTrecho1('');
      setTrecho2('');
      setTrecho3('');
      setTrecho4('');
      setTrecho5('');
      setTrecho6('');
    }
    toast({
      title: mission ? "Missão atualizada" : "Missão cadastrada",
      description: `OFRAG ${ofrag || 'sem número'} ${mission ? 'atualizada' : 'cadastrada'} com sucesso!`
    });
  };

  const calculateTotalWeights = () => {
    const totalPassengers = passageiros.reduce((sum, p) => sum + p.peso, 0);
    const totalBaggage = passageiros.reduce((sum, p) => sum + p.pesoBagagem + p.pesoBagagemMao, 0);
    return {
      totalPassengers,
      totalBaggage,
      totalCombined: totalPassengers + totalBaggage
    };
  };

  const weights = calculateTotalWeights();

  const formatFlightRoute = () => {
    const trechos = [origem, trecho1, trecho2, trecho3, trecho4, trecho5, trecho6].filter(t => t.trim());
    return trechos.join(' - ');
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 3) return 'bg-red-100 text-red-800';
    if (priority <= 6) return 'bg-orange-100 text-orange-800';
    if (priority <= 9) return 'bg-yellow-100 text-yellow-800';
    if (priority <= 12) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const compatiblePassengers = getCompatibleWaitlistPassengers();

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="aeronave">Aeronave</Label>
            <Input 
              id="aeronave" 
              value={aeronave} 
              onChange={e => setAeronave(e.target.value)} 
              placeholder="Ex: KC-390, C-130, etc." 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input 
              id="matricula" 
              value={matricula} 
              onChange={e => setMatricula(e.target.value)} 
              placeholder="Ex: FAB2855" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">Trechos do Voo</Label>
            <div className="text-sm text-gray-600">
              <strong>Rota:</strong> {formatFlightRoute() || 'Nenhum trecho definido'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origem">Origem</Label>
              <Input 
                id="origem" 
                value={origem} 
                onChange={e => setOrigem(e.target.value)} 
                placeholder="Ex: SBGL, SBBR, etc."
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trecho1">Trecho 1 (Opcional)</Label>
              <Input 
                id="trecho1" 
                value={trecho1} 
                onChange={e => setTrecho1(e.target.value)} 
                placeholder="Ex: SBGL, SBBR, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trecho2">Trecho 2 (Opcional)</Label>
              <Input 
                id="trecho2" 
                value={trecho2} 
                onChange={e => setTrecho2(e.target.value)} 
                placeholder="Ex: SBGL, SBBR, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trecho3">Trecho 3 (Opcional)</Label>
              <Input 
                id="trecho3" 
                value={trecho3} 
                onChange={e => setTrecho3(e.target.value)} 
                placeholder="Ex: SBGL, SBBR, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trecho4">Trecho 4 (Opcional)</Label>
              <Input 
                id="trecho4" 
                value={trecho4} 
                onChange={e => setTrecho4(e.target.value)} 
                placeholder="Ex: SBGL, SBBR, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trecho5">Trecho 5 (Opcional)</Label>
              <Input 
                id="trecho5" 
                value={trecho5} 
                onChange={e => setTrecho5(e.target.value)} 
                placeholder="Ex: SBGL, SBBR, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trecho6">Trecho 6 (Opcional)</Label>
              <Input 
                id="trecho6" 
                value={trecho6} 
                onChange={e => setTrecho6(e.target.value)} 
                placeholder="Ex: SBGL, SBBR, etc."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataVoo">Data do Voo</Label>
            <div className="flex gap-2">
              <Input 
                id="dataVoo" 
                type="date" 
                value={dataVoo} 
                onChange={e => setDataVoo(e.target.value)} 
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={setTodayDate}
                className="flex items-center gap-1"
              >
                <Calendar className="w-4 h-4" />
                Hoje
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ofrag">OFRAG</Label>
            <Input 
              id="ofrag" 
              value={ofrag} 
              onChange={e => setOfrag(e.target.value)} 
              placeholder="Ex: 2024/001" 
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {mission ? 'Atualizar Missão' : 'Cadastrar Missão'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      <Separator />

      {/* Lista de Espera Compatível */}
      {compatiblePassengers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Passageiros na Lista de Espera - Destinos: {getDestinationsText()}
              <Badge variant="secondary">{compatiblePassengers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {compatiblePassengers.map((passenger) => (
                <div key={passenger.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{passenger.posto} {passenger.nome}</p>
                      <p className="text-sm text-gray-500">
                        Destino: {passenger.destino} • Peso Total: {passenger.peso + passenger.pesoBagagem + passenger.pesoBagagemMao} kg
                        {passenger.parentesco && ` • ${passenger.parentesco}`}
                        {passenger.isAllocated && (
                          <span className="text-orange-600 font-semibold"> • Já alocado em outra missão</span>
                        )}
                      </p>
                    </div>
                    <Badge className={getPriorityColor(passenger.prioridade)}>
                      Prioridade {passenger.prioridade}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => moveFromWaitlistToMission(passenger)}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={passenger.isAllocated}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Lista de Passageiros</span>
            <span className="text-sm font-normal text-gray-600">
              Total: {passageiros.length} passageiros
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PassengerList 
            passengers={passageiros} 
            onPassengersChange={setPassageiros}
            showMoveToWaitlist={true}
            onMoveToWaitlist={moveFromMissionToWaitlist}
            onComplete={mission && !mission.isCompleted ? handleCompleteMission : undefined}
          />
          
          {passageiros.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-blue-800">Peso Total PAX</p>
                  <p className="text-2xl font-bold text-blue-900">{weights.totalPassengers} kg</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-gray-800">Peso Total Bagagens</p>
                  <p className="text-2xl font-bold text-gray-900">{weights.totalBaggage} kg</p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-yellow-800">Peso Total</p>
                  <p className="text-2xl font-bold text-yellow-900">{weights.totalCombined} kg</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MissionForm;
