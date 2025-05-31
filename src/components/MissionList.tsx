
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
      // Military rank sorting would go here
      return 0;
    });

    const totalPaxWeight = mission.passageiros.reduce((sum, p) => sum + p.peso, 0);
    const totalBaggageWeight = mission.passageiros.reduce((sum, p) => sum + p.pesoBagagem + p.pesoBagagemMao, 0);

    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Missão - ${mission.ofrag}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .mission-info { margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px; }
            .section { margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .totals { background: #e8f5e8; padding: 15px; border-radius: 5px; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>FORÇA AÉREA BRASILEIRA</h2>
            <h3>RELATÓRIO COMPLETO DE MISSÃO</h3>
          </div>
          
          <div class="mission-info">
            <h4>DADOS DA MISSÃO</h4>
            <p><strong>OFRAG:</strong> ${mission.ofrag}</p>
            <p><strong>Aeronave:</strong> ${mission.aeronave}</p>
            <p><strong>Matrícula:</strong> ${mission.matricula}</p>
            <p><strong>Data do Voo:</strong> ${new Date(mission.dataVoo).toLocaleDateString('pt-BR')}</p>
            <p><strong>Trechos:</strong> ${mission.trechos.join(' / ')}</p>
            <p><strong>Total de Passageiros:</strong> ${mission.passageiros.length}</p>
          </div>

          <div class="section">
            <h4>RELAÇÃO DE PASSAGEIROS (Ordenados por Prioridade e Posto)</h4>
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
                  <th>Total</th>
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
                    <td>${passenger.peso + passenger.pesoBagagem + passenger.pesoBagagemMao} kg</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <h4>RESUMO DE PESOS</h4>
            <p><strong>Peso Total Passageiros:</strong> ${totalPaxWeight} kg</p>
            <p><strong>Peso Total Bagagens:</strong> ${totalBaggageWeight} kg</p>
            <p><strong>PESO TOTAL GERAL:</strong> ${totalPaxWeight + totalBaggageWeight} kg</p>
          </div>

          <div style="margin-top: 50px;">
            <p>Relatório gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            <div style="margin-top: 50px;">
              <p>___________________________________</p>
              <p>Assinatura do Operador</p>
            </div>
          </div>

          <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimir</button>
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
                  <span>OFRAG {mission.ofrag}</span>
                  <Badge variant="outline" className="bg-green-50">
                    {mission.aeronave}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {mission.matricula} • {new Date(mission.dataVoo).toLocaleDateString('pt-BR')}
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
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Trechos:</p>
                <p className="text-sm text-gray-600">{mission.trechos.join(' → ')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-lg font-bold text-gray-800">{mission.passageiros.length}</p>
                  <p className="text-xs text-gray-600">Passageiros</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-lg font-bold text-blue-800">
                    {mission.passageiros.reduce((sum, p) => sum + p.peso, 0)} kg
                  </p>
                  <p className="text-xs text-blue-600">Peso PAX</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-lg font-bold text-green-800">
                    {mission.passageiros.reduce((sum, p) => sum + p.peso + p.pesoBagagem + p.pesoBagagemMao, 0)} kg
                  </p>
                  <p className="text-xs text-green-600">Peso Total</p>
                </div>
              </div>

              {mission.passageiros.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Passageiros por Prioridade:</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Set(mission.passageiros.map(p => p.prioridade)))
                      .sort((a, b) => a - b)
                      .map(priority => (
                        <Badge key={priority} variant="secondary" className="text-xs">
                          P{priority}: {mission.passageiros.filter(p => p.prioridade === priority).length}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MissionList;
