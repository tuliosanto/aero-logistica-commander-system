
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mission } from '../types/Mission';
import { User } from '../types/User';
import { Calendar, Plane, Users, Weight } from 'lucide-react';

interface ArchivedMissionsProps {
  missions: Mission[];
  currentUser: User;
}

const ArchivedMissions = ({ missions, currentUser }: ArchivedMissionsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateTotalWeights = (mission: Mission) => {
    const totalPassengers = mission.passageiros.reduce((sum, p) => sum + p.peso, 0);
    const totalBaggage = mission.passageiros.reduce((sum, p) => sum + p.pesoBagagem + p.pesoBagagemMao, 0);
    return {
      totalPassengers,
      totalBaggage,
      totalCombined: totalPassengers + totalBaggage
    };
  };

  const handlePrint = (mission: Mission) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const weights = calculateTotalWeights(mission);
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Missão - ${mission.ofrag}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .mission-info { margin-bottom: 20px; }
            .passengers-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .passengers-table th, .passengers-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .passengers-table th { background-color: #f2f2f2; }
            .weights { margin-top: 20px; display: flex; justify-content: space-around; }
            .weight-box { text-align: center; padding: 10px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FORÇA AÉREA BRASILEIRA</h1>
            <h2>${currentUser.baseAerea}</h2>
            <h3>RELATÓRIO DE MISSÃO - ${mission.ofrag}</h3>
          </div>
          
          <div class="mission-info">
            <p><strong>Aeronave:</strong> ${mission.aeronave}</p>
            <p><strong>Matrícula:</strong> ${mission.matricula}</p>
            <p><strong>Data do Voo:</strong> ${formatDate(mission.dataVoo)}</p>
            <p><strong>Trechos:</strong> ${mission.trechos.join(' - ')}</p>
            <p><strong>Status:</strong> Arquivada</p>
          </div>

          <table class="passengers-table">
            <thead>
              <tr>
                <th>Posto</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Destino</th>
                <th>Peso (kg)</th>
                <th>Bagagem (kg)</th>
                <th>Prioridade</th>
              </tr>
            </thead>
            <tbody>
              ${mission.passageiros.map(p => `
                <tr>
                  <td>${p.posto}</td>
                  <td>${p.nome}</td>
                  <td>${p.cpf}</td>
                  <td>${p.destino}</td>
                  <td>${p.peso}</td>
                  <td>${p.pesoBagagem + p.pesoBagagemMao}</td>
                  <td>${p.prioridade}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="weights">
            <div class="weight-box">
              <strong>Peso Total PAX</strong><br>
              ${weights.totalPassengers} kg
            </div>
            <div class="weight-box">
              <strong>Peso Total Bagagens</strong><br>
              ${weights.totalBaggage} kg
            </div>
            <div class="weight-box">
              <strong>Peso Total Geral</strong><br>
              ${weights.totalCombined} kg
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (missions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Missões Arquivadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Nenhuma missão arquivada encontrada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {missions.map((mission) => {
        const weights = calculateTotalWeights(mission);
        
        return (
          <Card key={mission.id} className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <span>{mission.aeronave} - {mission.matricula}</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 font-semibold">
                    Arquivada
                  </Badge>
                </div>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                OFRAG {mission.ofrag}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{formatDate(mission.dataVoo)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{mission.passageiros.length} passageiros</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Weight className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{weights.totalCombined} kg total</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Trechos:</p>
                <p className="text-sm text-gray-600">{mission.trechos.join(' → ')}</p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handlePrint(mission)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                >
                  Visualizar Impressão
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ArchivedMissions;
