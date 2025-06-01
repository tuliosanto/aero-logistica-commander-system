import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CANWaitlistPassenger } from '../types/CANWaitlist';
import { User } from '../types/User';
import { MILITARY_RANKS, PRIORITIES, AERODROMOS } from '../utils/constants';
import PriorityTooltip from './PriorityTooltip';

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
  const [peso, setPeso] = useState(passenger?.peso || 70);
  const [pesoBagagem, setPesoBagagem] = useState(passenger?.pesoBagagem || 0);
  const [pesoBagagemMao, setPesoBagagemMao] = useState(passenger?.pesoBagagemMao || 0);
  const [prioridade, setPrioridade] = useState(passenger?.prioridade || 13);
  const [responsavelInscricao, setResponsavelInscricao] = useState(passenger?.responsavelInscricao || '');
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
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const postos = [
    'MAR', 'ALM', 'GEN', 'VAlm', 'TGBr', 'CMG', 'CNL', 'CAlm', 'CCapCav', 'CFO',
    'CC', 'CF', 'CT', 'MAJ', 'CAP', 'PRI', 'SGT', 'CB', 'SD', 'MN',
    'CIV', 'DEP'
  ];

  const prioridades = [
    { value: 1, label: '1 - Comandante Supremo' },
    { value: 2, label: '2 - Ministro da Defesa' },
    { value: 3, label: '3 - Comandante da Aeronáutica' },
    { value: 4, label: '4 - Oficiais-Generais' },
    { value: 5, label: '5 - Oficiais Superiores' },
    { value: 6, label: '6 - Oficiais Intermediários' },
    { value: 7, label: '7 - Oficiais Subalternos' },
    { value: 8, label: '8 - Suboficiais e Sargentos' },
    { value: 9, label: '9 - Cabos e Soldados' },
    { value: 10, label: '10 - Dependentes de Militares' },
    { value: 11, label: '11 - Servidores Civis' },
    { value: 12, label: '12 - Pensionistas' },
    { value: 13, label: '13 - Pessoas Autorizadas' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="posto">Posto/Graduação</Label>
          <Select value={posto} onValueChange={setPosto}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o posto" />
            </SelectTrigger>
            <SelectContent>
              {postos.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
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
                  {aero.code} - {aero.name}
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

      <div className="space-y-2">
        <Label htmlFor="prioridade">Prioridade</Label>
        <Select value={prioridade.toString()} onValueChange={(value) => setPrioridade(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a prioridade" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map(priority => (
              <SelectItem key={priority.value} value={priority.value.toString()}>
                <PriorityTooltip priority={priority.value}>
                  <span>{priority.label}</span>
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
            onChange={e => setResponsavelInscricao(e.target.value)} 
            placeholder="Nome do responsável"
            required 
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
          {passenger ? 'Atualizar' : 'Cadastrar'} Passageiro
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default CANWaitlistForm;
