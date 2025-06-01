import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, UserCheck, UserX, CheckCircle, ArrowLeft, UserPlus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Passenger } from '../types/Mission';
import { getRankOrder } from '../utils/constants';
import PriorityTooltip from './PriorityTooltip';

interface PassengerListProps {
  passengers: Passenger[];
  onPassengersChange: (passengers: Passenger[]) => void;
  showMoveToWaitlist?: boolean;
  onMoveToWaitlist?: (passenger: Passenger) => void;
  onComplete?: () => void;
  showAddPassengerButton?: boolean;
  onAddPassenger?: () => void;
}

const PassengerList = ({ 
  passengers, 
  onPassengersChange, 
  showMoveToWaitlist = false,
  onMoveToWaitlist,
  onComplete,
  showAddPassengerButton = false,
  onAddPassenger
}: PassengerListProps) => {
  // Sort passengers by priority first, then by military rank
  const sortedPassengers = [...passengers].sort((a, b) => {
    // First sort by priority (lower number = higher priority)
    if (a.prioridade !== b.prioridade) {
      return a.prioridade - b.prioridade;
    }
    
    // If same priority, sort by military rank
    const rankOrderA = getRankOrder(a.posto);
    const rankOrderB = getRankOrder(b.posto);
    
    if (rankOrderA !== -1 && rankOrderB !== -1) {
      return rankOrderA - rankOrderB;
    } else if (rankOrderA !== -1) {
      return -1;
    } else if (rankOrderB !== -1) {
      return 1;
    }
    
    // If neither has a military rank, sort alphabetically
    return a.posto.localeCompare(b.posto);
  });

  const handleRemove = (passengerId: string) => {
    const updatedPassengers = passengers.filter(p => p.id !== passengerId);
    onPassengersChange(updatedPassengers);
  };

  const handleToggleCheckIn = (passengerId: string) => {
    const updatedPassengers = passengers.map(p => 
      p.id === passengerId ? { ...p, checkedIn: !p.checkedIn } : p
    );
    onPassengersChange(updatedPassengers);
  };

  if (passengers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Lista de Passageiros</span>
            {showAddPassengerButton && onAddPassenger && (
              <Button onClick={onAddPassenger} className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Passageiro
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">Nenhum passageiro adicionado ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Lista de Passageiros ({passengers.length})</span>
          <div className="flex gap-2">
            {showAddPassengerButton && onAddPassenger && (
              <Button onClick={onAddPassenger} className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Passageiro
              </Button>
            )}
            {onComplete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Concluir Missão
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Concluir Missão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja concluir esta missão? Esta ação não pode ser desfeita.
                      Os passageiros da lista de espera serão removidos permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                      Concluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedPassengers.map((passenger, index) => (
            <div
              key={passenger.id}
              className={`p-3 border rounded-lg ${
                passenger.checkedIn 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-blue-600 text-sm">#{index + 1}</span>
                    <span className="font-medium">
                      {passenger.posto} {passenger.nome}
                    </span>
                    <PriorityTooltip priority={passenger.prioridade}>
                      <Badge variant="outline" className="cursor-help">
                        Prioridade {passenger.prioridade}
                      </Badge>
                    </PriorityTooltip>
                    {passenger.fromWaitlist && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Lista de Espera
                      </Badge>
                    )}
                    {passenger.checkedIn && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Check-in Realizado
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                    <div>
                      <p><span className="font-medium">CPF:</span> {passenger.cpf}</p>
                      <p><span className="font-medium">Destino:</span> {passenger.destino}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Peso:</span> {passenger.peso}kg</p>
                      <p><span className="font-medium">Bagagem:</span> {passenger.pesoBagagem + passenger.pesoBagagemMao}kg</p>
                    </div>
                  </div>
                  {passenger.responsavelInscricao && passenger.responsavelInscricao !== 'O PRÓPRIO' && (
                    <div className="text-sm text-gray-600 mt-1">
                      <p><span className="font-medium">Responsável:</span> {passenger.responsavelInscricao}</p>
                      {passenger.parentesco && (
                        <p><span className="font-medium">Parentesco:</span> {passenger.parentesco}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleCheckIn(passenger.id)}
                    className={passenger.checkedIn 
                      ? "bg-red-50 hover:bg-red-100 text-red-700" 
                      : "bg-green-50 hover:bg-green-100 text-green-700"
                    }
                  >
                    {passenger.checkedIn ? (
                      <>
                        <UserX className="w-4 h-4 mr-1" />
                        Desfazer Check-in
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        Check-in
                      </>
                    )}
                  </Button>
                  {showMoveToWaitlist && passenger.fromWaitlist && onMoveToWaitlist && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMoveToWaitlist(passenger)}
                      className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Retornar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemove(passenger.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PassengerList;
