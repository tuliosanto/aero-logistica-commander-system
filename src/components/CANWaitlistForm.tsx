import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CANWaitlistPassenger } from '../types/CANWaitlist';
import { User } from '../types/User';
import { MILITARY_RANKS, AERODROMOS } from '../utils/constants';
import { calculateEndDate } from '../utils/validityUtils';

interface CANWaitlistFormProps {
  passenger?: CANWaitlistPassenger | null;
  onSave: (passenger: Omit<CANWaitlistPassenger, 'id' | 'dataInscricao' | 'baseAerea' | 'dataFimValidade'>) => void;
  onCancel: () => void;
  currentUser: User;
}

const CANWaitlistForm = ({ passenger, onSave, onCancel, currentUser }: CANWaitlistFormProps) => {
  const [posto, setPosto] = useState(passenger?.posto || '');
  const [nome, setNome] = useState(passenger?.nome || '');
  const [cpf, setCpf] = useState(passenger?.cpf || '');
  const [telefone, setTelefone] = useState(passenger?.telefone || '');
  const [destino, setDestino] = useState(passenger?.destino || '');
  const [peso, setPeso] = useState<string>(passenger?.peso?.toString() || '');
  const [pesoBagagem, setPesoBagagem] = useState<string>(passenger?.pesoBagagem?.toString() || '');
  const [pesoBagagemMao, setPesoBagagemMao] = useState<string>(passenger?.pesoBagagemMao?.toString() || '');
  const [responsavelInscricao, setResponsavelInscricao] = useState(passenger?.responsavelInscricao || 'O PRÓPRIO');
  const [parentesco, setParentesco] = useState(passenger?.parentesco || '');
  
  const [dataInicioValidade, setDataInicioValidade] = useState(
    passenger?.dataInicioValidade || new Date().toISOString().split('T')[0]
  );
  const [dataFimValidade, setDataFimValidade] = useState(passenger?.dataFimValidade || '');

  useEffect(() => {
    if (dataInicioValidade) {
      const endDate = calculateEndDate(dataInicioValidade);
      setDataFimValidade(endDate);
    }
  }, [dataInicioValidade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      posto,
      nome,
      cpf,
      telefone,
      destino,
      peso: Number(peso),
      pesoBagagem: Number(pesoBagagem),
      pesoBagagemMao: Number(pesoBagagemMao),
      prioridade: 13,
      responsavelInscricao,
      parentesco,
      dataInicioValidade,
      dataFimValidade
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
          <Label htmlFor="telefone">Telefone para Contato</Label>
          <Input 
            id="telefone" 
            value={telefone} 
            onChange={handleTelefoneChange}
            placeholder="(11) 99999-9999"
            maxLength={15}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="space-y-2">
          <Label htmlFor="dataInicioValidade">Data de Início da Validade</Label>
          <Input 
            id="dataInicioValidade" 
            type="date"
            value={dataInicioValidade} 
            onChange={e => setDataInicioValidade(e.target.value)}
            required
          />
          <p className="text-xs text-gray-600">
            Data a partir da qual a inscrição é válida
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataFimValidade">Data de Fim da Validade</Label>
          <Input 
            id="dataFimValidade" 
            type="date"
            value={dataFimValidade}
            readOnly
            className="bg-gray-100"
          />
          <p className="text-xs text-gray-600">
            Calculado automaticamente: início + 10 dias
          </p>
        </div>
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

      <div className="space-y-2">
        <Label htmlFor="peso">Peso (kg)</Label>
        <Input 
          id="peso" 
          type="number" 
          value={peso} 
          onChange={e => setPeso(e.target.value)} 
          min="1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pesoBagagem">Peso da Bagagem (kg)</Label>
          <Input 
            id="pesoBagagem" 
            type="number" 
            value={pesoBagagem} 
            onChange={e => setPesoBagagem(e.target.value)} 
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pesoBagagemMao">Peso da Bagagem de Mão (kg)</Label>
          <Input 
            id="pesoBagagemMao" 
            type="number" 
            value={pesoBagagemMao} 
            onChange={e => setPesoBagagemMao(e.target.value)} 
            min="0"
          />
        </div>
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default CANWaitlistForm;
