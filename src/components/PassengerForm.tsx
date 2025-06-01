
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import { Passenger } from '../types/Mission';
import { MILITARY_RANKS, PRIORITIES } from '../utils/constants';
import PriorityTooltip from './PriorityTooltip';

interface PassengerFormProps {
  onAddPassenger: (passenger: Passenger) => void;
  destinations: string[];
}

const PassengerForm = ({ onAddPassenger, destinations }: PassengerFormProps) => {
  const [open, setOpen] = useState(false);
  const [posto, setPosto] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [destino, setDestino] = useState('');
  const [peso, setPeso] = useState('');
  const [pesoBagagem, setPesoBagagem] = useState('');
  const [pesoBagagemMao, setPesoBagagemMao] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [responsavelInscricao, setResponsavelInscricao] = useState('');
  const [parentesco, setParentesco] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passenger: Passenger = {
      id: Date.now().toString(),
      posto,
      nome,
      cpf,
      destino,
      peso: Number(peso),
      pesoBagagem: Number(pesoBagagem),
      pesoBagagemMao: Number(pesoBagagemMao),
      prioridade: Number(prioridade),
      responsavelInscricao,
      parentesco,
      checkedIn: false
    };

    onAddPassenger(passenger);
    
    // Reset form
    setPosto('');
    setNome('');
    setCpf('');
    setDestino('');
    setPeso('');
    setPesoBagagem('');
    setPesoBagagemMao('');
    setPrioridade('');
    setResponsavelInscricao('');
    setParentesco('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar Passageiro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Passageiro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="posto">Posto/Graduação</Label>
              <Select value={posto} onValueChange={setPosto} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o posto" />
                </SelectTrigger>
                <SelectContent>
                  {MILITARY_RANKS.map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo do passageiro"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <Select value={destino} onValueChange={setDestino} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="peso">Peso PAX (kg)</Label>
              <Input
                id="peso"
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="75"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pesoBagagem">Bagagem (kg)</Label>
              <Input
                id="pesoBagagem"
                type="number"
                value={pesoBagagem}
                onChange={(e) => setPesoBagagem(e.target.value)}
                placeholder="20"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pesoBagagemMao">Bagagem de Mão (kg)</Label>
              <Input
                id="pesoBagagemMao"
                type="number"
                value={pesoBagagemMao}
                onChange={(e) => setPesoBagagemMao(e.target.value)}
                placeholder="5"
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select value={prioridade} onValueChange={setPrioridade} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value.toString()}>
                    <PriorityTooltip priority={priority.value}>
                      <span className="cursor-help">{priority.label}</span>
                    </PriorityTooltip>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavelInscricao">Responsável pela Inscrição</Label>
              <Input
                id="responsavelInscricao"
                value={responsavelInscricao}
                onChange={(e) => setResponsavelInscricao(e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentesco">Parentesco</Label>
              <Input
                id="parentesco"
                value={parentesco}
                onChange={(e) => setParentesco(e.target.value)}
                placeholder="Grau de parentesco"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Adicionar Passageiro
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PassengerForm;
