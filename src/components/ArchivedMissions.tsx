import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Mission } from '../types/Mission';
import { User } from '../types/User';
import { Calendar as CalendarIcon, Plane, Users, Weight, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ArchivedMissionsFilter from './ArchivedMissionsFilter';
import MissionConsultModal from './MissionConsultModal';

interface ArchivedMissionsProps {
  missions: Mission[];
  currentUser: User;
}

const ArchivedMissions = ({
  missions,
  currentUser
}: ArchivedMissionsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const formatDateForPrint = (date: Date): string => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const formatTimeForPrint = (date: Date): string => {
    return format(date, 'HH:mm', { locale: ptBR });
  };

  const getMissionsForDate = (date: Date): Mission[] => {
    const formattedDate = formatDate(date);
    return missions.filter(mission => formatDate(parseISO(mission.dataVoo)) === formattedDate);
  };

  const getUniqueDates = (): Date[] => {
    const uniqueDates = new Set<string>();
    return missions.map(mission => parseISO(mission.dataVoo))
      .filter(date => {
        const formattedDate = formatDate(date);
        if (!uniqueDates.has(formattedDate)) {
          uniqueDates.add(formattedDate);
          return true;
        }
        return false;
      });
  };

  const handlePrint = (mission: Mission) => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const reportContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Missão - ${mission.ofrag}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            text-align: center;
            color: #333;
          }
          .mission-info {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .mission-info h2 {
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .passengers-list {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .passengers-list th, .passengers-list td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .passengers-list th {
            background-color: #f5f5f5;
          }
        </style>
      </head>
      <body>
        <h1>Relatório de Missão</h1>
        <div class="mission-info">
          <h2>Informações da Missão</h2>
          <p><strong>Aeronave:</strong> ${mission.aeronave}</p>
          <p><strong>Matrícula:</strong> ${mission.matricula}</p>
          <p><strong>Data do Voo:</strong> ${formatDateForPrint(parseISO(mission.dataVoo))}</p>
          <p><strong>OFRAG:</strong> ${mission.ofrag}</p>
          <p><strong>Trechos:</strong> ${mission.trechos.join(' → ')}</p>
          ${mission.horarioChamada ? `<p><strong>Horário de Chamada:</strong> ${mission.horarioChamada}</p>` : ''}
          ${mission.horarioDecolagem ? `<p><strong>Horário de Decolagem:</strong> ${mission.horarioDecolagem}</p>` : ''}
        </div>
        <h2>Lista de Passageiros</h2>
        <table class="passengers-list">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Posto</th>
              <th>CPF</th>
              <th>Destino</th>
              <th>Peso (kg)</th>
              <th>Bagagem (kg)</th>
            </tr>
          </thead>
          <tbody>
            ${mission.passageiros.map(passenger => `
              <tr>
                <td>${passenger.nome}</td>
                <td>${passenger.posto}</td>
                <td>${passenger.cpf}</td>
                <td>${passenger.destino}</td>
                <td>${passenger.peso}</td>
                <td>${passenger.pesoBagagem + passenger.pesoBagagemMao}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    reportWindow.document.write(reportContent);
    reportWindow.document.close();
    reportWindow.print();
  };

  const handleConsultMission = (mission: Mission) => {
    setSelectedMission(mission);
    setShowMissionModal(true);
  };

  const selectedDateMissions = selectedDate ? getMissionsForDate(selectedDate) : [];
  const uniqueDates = getUniqueDates();

  if (missions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Missões Arquivadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Nenhuma missão arquivada encontrada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Missões Arquivadas ({missions.length})</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendário
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Ver Todas
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <ArchivedMissionsFilter missions={missions} onFilter={() => {}} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selecionar Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                modifiers={{
                  hasMissions: (date) => uniqueDates.some(d => isSameDay(d, date))
                }}
                modifiersStyles={{
                  hasMissions: {
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
                className="rounded-md border"
              />
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Datas com missões arquivadas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Missões de {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateMissions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma missão arquivada nesta data.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDateMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Plane className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-700">
                              {mission.aeronave} - {mission.matricula}
                            </span>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              OFRAG {mission.ofrag}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {mission.trechos.join(' → ')}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {mission.passageiros.length} passageiros
                            </div>
                            <div className="flex items-center gap-1">
                              <Weight className="w-3 h-3" />
                              {mission.passageiros.reduce((sum, p) => sum + p.peso + p.pesoBagagem + p.pesoBagagemMao, 0)} kg
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConsultMission(mission)}
                            className="bg-green-50 hover:bg-green-100 text-green-700"
                          >
                            Consultar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrint(mission)}
                            className="bg-blue-50 hover:bg-blue-100"
                          >
                            Imprimir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mission Consultation Modal */}
      {showMissionModal && selectedMission && (
        <MissionConsultModal
          mission={selectedMission}
          onClose={() => {
            setShowMissionModal(false);
            setSelectedMission(null);
          }}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default ArchivedMissions;
