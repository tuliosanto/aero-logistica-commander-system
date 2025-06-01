
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mission } from '../types/Mission';
import { User } from '../types/User';
import { toast } from '@/hooks/use-toast';

interface MissionListProps {
  missions: Mission[];
  onEdit: (mission: Mission) => void;
  onDelete: (missionId: string) => void;
  currentUser: User;
}

const MissionList = ({ missions, onEdit, onDelete, currentUser }: MissionListProps) => {
  const handleDelete = (mission: Mission) => {
    if (confirm(`Tem certeza que deseja excluir a missão OFRAG ${mission.ofrag}?`)) {
      onDelete(mission.id);
      toast({
        title: "Missão excluída",
        description: `OFRAG ${mission.ofrag} foi excluída com sucesso.`,
      });
    }
  };

  const generateMissionReport = (mission: Mission) => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const sortedPassengers = [...mission.passageiros].sort((a, b) => {
      if (a.prioridade !== b.prioridade) {
        return a.prioridade - b.prioridade;
      }
      return 0;
    });

    const totalPaxWeight = mission.passageiros.reduce((sum, p) => sum + p.peso, 0);
    const totalBaggageWeight = mission.passageiros.reduce((sum, p) => sum + p.pesoBagagem + p.pesoBagagemMao, 0);

    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relação de Passageiros - ${mission.ofrag}</title>
          <style>
            @page { margin: 10mm; size: A4; }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0;
              font-size: 10px;
              line-height: 1.1;
            }
            .header { 
              text-align: center; 
              margin-bottom: 10px;
              font-weight: bold;
              border: 2px solid black;
              padding: 5px;
            }
            .info-section {
              display: flex;
              margin-bottom: 10px;
              gap: 0;
            }
            .aviao-box {
              border: 2px solid black;
              padding: 10px 5px;
              writing-mode: vertical-lr;
              text-orientation: mixed;
              text-align: center;
              font-weight: bold;
              width: 50px;
              background-color: #f5f5f5;
            }
            .info-group {
              border: 2px solid black;
              border-left: 0;
              padding: 5px;
              flex: 1;
              font-size: 9px;
            }
            .info-group:last-child {
              max-width: 200px;
            }
            .info-row {
              margin-bottom: 3px;
            }
            .info-label {
              font-weight: bold;
              display: inline-block;
              min-width: 80px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 10px;
              font-size: 8px;
            }
            th, td { 
              border: 1px solid black; 
              padding: 2px 4px; 
              text-align: center;
              vertical-align: middle;
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold;
              font-size: 7px;
            }
            .nome-col { text-align: left; max-width: 150px; }
            .cpf-col { font-family: monospace; font-size: 7px; }
            .footer-info {
              display: flex;
              justify-content: space-between;
              margin-top: 5px;
              font-size: 9px;
              font-weight: bold;
            }
            @media print { 
              body { margin: 0; } 
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>COMANDO DA AERONÁUTICA</div>
            <div>BASE AÉREA DE SANTA MARIA</div>
            <div>SISTEMA DO CORREIO AÉREO NACIONAL</div>
            <div>RELAÇÃO DE PASSAGEIROS</div>
          </div>
          
          <div class="info-section">
            <div class="aviao-box">AVIÃO</div>
            <div class="info-group">
              <div class="info-row">
                <span class="info-label">MODELO:</span>
                <span>${mission.aeronave}</span>
              </div>
              <div class="info-row">
                <span class="info-label">MATRÍCULA:</span>
                <span>${mission.matricula}</span>
              </div>
            </div>
            <div class="info-group">
              <div class="info-row">
                <span class="info-label">TERMINAL:</span>
                <span>POSTO CAN SANTA MARIA</span>
              </div>
              <div class="info-row">
                <span class="info-label">ROTA:</span>
                <span>${mission.trechos.join(' – ')}</span>
              </div>
            </div>
            <div class="info-group">
              <div class="info-row">
                <span class="info-label">DATA DO VOO:</span>
                <span>${new Date(mission.dataVoo).toLocaleDateString('pt-BR')}</span>
              </div>
              <div class="info-row">
                <span class="info-label">CHAMADA (H):</span>
                <span>12:30</span>
              </div>
              <div class="info-row">
                <span class="info-label">DECOLAGEM (H):</span>
                <span>13:30</span>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th rowspan="2">Nº</th>
                <th rowspan="2">NOME DOS PASSAGEIROS</th>
                <th rowspan="2">CPF</th>
                <th rowspan="2">DESTINO</th>
                <th rowspan="2">PRIOR</th>
                <th colspan="2">PESO</th>
                <th rowspan="2">Nº</th>
                <th rowspan="2">RESPONSÁVEL PELA INSCRIÇÃO</th>
                <th rowspan="2">PARENTESCO</th>
              </tr>
              <tr>
                <th>PAX</th>
                <th>BAG</th>
              </tr>
            </thead>
            <tbody>
              ${sortedPassengers.map((passenger, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td class="nome-col">${passenger.posto} ${passenger.nome}</td>
                  <td class="cpf-col">${passenger.cpf}</td>
                  <td>${passenger.destino}</td>
                  <td>${passenger.prioridade}</td>
                  <td>${passenger.peso}</td>
                  <td>${passenger.pesoBagagem + passenger.pesoBagagemMao}</td>
                  <td></td>
                  <td>${passenger.responsavelInscricao || ''}</td>
                  <td>${passenger.parentesco || ''}</td>
                </tr>
              `).join('')}
              ${Array.from({ length: Math.max(0, 25 - sortedPassengers.length) }, (_, i) => `
                <tr>
                  <td>${sortedPassengers.length + i + 1}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer-info">
            <div>CHEFE DO PCAN-SM: João Marcos Aguirre - Cap R1</div>
            <div>SOMA&nbsp;&nbsp;&nbsp;&nbsp;${totalPaxWeight}&nbsp;&nbsp;&nbsp;&nbsp;${totalBaggageWeight}</div>
            <div>CMT ANV:</div>
          </div>

          <div class="footer-info">
            <div>DESPACHANTE: 1S ADELINO</div>
            <div>TOTAL:&nbsp;&nbsp;&nbsp;&nbsp;${totalPaxWeight + totalBaggageWeight}</div>
            <div>MEC ANV:</div>
          </div>

          <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimir</button>
        </body>
      </html>
    `;

    reportWindow.document.write(reportContent);
    reportWindow.document.close();
  };

  if (missions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">Nenhuma missão cadastrada ainda.</p>
        <p className="text-sm">Clique em "Nova Missão" para começar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {missions.map((mission) => (
        <Card key={mission.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-blue-700">{mission.aeronave}</span>
                  <Badge variant="outline" className="bg-blue-50">
                    {mission.matricula}
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 font-semibold">
                    {new Date(mission.dataVoo).toLocaleDateString('pt-BR')}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  OFRAG {mission.ofrag}
                </p>
                <p className="text-sm text-gray-600">
                  {mission.trechos.join(' → ')}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => generateMissionReport(mission)}
                  className="bg-blue-50 hover:bg-blue-100"
                >
                  Relatório
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEdit(mission)}
                >
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(mission)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>{mission.passageiros.length} passageiros</span>
              <div className="flex space-x-4">
                <span>Total: {mission.passageiros.reduce((sum, p) => sum + p.peso + p.pesoBagagem + p.pesoBagagemMao, 0)} kg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MissionList;
