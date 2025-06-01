
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mission } from '../types/Mission';
import { User } from '../types/User';
import { Calendar, Plane, Users, Weight, FileText } from 'lucide-react';

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
          <title>RELATÓRIO DE VOO CAN - ${mission.ofrag}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              line-height: 1.4;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
            }
            .header h1 { 
              margin: 0; 
              font-size: 18px; 
              font-weight: bold; 
            }
            .header h2 { 
              margin: 5px 0; 
              font-size: 16px; 
            }
            .header h3 { 
              margin: 5px 0; 
              font-size: 14px; 
              text-decoration: underline; 
            }
            .mission-info { 
              margin-bottom: 20px; 
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .mission-info p { 
              margin: 3px 0; 
              font-size: 12px;
            }
            .passengers-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
              font-size: 10px;
            }
            .passengers-table th, .passengers-table td { 
              border: 1px solid #000; 
              padding: 4px; 
              text-align: left; 
            }
            .passengers-table th { 
              background-color: #f0f0f0; 
              font-weight: bold;
              text-align: center;
            }
            .weights { 
              margin-top: 20px; 
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
            }
            .weight-box { 
              text-align: center; 
              padding: 10px; 
              border: 1px solid #000; 
              font-size: 12px;
            }
            .weight-box strong {
              display: block;
              margin-bottom: 5px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              border-top: 1px solid #000;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FORÇA AÉREA BRASILEIRA</h1>
            <h2>${currentUser.baseAerea}</h2>
            <h3>RELATÓRIO DE VOO CAN - OFRAG ${mission.ofrag}</h3>
          </div>
          
          <div class="mission-info">
            <div>
              <p><strong>AERONAVE:</strong> ${mission.aeronave}</p>
              <p><strong>MATRÍCULA:</strong> ${mission.matricula || 'N/A'}</p>
              <p><strong>DATA DO VOO:</strong> ${formatDate(mission.dataVoo)}</p>
            </div>
            <div>
              <p><strong>TRECHOS:</strong> ${mission.trechos.join(' - ')}</p>
              <p><strong>TOTAL PAX:</strong> ${mission.passageiros.length}</p>
              <p><strong>STATUS:</strong> MISSÃO ARQUIVADA</p>
            </div>
          </div>

          <table class="passengers-table">
            <thead>
              <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 15%;">POSTO</th>
                <th style="width: 25%;">NOME</th>
                <th style="width: 15%;">CPF</th>
                <th style="width: 10%;">DESTINO</th>
                <th style="width: 8%;">PESO</th>
                <th style="width: 8%;">BAGAGEM</th>
                <th style="width: 6%;">PRIOR.</th>
                <th style="width: 8%;">CHECK-IN</th>
              </tr>
            </thead>
            <tbody>
              ${mission.passageiros.map((p, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>${p.posto}</td>
                  <td>${p.nome}</td>
                  <td>${p.cpf}</td>
                  <td>${p.destino}</td>
                  <td style="text-align: center;">${p.peso}kg</td>
                  <td style="text-align: center;">${p.pesoBagagem + p.pesoBagagemMao}kg</td>
                  <td style="text-align: center;">${p.prioridade}</td>
                  <td style="text-align: center;">${p.checkedIn ? 'SIM' : 'NÃO'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="weights">
            <div class="weight-box">
              <strong>PESO TOTAL PAX</strong>
              ${weights.totalPassengers} kg
            </div>
            <div class="weight-box">
              <strong>PESO TOTAL BAGAGENS</strong>
              ${weights.totalBaggage} kg
            </div>
            <div class="weight-box">
              <strong>PESO TOTAL GERAL</strong>
              ${weights.totalCombined} kg
            </div>
          </div>

          <div class="footer">
            <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            <p>Sistema de Controle de Passageiros CAN - ${currentUser.baseAerea}</p>
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
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Missões Arquivadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Nenhuma missão arquivada encontrada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Missões Arquivadas ({missions.length})</h2>
      </div>
      
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
                    <FileText className="w-4 h-4 mr-2" />
                    Relatório de Voo
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ArchivedMissions;
