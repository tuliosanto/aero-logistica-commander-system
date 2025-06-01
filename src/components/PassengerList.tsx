import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check } from 'lucide-react';
import { Passenger } from '../types/Mission';
import { MILITARY_RANKS, PRIORITIES, getRankOrder } from '../utils/constants';
import { toast } from '@/hooks/use-toast';

interface PassengerListProps {
  passengers: Passenger[];
  onPassengersChange: (passengers: Passenger[]) => void;
}

const PassengerList = ({ passengers, onPassengersChange }: PassengerListProps) => {
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
    prioridade: ''
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
      prioridade: ''
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
      checkedIn: false
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
      prioridade: passenger.prioridade.toString()
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

  const sortedPassengers = [...passengers].sort((a, b) => {
    // First by priority (lower number = higher priority)
    if (a.prioridade !== b.prioridade) {
      return a.prioridade - b.prioridade;
    }
    // Then by military rank (higher rank = higher priority)
    return getRankOrder(b.posto) - getRankOrder(a.posto);
  });

  const generateReport = () => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relação de Passageiros - Missão</title>
          <style>
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
          {passengers.length > 0 && (
            <Button 
              onClick={generateReport}
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100"
            >
              Gerar Relatório
            </Button>
          )}
          <Dialog open={isAddingPassenger} onOpenChange={setIsAddingPassenger}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setEditingPassenger(null);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Adicionar Passageiro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
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

      {sortedPassengers.length > 0 && (
        <div className="space-y-2">
          {sortedPassengers.map((passenger, index) => (
            <Card key={passenger.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="font-mono">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-semibold">
                      {passenger.posto} {passenger.nome}
                    </p>
                    <p className="text-sm text-gray-600">
                      CPF: {passenger.cpf || 'Não informado'} | Destino: {passenger.destino || 'Não informado'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm">
                    <p>PAX: {passenger.peso}kg | Bag: {passenger.pesoBagagem}kg | BM: {passenger.pesoBagagemMao}kg</p>
                    <p>Prioridade: {passenger.prioridade}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(passenger)}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(passenger.id)}
                    >
                      Remover
                    </Button>
                    <Button 
                      size="sm" 
                      variant={passenger.checkedIn ? "default" : "outline"}
                      onClick={() => toggleCheckIn(passenger.id)}
                      className={passenger.checkedIn ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {passenger.checkedIn ? <Check className="h-4 w-4" /> : "Check-in"}
                    </Button>
                  </div>
                  {passenger.checkedIn && (
                    <div className="flex items-center text-green-600">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
