
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Passenger } from '../types/Mission';
import { MILITARY_RANKS, AERODROMOS } from '../utils/constants';

interface EditPassengerModalProps {
  passenger: Passenger;
  onSave: (passenger: Passenger) => void;
  onCancel: () => void;
}

const EditPassengerModal = ({ passenger, onSave, onCancel }: EditPassengerModalProps) => {
  const [posto, setPosto] = useState(passenger.posto);
  const [nome, setNome] = useState(passenger.nome);
  const [cpf, setCpf] = useState(passenger.cpf);
  const [destino, setDestino] = useState(passenger.destino);
  const [peso, setPeso] = useState(passenger.peso);
  const [pesoBagagem, setPesoBagagem] = useState(passenger.pesoBagagem);
  const [pesoBagagemMao, setPesoBagagemMao] = useState(passenger.pesoBagagemMao);
  const [prioridade, setPrioridade] = useState(passenger.prioridade);
  const [responsavelInscricao, setResponsavelInscricao] = useState(passenger.responsavelInscricao);
  const [parentesco, setParentesco] = useState(passenger.parentesco);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...passenger,
      posto,
      nome,
      cpf,
      destino,
      peso,
      pesoBagagem,
      pesoBagagemMao,
      prioridade,
      responsavelInscricao,
      parentesco
    });
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Passageiro</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="posto">Posto/Graduação</Label>
              <Select value={posto} onValueChange={setPosto}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o posto" />
                </SelectTrigger>
                <SelectContent>
                  {MILITARY_RANKS.map(rank => (
                    <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input 
                id="nome" 
                value={nome} 
                onChange={e => setNome(e.target.value)} 
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
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                maxLength={14}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <Select value={destino} onValueChange={setDestino}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  {AERODROMOS.map(aero => (
                    <SelectItem key={aero.code} value={aero.code}>
                      {aero.code} - {aero.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input 
                id="peso" 
                type="number" 
                value={peso} 
                onChange={e => setPeso(Number(e.target.value))} 
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pesoBagagem">Bagagem Despachada (kg)</Label>
              <Input 
                id="pesoBagagem" 
                type="number" 
                value={pesoBagagem} 
                onChange={e => setPesoBagagem(Number(e.target.value))} 
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pesoBagagemMao">Bagagem de Mão (kg)</Label>
              <Input 
                id="pesoBagagemMao" 
                type="number" 
                value={pesoBagagemMao} 
                onChange={e => setPesoBagagemMao(Number(e.target.value))} 
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prioridade">Prioridade</Label>
            <Input 
              id="prioridade" 
              type="number" 
              value={prioridade} 
              onChange={e => setPrioridade(Number(e.target.value))} 
              min="1"
              max="20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavelInscricao">Responsável pela Inscrição</Label>
              <Input 
                id="responsavelInscricao" 
                value={responsavelInscricao} 
                onChange={e => setResponsavelInscricao(e.target.value)} 
                placeholder="Nome do responsável"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentesco">Parentesco (se aplicável)</Label>
              <Input 
                id="parentesco" 
                value={parentesco} 
                onChange={e => setParentesco(e.target.value)} 
                placeholder="Ex: Cônjuge, Filho(a), etc."
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPassengerModal;
