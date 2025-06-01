
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
  onSave?: (passenger: Omit<CANWaitlistPassenger, 'id' | 'dataInscricao' | 'baseAerea'>) => void;
  onSubmit?: (passenger: Omit<CANWaitlistPassenger, 'id' | 'dataInscricao' | 'baseAerea'>) => void;
  onCancel?: () => void;
  currentUser: User;
}

const CANWaitlistForm = ({ passenger, onSave, onSubmit, onCancel, currentUser }: CANWaitlistFormProps) => {
  const [posto, setPosto] = useState(passenger?.posto || '');
  const [nome, setNome] = useState(passenger?.nome || '');
  const [cpf, setCpf] = useState(passenger?.cpf || '');
  const [telefone, setTelefone] = useState(passenger?.telefone || '');
  const [destino, setDestino] = useState(passenger?.destino || '');
  const [peso, setPeso] = useState<number>(passenger?.peso || 70);
  const [pesoBagagem, setPesoBagagem] = useState<number>(passenger?.pesoBagagem || 0);
  const [pesoBagagemMao, setPesoBagagemMao] = useState(passenger?.pesoBagagemMao || 0);
  const [prioridade, setPrioridade] = useState(passenger?.prioridade || 13);
  const [responsavelInscricao, setResponsavelInscricao] = useState(passenger?.responsavelInscricao || 'O PRÓPRIO');
  const [parentesco, setParentesco] = useState(passenger?.parentesco || '');

  // Enhanced validation and filtering at component level
  const validRanks = MILITARY_RANKS.filter((rank, index) => {
    console.log(`CANWaitlistForm - Checking rank ${index}:`, rank, typeof rank);
    const isValid = rank && typeof rank === 'string' && rank.trim().length > 0;
    if (!isValid) {
      console.error('CANWaitlistForm - Filtering invalid rank:', rank, 'at index:', index);
    }
    return isValid;
  });

  const validAerodromos = AERODROMOS.filter((aero, index) => {
    console.log(`CANWaitlistForm - Checking aerodrome ${index}:`, aero);
    const isValid = aero && aero.code && typeof aero.code === 'string' && aero.code.trim().length > 0;
    if (!isValid) {
      console.error('CANWaitlistForm - Filtering invalid aerodrome:', aero, 'at index:', index);
    }
    return isValid;
  });

  const validPriorities = PRIORITIES.filter((priority, index) => {
    console.log(`CANWaitlistForm - Checking priority ${index}:`, priority);
    const isValid = priority && priority.value && typeof priority.value === 'number' && priority.value > 0;
    if (!isValid) {
      console.error('CANWaitlistForm - Filtering invalid priority:', priority, 'at index:', index);
    }
    return isValid;
  });

  console.log('CANWaitlistForm - Final validation results:', {
    validRanks: validRanks.length,
    validAerodromos: validAerodromos.length,
    validPriorities: validPriorities.length,
    originalRanks: MILITARY_RANKS.length,
    originalAerodromos: AERODROMOS.length,
    originalPriorities: PRIORITIES.length,
    firstRank: validRanks[0],
    firstAerodrome: validAerodromos[0]?.code,
    firstPriority: validPriorities[0]?.value
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passengerData = {
      posto,
      nome,
      cpf,
      telefone,
      destino,
      peso,
      pesoBagagem,
      pesoBagagemMao,
      prioridade,
      responsavelInscricao,
      parentesco
    };
    
    if (onSave) {
      onSave(passengerData);
    }
    if (onSubmit) {
      onSubmit(passengerData);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setTelefone(formatted);
  };

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
              {validRanks.map((rank, index) => {
                console.log(`CANWaitlistForm - About to render rank ${index}:`, rank);
                // Final safety check
                if (!rank || typeof rank !== 'string' || rank.trim() === '') {
                  console.error('CANWaitlistForm - CRITICAL: Attempting to render invalid rank:', rank, 'at index:', index);
                  return null;
                }
                return (
                  <SelectItem key={`rank-${index}-${rank}`} value={rank}>
                    {rank}
                  </SelectItem>
                );
              })}
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
          <Label htmlFor="telefone">Telefone para Contato</Label>
          <Input 
            id="telefone" 
            value={telefone} 
            onChange={handleTelefoneChange}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destino">Destino</Label>
        <Select value={destino} onValueChange={setDestino}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o destino" />
          </SelectTrigger>
          <SelectContent>
            {validAerodromos.map((aero, index) => {
              console.log(`CANWaitlistForm - About to render aerodrome ${index}:`, aero?.code);
              // Final safety check
              if (!aero || !aero.code || typeof aero.code !== 'string' || aero.code.trim() === '') {
                console.error('CANWaitlistForm - CRITICAL: Attempting to render invalid aerodrome:', aero, 'at index:', index);
                return null;
              }
              return (
                <SelectItem key={`aero-${index}-${aero.code}`} value={aero.code}>
                  {aero.code} - {aero.location}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
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
        <Select value={prioridade.toString()} onValueChange={(value) => setPrioridade(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a prioridade" />
          </SelectTrigger>
          <SelectContent>
            {validPriorities.map((priority, index) => {
              console.log(`CANWaitlistForm - About to render priority ${index}:`, priority?.value);
              // Final safety check
              if (!priority || !priority.value || typeof priority.value !== 'number' || priority.value < 1) {
                console.error('CANWaitlistForm - CRITICAL: Attempting to render invalid priority:', priority, 'at index:', index);
                return null;
              }
              return (
                <SelectItem key={`priority-${index}-${priority.value}`} value={priority.value.toString()}>
                  <PriorityTooltip priority={priority.value}>
                    <span>{priority.label}</span>
                  </PriorityTooltip>
                </SelectItem>
              );
            })}
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
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default CANWaitlistForm;
