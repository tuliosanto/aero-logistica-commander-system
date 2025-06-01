
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Trash2, UserPlus, Edit } from 'lucide-react';
import { CANWaitlistPassenger } from '../types/CANWaitlist';
import { getRankOrder } from '../utils/constants';
import PriorityTooltip from './PriorityTooltip';

interface CANWaitlistProps {
  waitlist: CANWaitlistPassenger[];
  onAddToMission: (entry: CANWaitlistPassenger) => void;
  onRemove: (id: string) => void;
  onEdit: (entry: CANWaitlistPassenger) => void;
}

const destinationColors = [
  'bg-blue-100 text-blue-800 border-blue-300',
  'bg-green-100 text-green-800 border-green-300',
  'bg-purple-100 text-purple-800 border-purple-300',
  'bg-orange-100 text-orange-800 border-orange-300',
  'bg-pink-100 text-pink-800 border-pink-300',
  'bg-indigo-100 text-indigo-800 border-indigo-300',
  'bg-yellow-100 text-yellow-800 border-yellow-300',
  'bg-red-100 text-red-800 border-red-300',
];

const CANWaitlist = ({ waitlist, onAddToMission, onRemove, onEdit }: CANWaitlistProps) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const groupedWaitlist = useMemo(() => {
    // Filtrar apenas passageiros não alocados
    const availablePassengers = waitlist.filter(entry => !entry.isAllocated);
    
    const groups = availablePassengers.reduce((acc, entry) => {
      if (!acc[entry.destino]) {
        acc[entry.destino] = [];
      }
      acc[entry.destino].push(entry);
      return acc;
    }, {} as Record<string, CANWaitlistPassenger[]>);

    // Sort each group by priority first, then by military rank
    Object.keys(groups).forEach(destino => {
      groups[destino].sort((a, b) => {
        if (a.prioridade !== b.prioridade) {
          return a.prioridade - b.prioridade;
        }
        
        const rankOrderA = getRankOrder(a.posto);
        const rankOrderB = getRankOrder(b.posto);
        
        if (rankOrderA !== -1 && rankOrderB !== -1) {
          return rankOrderA - rankOrderB;
        } else if (rankOrderA !== -1) {
          return -1;
        } else if (rankOrderB !== -1) {
          return 1;
        }
        
        return a.posto.localeCompare(b.posto);
      });
    });

    return groups;
  }, [waitlist]);

  const toggleGroup = (destino: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(destino)) {
      newCollapsed.delete(destino);
    } else {
      newCollapsed.add(destino);
    }
    setCollapsedGroups(newCollapsed);
  };

  const getDestinationColor = (index: number) => {
    return destinationColors[index % destinationColors.length];
  };

  const availablePassengers = waitlist.filter(entry => !entry.isAllocated);

  if (availablePassengers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Espera CAN</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">Nenhum passageiro na lista de espera.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Espera CAN ({availablePassengers.length} passageiros disponíveis)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedWaitlist).map(([destino, entries], groupIndex) => {
          const isCollapsed = collapsedGroups.has(destino);
          const colorClass = getDestinationColor(groupIndex);
          
          return (
            <div key={destino} className={`border rounded-lg ${colorClass.split(' ')[0]} border-2`}>
              <Collapsible>
                <CollapsibleTrigger
                  onClick={() => toggleGroup(destino)}
                  className="w-full"
                >
                  <div className={`p-3 rounded-t-lg flex items-center justify-between hover:opacity-80 transition-opacity ${colorClass}`}>
                    <div className="flex items-center space-x-2">
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      <span className="font-semibold">
                        {destino} ({entries.length} passageiro{entries.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="bg-white rounded-b-lg border-t">
                    {entries.map((entry, index) => (
                      <div
                        key={entry.id}
                        className={`p-3 flex items-center justify-between ${
                          index !== entries.length - 1 ? 'border-b' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">
                              {entry.posto} {entry.nome}
                            </span>
                            <PriorityTooltip priority={entry.prioridade}>
                              <Badge variant="outline" className="cursor-help">
                                Prioridade {entry.prioridade}
                              </Badge>
                            </PriorityTooltip>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>CPF: {entry.cpf}</p>
                            <p>Peso: {entry.peso}kg | Bagagem: {entry.pesoBagagem + entry.pesoBagagemMao}kg</p>
                            <p>Data de Inscrição: {new Date(entry.dataInscricao).toLocaleDateString('pt-BR')}</p>
                            {entry.telefone && <p>Telefone: {entry.telefone}</p>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(entry)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAddToMission(entry)}
                            className="bg-green-50 hover:bg-green-100 text-green-700"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Adicionar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onRemove(entry.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CANWaitlist;
