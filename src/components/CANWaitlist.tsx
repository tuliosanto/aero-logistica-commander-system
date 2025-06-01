
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, UserPlus, Trash2, Plane } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CANWaitlistPassenger } from '../types/CANWaitlist';
import { User } from '../types/User';
import CANWaitlistForm from './CANWaitlistForm';

interface CANWaitlistProps {
  currentUser: User;
}

const CANWaitlist = ({ currentUser }: CANWaitlistProps) => {
  const [waitlistPassengers, setWaitlistPassengers] = useState<CANWaitlistPassenger[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<CANWaitlistPassenger | null>(null);

  useEffect(() => {
    loadWaitlistPassengers();
  }, [currentUser.baseAerea]);

  const loadWaitlistPassengers = () => {
    const allPassengers = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
    // Filtrar passageiros apenas da base aérea do usuário logado
    const basePassengers = allPassengers.filter((passenger: CANWaitlistPassenger) => 
      passenger.baseAerea === currentUser.baseAerea
    );
    setWaitlistPassengers(basePassengers);
  };

  const handleSavePassenger = (passengerData: Omit<CANWaitlistPassenger, 'id' | 'dataInscricao' | 'baseAerea'>) => {
    const allPassengers = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
    
    if (editingPassenger) {
      const updatedPassengers = allPassengers.map((p: CANWaitlistPassenger) =>
        p.id === editingPassenger.id 
          ? { 
              ...passengerData, 
              id: editingPassenger.id, 
              dataInscricao: editingPassenger.dataInscricao,
              baseAerea: currentUser.baseAerea 
            } 
          : p
      );
      localStorage.setItem('canWaitlist', JSON.stringify(updatedPassengers));
      
      toast({
        title: "Passageiro atualizado",
        description: `${passengerData.posto} ${passengerData.nome} foi atualizado na lista de espera.`,
      });
    } else {
      const newPassenger: CANWaitlistPassenger = {
        ...passengerData,
        id: Date.now().toString(),
        dataInscricao: new Date().toISOString(),
        baseAerea: currentUser.baseAerea,
      };
      
      allPassengers.push(newPassenger);
      localStorage.setItem('canWaitlist', JSON.stringify(allPassengers));
      
      toast({
        title: "Passageiro cadastrado",
        description: `${passengerData.posto} ${passengerData.nome} foi adicionado à lista de espera.`,
      });
    }
    
    loadWaitlistPassengers();
    setShowForm(false);
    setEditingPassenger(null);
  };

  const handleEditPassenger = (passenger: CANWaitlistPassenger) => {
    setEditingPassenger(passenger);
    setShowForm(true);
  };

  const handleDeletePassenger = (passengerId: string) => {
    const passenger = waitlistPassengers.find(p => p.id === passengerId);
    if (!passenger) return;

    if (confirm(`Tem certeza que deseja remover ${passenger.posto} ${passenger.nome} da lista de espera?`)) {
      const allPassengers = JSON.parse(localStorage.getItem('canWaitlist') || '[]');
      const updatedPassengers = allPassengers.filter((p: CANWaitlistPassenger) => p.id !== passengerId);
      localStorage.setItem('canWaitlist', JSON.stringify(updatedPassengers));
      loadWaitlistPassengers();
      
      toast({
        title: "Passageiro removido",
        description: `${passenger.posto} ${passenger.nome} foi removido da lista de espera.`,
      });
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 3) return 'bg-red-100 text-red-800';
    if (priority <= 6) return 'bg-orange-100 text-orange-800';
    if (priority <= 9) return 'bg-yellow-100 text-yellow-800';
    if (priority <= 12) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Lista de Espera CAN</h3>
          <p className="text-sm text-gray-600">
            {waitlistPassengers.length} passageiro{waitlistPassengers.length !== 1 ? 's' : ''} aguardando voo
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingPassenger(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Passageiro
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPassenger ? 'Editar Passageiro' : 'Cadastrar Passageiro na Lista de Espera'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CANWaitlistForm
              passenger={editingPassenger}
              onSave={handleSavePassenger}
              onCancel={() => {
                setShowForm(false);
                setEditingPassenger(null);
              }}
              currentUser={currentUser}
            />
          </CardContent>
        </Card>
      )}

      {waitlistPassengers.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Passageiro</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Peso Total</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Data Inscrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlistPassengers
                  .sort((a, b) => a.prioridade - b.prioridade)
                  .map((passenger) => (
                  <TableRow key={passenger.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{passenger.posto} {passenger.nome}</p>
                        <p className="text-sm text-gray-500">
                          {passenger.parentesco && `(${passenger.parentesco})`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{passenger.cpf}</TableCell>
                    <TableCell className="font-mono text-sm">{passenger.telefone}</TableCell>
                    <TableCell>{passenger.destino}</TableCell>
                    <TableCell>
                      {passenger.peso + passenger.pesoBagagem + passenger.pesoBagagemMao} kg
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(passenger.prioridade)}>
                        {passenger.prioridade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {passenger.isAllocated ? (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Plane className="w-3 h-3 mr-1" />
                          Alocado em Voo
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">
                          Aguardando
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{passenger.responsavelInscricao}</TableCell>
                    <TableCell>
                      {new Date(passenger.dataInscricao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPassenger(passenger)}
                          disabled={passenger.isAllocated}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePassenger(passenger.id)}
                          disabled={passenger.isAllocated}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhum passageiro na lista de espera.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CANWaitlist;
