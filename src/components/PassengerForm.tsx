
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, X } from 'lucide-react';
import { Passenger } from '../types/Mission';
import { POSTOS_MILITARES } from '../utils/constants';
import { toast } from '@/hooks/use-toast';

interface PassengerFormProps {
  onAddPassenger: (passenger: Passenger) => void;
  destinations: string[];
}

const PassengerForm = ({ onAddPassenger, destinations }: PassengerFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [posto, setPosto] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [destino, setDestino] = useState('');
  const [peso, setPeso] = useState('');
  const [pesoBagagem, setPesoBagagem] = useState('');
  const [pesoBagagemMao, setPesoBagagemMao] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [responsavelInscricao, setResponsavelInscricao] = useState('O PRÓPRIO');
  const [parentesco, setParentesco] = useState('');

  const resetForm = () => {
    setPosto('');
    setNome('');
    setCpf('');
    setDestino('');
    setPeso('');
    setPesoBagagem('');
    setPesoBagagemMao('');
    setPrioridade('');
    setResponsavelInscricao('O PRÓPRIO');
    setParentesco('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!posto || !nome || !cpf || !destino || !peso || !prioridade) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newPassenger: Passenger = {
      id: Date.now().toString(),
      posto,
      nome: nome.toUpperCase(),
      cpf,
      destino,
      peso: Number(peso),
      pesoBagagem: Number(pesoBagagem) || 0,
      pesoBagagemMao: Number(pesoBagagemMao) || 0,
      prioridade: Number(prioridade),
      responsavelInscricao,
      parentesco,
      checkedIn: false
    };

    onAddPassenger(newPassenger);
    resetForm();
    setIsOpen(false);
    
    toast({
      title: "Passageiro adicionado",
      description: `${posto} ${nome} foi adicionado à missão.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Passageiro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Adicionar Novo Passageiro
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="posto">Posto/Graduação *</Label>
              <Select value={posto} onValueChange={setPosto} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o posto" />
                </SelectTrigger>
                <SelectContent>
                  {POSTOS_MILITARES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destino">Destino *</Label>
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
              <Label htmlFor="peso">Peso (kg) *</Label>
              <Input
                id="peso"
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="70"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pesoBagagem">Bagagem Despachada (kg)</Label>
              <Input
                id="pesoBagagem"
                type="number"
                value={pesoBagagem}
                onChange={(e) => setPesoBagagem(e.target.value)}
                placeholder="23"
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
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prioridade">Prioridade (1-13) *</Label>
            <Select value={prioridade} onValueChange={setPrioridade} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    Prioridade {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável pela Inscrição</Label>
              <Input
                id="responsavel"
                value={responsavelInscricao}
                onChange={(e) => setResponsavelInscricao(e.target.value)}
                placeholder="O PRÓPRIO"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentesco">Parentesco</Label>
              <Input
                id="parentesco"
                value={parentesco}
                onChange={(e) => setParentesco(e.target.value)}
                placeholder="Ex: CÔNJUGE, FILHO(A)"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Adicionar Passageiro
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PassengerForm;
