
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CANWaitlistPassenger } from '../types/CANWaitlist';
import { User } from '../types/User';
import { MILITARY_RANKS, AERODROMOS } from '../utils/constants';

interface CANWaitlistFormProps {
  passenger?: CANWaitlistPassenger | null;
  onSave: (passenger: Omit<CANWaitlistPassenger, 'id' | 'dataInscricao' | 'baseAerea'>) => void;
  onCancel: () => void;
  currentUser: User;
}

const CANWaitlistForm = ({ passenger, onSave, onCancel, currentUser }: CANWaitlistFormProps) => {
  const [posto, setPosto] = useState(passenger?.posto || '');
  const [nome, setNome] = useState(passenger?.nome || '');
  const [cpf, setCpf] = useState(passenger?.cpf || '');
  const [destino, setDestino] = useState(passenger?.destino || '');
  const [peso, setPeso] = useState(passenger?.peso || 80);
  const [pesoBagagem, setPesoBagagem] = useState(passenger?.pesoBagagem || 0);
  const [pesoBagagemMao, setPesoBagagemMao] = useState(passenger?.pesoBagagemMao || 0);
  const [prioridade, setPrioridade] = useState(passenger?.prioridade || 4);
  const [responsavelInscricao, setResponsavelInscricao] = useState(passenger?.responsavelInscricao || `${currentUser.posto} ${currentUser.nomeGuerra}`);
  const [parentesco, setParentesco] = useState(passenger?.parentesco || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
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
    const cleanValue = value.replace(/\D/g, '');
    const formatted = cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formatted;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.replace(/\D/g, '').length <= 11) {
      setCpf(formatCPF(value));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="posto">Posto</Label>
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
                  {aero.code} - {aero.name}
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
            onChange={e => setPeso(Number(e.target.value))} 
            min="1"
            required 
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prioridade">Prioridade</Label>
          <Select value={prioridade.toString()} onValueChange={value => setPrioridade(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Urgentíssima</SelectItem>
              <SelectItem value="2">2 - Urgente</SelectItem>
              <SelectItem value="3">3 - Prioritária</SelectItem>
              <SelectItem value="4">4 - Rotina</SelectItem>
              <SelectItem value="5">5 - A pedido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="parentesco">Parentesco (opcional)</Label>
          <Input 
            id="parentesco" 
            value={parentesco} 
            onChange={e => setParentesco(e.target.value)} 
            placeholder="Ex: Filho, Cônjuge, etc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsavelInscricao">Responsável pela Inscrição</Label>
        <Input 
          id="responsavelInscricao" 
          value={responsavelInscricao} 
          onChange={e => setResponsavelInscricao(e.target.value)} 
          required 
        />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {passenger ? 'Atualizar' : 'Cadastrar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default CANWaitlistForm;
