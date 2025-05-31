import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mission, Passenger } from '../types/Mission';
import { User } from '../types/User';
import PassengerList from './PassengerList';
import { toast } from '@/hooks/use-toast';
interface MissionFormProps {
  onSave: (mission: Mission) => void;
  currentUser: User;
  mission?: Mission;
}
const MissionForm = ({
  onSave,
  currentUser,
  mission
}: MissionFormProps) => {
  const [aeronave, setAeronave] = useState(mission?.aeronave || '');
  const [matricula, setMatricula] = useState(mission?.matricula || '');
  const [trechos, setTrechos] = useState(mission?.trechos.join('\n') || '');
  const [dataVoo, setDataVoo] = useState(mission?.dataVoo || '');
  const [ofrag, setOfrag] = useState(mission?.ofrag || '');
  const [passageiros, setPassageiros] = useState<Passenger[]>(mission?.passageiros || []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missionData: Mission = {
      id: mission?.id || Date.now().toString(),
      aeronave,
      matricula: matricula || '',
      trechos: trechos ? trechos.split('\n').filter(t => t.trim()) : [],
      dataVoo: dataVoo || new Date().toISOString().split('T')[0],
      ofrag: ofrag || '',
      operadorId: currentUser.id,
      passageiros,
      createdAt: mission?.createdAt || new Date().toISOString()
    };
    onSave(missionData);
    if (!mission) {
      // Reset form for new mission
      setAeronave('');
      setMatricula('');
      setTrechos('');
      setDataVoo('');
      setOfrag('');
      setPassageiros([]);
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
  return <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="aeronave">Aeronave *</Label>
            <Input id="aeronave" value={aeronave} onChange={e => setAeronave(e.target.value)} placeholder="Ex: KC-390, C-130, etc." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input id="matricula" value={matricula} onChange={e => setMatricula(e.target.value)} placeholder="Ex: FAB2855" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="trechos">Trechos (um por linha)</Label>
          <Textarea id="trechos" value={trechos} onChange={e => setTrechos(e.target.value)} placeholder="Ex:&#10;SBGL-SBRF&#10;SBRF-SBCO&#10;SBCO-SBGL" rows={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataVoo">Data do Voo</Label>
            <Input id="dataVoo" type="date" value={dataVoo} onChange={e => setDataVoo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ofrag">OFRAG</Label>
            <Input id="ofrag" value={ofrag} onChange={e => setOfrag(e.target.value)} placeholder="Ex: 2024/001" />
          </div>
        </div>

        <Button type="submit" className="bg-green-700 hover:bg-green-800">
          {mission ? 'Atualizar Missão' : 'Cadastrar Missão'}
        </Button>
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
          
          {passageiros.length > 0 && <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-blue-800">Peso Total PAX</p>
                  <p className="text-2xl font-bold text-blue-900">{weights.totalPassengers} kg</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-orange-800">Peso Total Bagagens</p>
                  <p className="text-2xl font-bold text-orange-900">{weights.totalBaggage} kg</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-green-800">Peso Total</p>
                  <p className="text-2xl font-bold text-green-900">{weights.totalCombined} kg</p>
                </CardContent>
              </Card>
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default MissionForm;