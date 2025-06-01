import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, ArrowLeft } from 'lucide-react';
import { Passenger } from '../types/Mission';
import { MILITARY_RANKS, PRIORITIES, getRankOrder, AIR_BASES } from '../utils/constants';
import { toast } from '@/hooks/use-toast';
import PriorityTooltip from './PriorityTooltip';

interface PassengerListProps {
  passengers: Passenger[];
  onPassengersChange: (passengers: Passenger[]) => void;
  baseAerea?: string;
  showMoveToWaitlist?: boolean;
  onMoveToWaitlist?: (passenger: Passenger) => void;
}

const PassengerList = ({ 
  passengers, 
  onPassengersChange, 
  baseAerea,
  showMoveToWaitlist = false,
  onMoveToWaitlist
}: PassengerListProps) => {
  const [isAddingPassenger, setIsAddingPassenger] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    posto: '',
    nome: '',
    cpf: '',
    destino: '',
    peso: '',
    pesoBagagem: '',
    pesoBagagemMao: '',
    prioridade: '2',
    responsavelInscricao: 'O PRÓPRIO',
    parentesco: ''
  });

  const resetForm = () => {
    setFormData({
      posto: '',
      nome: '',
      cpf: '',
      destino: '',
      peso: '',
      pesoBagagem: '',
      pesoBagagemMao: '',
      prioridade: '2',
      responsavelInscricao: 'O PRÓPRIO',
      parentesco: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passengerData: Passenger = {
      id: editingPassenger || Date.now().toString(),
      posto: formData.posto,
      nome: formData.nome,
      cpf: formData.cpf || '',
      destino: formData.destino || '',
      peso: Number(formData.peso) || 0,
      pesoBagagem: Number(formData.pesoBagagem) || 0,
      pesoBagagemMao: Number(formData.pesoBagagemMao) || 0,
      prioridade: Number(formData.prioridade) || 1,
      checkedIn: false,
      responsavelInscricao: formData.responsavelInscricao,
      parentesco: formData.parentesco
    };

    if (editingPassenger) {
      const updatedPassengers = passengers.map(p => 
        p.id === editingPassenger ? { ...passengerData, checkedIn: p.checkedIn } : p
      );
      onPassengersChange(updatedPassengers);
      setEditingPassenger(null);
      toast({
        title: "Passageiro atualizado",
        description: `${passengerData.posto} ${passengerData.nome} foi atualizado.`,
      });
    } else {
      onPassengersChange([...passengers, passengerData]);
      toast({
        title: "Passageiro adicionado",
        description: `${passengerData.posto} ${passengerData.nome} foi adicionado à lista.`,
      });
    }

    resetForm();
    setIsAddingPassenger(false);
  };

  const handleEdit = (passenger: Passenger) => {
    setFormData({
      posto: passenger.posto,
      nome: passenger.nome,
      cpf: passenger.cpf,
      destino: passenger.destino,
      peso: passenger.peso.toString(),
      pesoBagagem: passenger.pesoBagagem.toString(),
      pesoBagagemMao: passenger.pesoBagagemMao.toString(),
      prioridade: passenger.prioridade.toString(),
      responsavelInscricao: passenger.responsavelInscricao || 'O Próprio',
      parentesco: passenger.parentesco || ''
    });
    setEditingPassenger(passenger.id);
    setIsAddingPassenger(true);
  };

  const handleDelete = (passengerId: string) => {
    const updatedPassengers = passengers.filter(p => p.id !== passengerId);
    onPassengersChange(updatedPassengers);
    toast({
      title: "Passageiro removido",
      description: "O passageiro foi removido da lista.",
    });
  };

  const toggleCheckIn = (passengerId: string) => {
    const updatedPassengers = passengers.map(p => 
      p.id === passengerId ? { ...p, checkedIn: !p.checkedIn } : p
    );
    onPassengersChange(updatedPassengers);
    
    const passenger = passengers.find(p => p.id === passengerId);
    if (passenger) {
      toast({
        title: passenger.checkedIn ? "Check-in desfeito" : "Check-in realizado",
        description: `${passenger.posto} ${passenger.nome}`,
      });
    }
  };

  const generateReport = () => {
    const baseInfo = AIR_BASES.find(base => base.code === baseAerea);
    const baseName = baseInfo ? baseInfo.name : baseAerea || 'BASE AÉREA';
    
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relação de Passageiros - Missão</title>
          <style>
            @page { size: landscape; margin: 20mm; }
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .mission-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .totals { margin-top: 20px; }
            .signature { margin-top: 50px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>FORÇA AÉREA BRASILEIRA</h2>
            <h3>${baseName}</h3>
            <h3>RELAÇÃO DE PASSAGEIROS</h3>
          </div>
          
          <div class="mission-info">
            <p><strong>OFRAG:</strong> [A ser preenchido]</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            <p><strong>Total de Passageiros:</strong> ${passengers.length}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Seq</th>
                <th>Posto</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Destino</th>
                <th>Peso PAX</th>
                <th>Bagagem</th>
                <th>Bag. Mão</th>
                <th>Prior.</th>
              </tr>
            </thead>
            <tbody>
              ${sortedPassengers.map((passenger, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${passenger.posto}</td>
                  <td>${passenger.nome}</td>
                  <td>${passenger.cpf}</td>
                  <td>${passenger.destino}</td>
                  <td>${passenger.peso} kg</td>
                  <td>${passenger.pesoBagagem} kg</td>
                  <td>${passenger.pesoBagagemMao} kg</td>
                  <td>${passenger.prioridade}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <p><strong>Peso Total Passageiros:</strong> ${sortedPassengers.reduce((sum, p) => sum + p.peso, 0)} kg</p>
            <p><strong>Peso Total Bagagens:</strong> ${sortedPassengers.reduce((sum, p) => sum + p.pesoBagagem + p.pesoBagagemMao, 0)} kg</p>
            <p><strong>Peso Total Geral:</strong> ${sortedPassengers.reduce((sum, p) => sum + p.peso + p.pesoBagagem + p.pesoBagagemMao, 0)} kg</p>
          </div>

          <div class="signature">
            <p>___________________________________</p>
            <p>Assinatura do Operador</p>
          </div>
        </body>
      </html>
    `;

    reportWindow.document.write(reportContent);
    reportWindow.document.close();
    reportWindow.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lista de Passageiros</h3>
        <div className="space-x-2">
          <Dialog open={isAddingPassenger} onOpenChange={setIsAddingPassenger}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setEditingPassenger(null);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Adicionar Passageiro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPassenger ? 'Editar Passageiro' : 'Adicionar Novo Passageiro'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="posto">Posto Militar *</Label>
                    <Select value={formData.posto} onValueChange={(value) => setFormData({...formData, posto: value})}>
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
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destino">Destino</Label>
                    <Input
                      id="destino"
                      value={formData.destino}
                      onChange={(e) => setFormData({...formData, destino: e.target.value})}
                      placeholder="Ex: SBRF, SBCO"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso PAX (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      value={formData.peso}
                      onChange={(e) => setFormData({...formData, peso: e.target.value})}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pesoBagagem">Bagagem (kg)</Label>
                    <Input
                      id="pesoBagagem"
                      type="number"
                      value={formData.pesoBagagem}
                      onChange={(e) => setFormData({...formData, pesoBagagem: e.target.value})}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pesoBagagemMao">Bag. Mão (kg)</Label>
                    <Input
                      id="pesoBagagemMao"
                      type="number"
                      value={formData.pesoBagagemMao}
                      onChange={(e) => setFormData({...formData, pesoBagagemMao: e.target.value})}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select value={formData.prioridade} onValueChange={(value) => setFormData({...formData, prioridade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="1-13" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map(priority => (
                          <SelectItem key={priority} value={priority.toString()}>{priority}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavelInscricao">Responsável pela Inscrição</Label>
                    <Input
                      id="responsavelInscricao"
                      value={formData.responsavelInscricao}
                      onChange={(e) => setFormData({...formData, responsavelInscricao: e.target.value})}
                      placeholder="O Próprio"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentesco">Parentesco</Label>
                    <Input
                      id="parentesco"
                      value={formData.parentesco}
                      onChange={(e) => setFormData({...formData, parentesco: e.target.value})}
                      placeholder="Ex: Cônjuge, Filho(a), etc."
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingPassenger ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsAddingPassenger(false);
                      setEditingPassenger(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-2">
        {passengers
          .sort((a, b) => {
            if (a.prioridade !== b.prioridade) {
              return a.prioridade - b.prioridade;
            }
            const rankA = getRankOrder(a.posto);
            const rankB = getRankOrder(b.posto);
            return rankA - rankB;
          })
          .map((passenger) => (
            <div key={passenger.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">{passenger.posto} {passenger.nome}</p>
                  <p className="text-sm text-gray-500">
                    CPF: {passenger.cpf} | Destino: {passenger.destino}
                    {passenger.parentesco && ` | ${passenger.parentesco}`}
                    {passenger.fromWaitlist && (
                      <span className="text-blue-600 font-semibold"> | Da lista de espera</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    Peso: {passenger.peso}kg | Bagagem: {passenger.pesoBagagem}kg | Bagagem de mão: {passenger.pesoBagagemMao}kg
                  </p>
                  <p className="text-sm text-gray-600">
                    Responsável: {passenger.responsavelInscricao}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(passenger.prioridade)}>
                    Prioridade {passenger.prioridade}
                  </Badge>
                  {passenger.checkedIn && (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Check-in
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {!passenger.checkedIn && (
                  <Button 
                    size="sm" 
                    onClick={() => toggleCheckIn(passenger.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Check-in
                  </Button>
                )}
                {passenger.checkedIn && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleCheckIn(passenger.id)}
                  >
                    Desfazer Check-in
                  </Button>
                )}
                {editingPassenger === passenger.id ? (
                  <Button size="sm" onClick={() => saveEdit(passenger.id)}>
                    Salvar
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => startEdit(passenger)}
                  >
                    Editar
                  </Button>
                )}
                {showMoveToWaitlist && onMoveToWaitlist && passenger.fromWaitlist && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onMoveToWaitlist(passenger)}
                    className="text-orange-600 hover:bg-orange-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Lista de Espera
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => removePassenger(passenger.id)}
                >
                  Remover
                </Button>
              </div>

              {editingPassenger === passenger.id && (
                <Dialog open={true} onOpenChange={() => setEditingPassenger(null)}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Editar Passageiro</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-posto">Posto</Label>
                        <Select value={formData.posto} onValueChange={(value) => setFormData({...formData, posto: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o posto" />
                          </SelectTrigger>
                          <SelectContent>
                            {MILITARY_RANKS.map(rank => (
                              <SelectItem key={rank} value={rank}>
                                {rank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-nome">Nome Completo *</Label>
                        <Input
                          id="edit-nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-cpf">CPF</Label>
                        <Input
                          id="edit-cpf"
                          value={formData.cpf}
                          onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                          placeholder="000.000.000-00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-destino">Destino</Label>
                        <Input
                          id="edit-destino"
                          value={formData.destino}
                          onChange={(e) => setFormData({...formData, destino: e.target.value})}
                          placeholder="Ex: SBRF, SBCO"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-peso">Peso PAX (kg)</Label>
                        <Input
                          id="edit-peso"
                          type="number"
                          value={formData.peso}
                          onChange={(e) => setFormData({...formData, peso: e.target.value})}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-pesoBagagem">Bagagem (kg)</Label>
                        <Input
                          id="edit-pesoBagagem"
                          type="number"
                          value={formData.pesoBagagem}
                          onChange={(e) => setFormData({...formData, pesoBagagem: e.target.value})}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-pesoBagagemMao">Bag. Mão (kg)</Label>
                        <Input
                          id="edit-pesoBagagemMao"
                          type="number"
                          value={formData.pesoBagagemMao}
                          onChange={(e) => setFormData({...formData, pesoBagagemMao: e.target.value})}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-prioridade">Prioridade</Label>
                        <Select value={formData.prioridade.toString()} onValueChange={(value) => setFormData({...formData, prioridade: parseInt(value)})}>
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

                      <div className="space-y-2">
                        <Label htmlFor="edit-responsavelInscricao">Responsável pela Inscrição</Label>
                        <Input
                          id="edit-responsavelInscricao"
                          value={formData.responsavelInscricao}
                          onChange={(e) => setFormData({...formData, responsavelInscricao: e.target.value})}
                          placeholder="O Próprio"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-parentesco">Parentesco</Label>
                        <Input
                          id="edit-parentesco"
                          value={formData.parentesco}
                          onChange={(e) => setFormData({...formData, parentesco: e.target.value})}
                          placeholder="Ex: Cônjuge, Filho(a), etc."
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
      </div>

      {sortedPassengers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum passageiro cadastrado ainda.</p>
          <p className="text-sm">Clique em "Adicionar Passageiro" para começar.</p>
        </div>
      )}
    </div>
  );
};

export default PassengerList;
