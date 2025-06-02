
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mission } from '../types/Mission';
import { User } from '../types/User';
import { Plane, Users, Weight, X } from 'lucide-react';
import { getRankOrder } from '../utils/constants';

interface MissionConsultModalProps {
  mission: Mission;
  onClose: () => void;
  currentUser: User;
}

const MissionConsultModal = ({ mission, onClose, currentUser }: MissionConsultModalProps) => {
  // Sort passengers by priority first, then by military rank
  const sortedPassengers = [...mission.passageiros].sort((a, b) => {
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Consultar Missão - OFRAG {mission.ofrag}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mission Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Missão</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Aeronave</label>
                <p className="font-medium">{mission.aeronave}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Matrícula</label>
                <p className="font-medium">{mission.matricula}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Data do Voo</label>
                <p className="font-medium">{new Date(mission.dataVoo).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">OFRAG</label>
                <p className="font-medium">{mission.ofrag}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Trechos</label>
                <p className="font-medium">{mission.trechos.join(' → ')}</p>
              </div>
              {mission.horarioChamada && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Horário de Chamada</label>
                  <p className="font-medium">{mission.horarioChamada}</p>
                </div>
              )}
              {mission.horarioDecolagem && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Horário de Decolagem</label>
                  <p className="font-medium">{mission.horarioDecolagem}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Passengers List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lista de Passageiros ({mission.passageiros.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedPassengers.map((passenger, index) => (
                  <div
                    key={passenger.id}
                    className="p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-blue-600 text-sm">#{index + 1}</span>
                          <span className="font-medium">
                            {passenger.posto} {passenger.nome}
                          </span>
                          <Badge variant="outline">
                            Prioridade {passenger.prioridade}
                          </Badge>
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{mission.passageiros.length} passageiros</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Weight className="w-4 h-4" />
                      <span className="font-medium">
                        {mission.passageiros.reduce((sum, p) => sum + p.peso + p.pesoBagagem + p.pesoBagagemMao, 0)} kg total
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionConsultModal;
