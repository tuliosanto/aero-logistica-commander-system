import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mission, Passenger } from '../types/Mission';
import { User } from '../types/User';
import PassengerList from './PassengerList';
import { toast } from '@/hooks/use-toast';
import { AERODROMOS, getAerodromoByBase } from '../utils/constants';

interface MissionFormProps {
  onSave: (mission: Mission) => void;
  onCancel?: () => void;
  currentUser: User;
  mission?: Mission;
}

const MissionForm = ({
  onSave,
  onCancel,
  currentUser,
  mission
}: MissionFormProps) => {
  const [aeronave, setAeronave] = useState(mission?.aeronave || '');
  const [matricula, setMatricula] = useState(mission?.matricula || '');
  const [dataVoo, setDataVoo] = useState(mission?.dataVoo || '');
  const [ofrag, setOfrag] = useState(mission?.ofrag || '');
  const [passageiros, setPassageiros] = useState<Passenger[]>(mission?.passageiros || []);
  
  // Estados para os trechos
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
  }, [currentUser.baseAerea, mission]);

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

  const clearTrecho = (trechoSetter: (value: string) => void) => {
    trechoSetter('');
  };

  const formatFlightRoute = () => {
    const trechos = [origem, trecho1, trecho2, trecho3, trecho4, trecho5, trecho6].filter(t => t.trim());
    return trechos.join(' - ');
  };

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
              <Select value={origem} onValueChange={setOrigem}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  {AERODROMOS.map(aero => (
                    <SelectItem key={aero.code} value={aero.code}>
                      {aero.code} - {aero.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="trecho1">Trecho 1 (Opcional)</Label>
                {trecho1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => clearTrecho(setTrecho1)}
                    className="text-xs"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <Select value={trecho1} onValueChange={setTrecho1}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  {AERODROMOS.map(aero => (
                    <SelectItem key={aero.code} value={aero.code}>
                      {aero.code} - {aero.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="trecho2">Trecho 2 (Opcional)</Label>
                {trecho2 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => clearTrecho(setTrecho2)}
                    className="text-xs"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <Select value={trecho2} onValueChange={setTrecho2}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  {AERODROMOS.map(aero => (
                    <SelectItem key={aero.code} value={aero.code}>
                      {aero.code} - {aero.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="trecho3">Trecho 3 (Opcional)</Label>
                {trecho3 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => clearTrecho(setTrecho3)}
                    className="text-xs"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <Select value={trecho3} onValueChange={setTrecho3}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  {AERODROMOS.map(aero => (
                    <SelectItem key={aero.code} value={aero.code}>
                      {aero.code} - {aero.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="trecho4">Trecho 4 (Opcional)</Label>
                {trecho4 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => clearTrecho(setTrecho4)}
                    className="text-xs"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <Select value={trecho4} onValueChange={setTrecho4}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  {AERODROMOS.map(aero => (
                    <SelectItem key={aero.code} value={aero.code}>
                      {aero.code} - {aero.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="trecho5">Trecho 5 (Opcional)</Label>
                {trecho5 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => clearTrecho(setTrecho5)}
                    className="text-xs"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <Select value={trecho5} onValueChange={setTrecho5}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  {AERODROMOS.map(aero => (
                    <SelectItem key={aero.code} value={aero.code}>
                      {aero.code} - {aero.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="trecho6">Trecho 6 (Opcional)</Label>
                {trecho6 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => clearTrecho(setTrecho6)}
                    className="text-xs"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <Select value={trecho6} onValueChange={setTrecho6}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  {AERODROMOS.map(aero => (
                    <SelectItem key={aero.code} value={aero.code}>
                      {aero.code} - {aero.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataVoo">Data do Voo</Label>
            <Input 
              id="dataVoo" 
              type="date" 
              value={dataVoo} 
              onChange={e => setDataVoo(e.target.value)} 
            />
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
          <PassengerList passengers={passageiros} onPassengersChange={setPassageiros} />
          
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
