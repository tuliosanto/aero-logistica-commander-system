
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mission } from '../types/Mission';
import { User } from '../types/User';
import { toast } from '@/hooks/use-toast';
import { AIR_BASES } from '../utils/constants';
import { Check } from 'lucide-react';

interface MissionListProps {
  missions: Mission[];
  onEdit: (mission: Mission) => void;
  onDelete: (missionId: string) => void;
  onComplete: (missionId: string) => void;
  currentUser: User;
}

const MissionList = ({ missions, onEdit, onDelete, onComplete, currentUser }: MissionListProps) => {
  const handleDelete = (mission: Mission) => {
    if (confirm(`Tem certeza que deseja excluir a missão OFRAG ${mission.ofrag}?`)) {
      onDelete(mission.id);
      toast({
        title: "Missão excluída",
        description: `OFRAG ${mission.ofrag} foi excluída com sucesso.`,
      });
    }
  };

  const handleComplete = (mission: Mission) => {
    if (confirm(`Tem certeza que deseja concluir a missão OFRAG ${mission.ofrag}?`)) {
      onComplete(mission.id);
      toast({
        title: "Missão concluída",
        description: `OFRAG ${mission.ofrag} foi marcada como concluída.`,
      });
    }
  };

  const getCodigoBase = () => {
    return currentUser.baseAerea.slice(-2);
  };

  const getBaseFullName = () => {
    const base = AIR_BASES.find(b => b.code === currentUser.baseAerea);
    return base ? base.name : currentUser.baseAerea;
  };

  const getChefePCAN = () => {
    const savedConfig = localStorage.getItem(`baseConfig_${currentUser.baseAerea}`);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      return `${config.nomeChefe} - ${config.postoChefe}`;
    }
    return 'NÃO CONFIGURADO';
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
    const codigoBase = getCodigoBase();
    const baseFullName = getBaseFullName();
    const chefePCAN = getChefePCAN();
    const despachante = `${currentUser.posto} ${currentUser.nomeGuerra}`;
    
    // Divide passengers into pages
    const firstPagePassengers = sortedPassengers.slice(0, 25);
    const secondPagePassengers = sortedPassengers.slice(25);
    const needsSecondPage = sortedPassengers.length > 25;

    const generatePassengerRows = (passengers: any[], startIndex: number, totalRows: number) => {
      const rows = [];
      
      // Add passenger rows
      for (let i = 0; i < passengers.length; i++) {
        const passenger = passengers[i];
        rows.push(`
          <tr style='height:14.25pt'>
            <td class='x47' style='height:12.75pt;'>${startIndex + i + 1}</td>
            <td colspan='3' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>${passenger.posto} ${passenger.nome}</td>
            <td class='x60'>${passenger.cpf}</td>
            <td class='x65'>${passenger.destino}</td>
            <td class='x65'>${passenger.prioridade}</td>
            <td class='x65'>${passenger.peso}</td>
            <td class='x65'>${passenger.pesoBagagem + passenger.pesoBagagemMao}</td>
            <td class='x65'></td>
            <td class='x65'>${passenger.responsavelInscricao || 'O PRÓPRIO'}</td>
            <td class='x76'>${passenger.parentesco || ''}</td>
            <td class='x50'></td>
            <td class='x50'></td>
            <td class='x53'></td>
          </tr>
        `);
      }
      
      // Add empty rows to fill the page
      for (let i = passengers.length; i < totalRows; i++) {
        const rowNumber = startIndex + i + 1;
        const isLastRows = i >= 15; // Last 10 rows have different styling
        
        rows.push(`
          <tr style='height:14.25pt'>
            <td class='x47' style='height:12.75pt;'>${rowNumber}</td>
            <td colspan='3' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'></td>
            <td class='x60'></td>
            <td class='x65'></td>
            <td class='x65'></td>
            <td class='x65'></td>
            <td class='x65'></td>
            <td class='x${isLastRows ? '70' : '65'}'></td>
            <td class='x${isLastRows ? '70' : '65'}'></td>
            <td class='x${isLastRows ? '77' : '76'}'></td>
            <td class='x50'></td>
            <td class='x50'></td>
            <td class='x53'></td>
          </tr>
        `);
      }
      
      return rows.join('');
    };

    const firstPageRows = generatePassengerRows(firstPagePassengers, 0, 25);
    const secondPageRows = needsSecondPage ? generatePassengerRows(secondPagePassengers, 25, 25) : '';

    const reportContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <title>Relação de Passageiros - ${mission.ofrag}</title>
          <meta charset="UTF-8">
          <style>
            @page { 
              margin: 15mm; 
              size: A4 landscape; 
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0;
              font-size: 10pt;
              line-height: 1.2;
            }
            table { 
              border-collapse: collapse; 
              table-layout: fixed; 
              width: 978pt;
              margin-bottom: 20px;
            }
            .col1 { width: 23.25pt; }
            .col2 { width: 161.25pt; }
            .col3 { width: 89.25pt; }
            .col4 { width: 51.75pt; }
            .col5 { width: 75pt; }
            .col6 { width: 61.5pt; }
            .col7 { width: 45.75pt; }
            .col8 { width: 52.5pt; }
            .col9 { width: 43.5pt; }
            .col10 { width: 21.75pt; }
            .col11 { width: 86.25pt; }
            .col12 { width: 86.25pt; }
            .col13 { width: 80.25pt; }
            .col14 { width: 50.25pt; }
            .col15 { width: 50.25pt; }
            
            .x40 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 12pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border: 3px solid #000000;
              border-bottom: none;
              height: 14.25pt;
            }
            .x41 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 12pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border-top: none;
              border-right: 3px solid #000000;
              border-bottom: none;
              border-left: 3px solid #000000;
              height: 16.5pt;
            }
            .x42 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 12pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border-top: 1px solid #000000;
              border-right: 3px solid #000000;
              border-bottom: none;
              border-left: 3px solid #000000;
              height: 15.75pt;
            }
            .x43 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border-left: 3px solid #000000;
              height: 7.5pt;
            }
            .x44 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              writing-mode: vertical-lr;
              text-orientation: mixed;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
              border-left: 3px solid #000000;
              height: 40.5pt;
            }
            .x45 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 9pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
              border-left: 3px solid #000000;
              height: 24pt;
            }
            .x47 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
              border-left: 3px solid #000000;
              height: 12.75pt;
            }
            .x48 {
              text-align: left;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
              border-left: 3px solid #000000;
              height: 15pt;
            }
            .x49 {
              text-align: left;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border-top: 1px solid #000000;
              border-right: 1px solid #000000;
              border-bottom: 3px solid #000000;
              border-left: 3px solid #000000;
              height: 13.5pt;
            }
            .x50 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
            }
            .x51 {
              text-align: left;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
            }
            .x52 {
              text-align: center;
              vertical-align: middle;
              white-space: normal;
              word-wrap: break-word;
              font-size: 9pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
            }
            .x53 {
              text-align: left;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
            }
            .x55 {
              text-align: left;
              vertical-align: middle;
              white-space: normal;
              word-wrap: break-word;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
            }
            .x60 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
            }
            .x61 {
              text-align: center;
              vertical-align: middle;
              white-space: normal;
              word-wrap: break-word;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
            }
            .x65 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
            }
            .x66 {
              text-align: left;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 9pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
            }
            .x68 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 9pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
            }
            .x69 {
              text-align: left;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 9pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border-top: 1px solid #000000;
              border-right: 3px solid #000000;
              border-bottom: 1px solid #000000;
              border-left: 1px solid #000000;
            }
            .x70 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border: 1px solid #000000;
            }
            .x71 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border-right: 3px solid #000000;
            }
            .x72 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border-top: 1px solid #000000;
              border-right: 3px solid #000000;
              border-bottom: 1px solid #000000;
              border-left: 1px solid #000000;
            }
            .x73 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border-top: 1px solid #000000;
              border-right: 3px solid #000000;
              border-bottom: 1px solid #000000;
              border-left: 1px solid #000000;
            }
            .x74 {
              text-align: center;
              vertical-align: middle;
              white-space: normal;
              word-wrap: break-word;
              font-size: 9pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border-top: 1px solid #000000;
              border-right: 3px solid #000000;
              border-bottom: 1px solid #000000;
              border-left: 1px solid #000000;
            }
            .x76 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-family: Arial, sans-serif;
              border-top: 1px solid #000000;
              border-right: 3px solid #000000;
              border-bottom: 1px solid #000000;
              border-left: 1px solid #000000;
            }
            .x77 {
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
              font-size: 10pt;
              font-weight: 700;
              font-family: Arial, sans-serif;
              border-top: 1px solid #000000;
              border-right: 3px solid #000000;
              border-bottom: 1px solid #000000;
              border-left: 1px solid #000000;
            }
            .page-break { page-break-before: always; }
            @media print { 
              body { margin: 0; } 
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <!-- PRIMEIRA PÁGINA -->
          <table>
            <colgroup>
              <col class="col1"><col class="col2"><col class="col3"><col class="col4"><col class="col5">
              <col class="col6"><col class="col7"><col class="col8"><col class="col9"><col class="col10">
              <col class="col11"><col class="col12"><col class="col13"><col class="col14"><col class="col15">
            </colgroup>
            
            <!-- Header -->
            <tr style='height:16.5pt'>
              <td colspan='12' class='x40'>COMANDO DA AERONÁUTICA</td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td>
            </tr>
            <tr style='height:16.5pt'>
              <td colspan='12' class='x41'>${baseFullName}</td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td>
            </tr>
            <tr style='height:16.5pt'>
              <td colspan='12' class='x41'>SISTEMA DO CORREIO AÉREO NACIONAL</td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td>
            </tr>
            <tr style='height:16.5pt'>
              <td colspan='12' class='x42'>RELAÇÃO DE PASSAGEIROS</td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td>
            </tr>
            <tr style='height:7.5pt'>
              <td class='x43'></td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td>
              <td class='x50'></td><td class='x71'></td><td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            
            <!-- Airplane info section -->
            <tr style='height:15pt'>
              <td rowspan='3' class='x44'>AVIÃO</td>
              <td class='x51'>MODELO: ${mission.aeronave}</td>
              <td class='x53'></td>
              <td colspan='5' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>TERMINAL: POSTO CAN ${codigoBase}</td>
              <td class='x53'></td>
              <td colspan='2' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>DATA DO VOO:</td>
              <td class='x72'>${new Date(mission.dataVoo).toLocaleDateString('pt-BR')}</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            <tr style='height:12.75pt'>
              <td rowspan='2' class='x51' style='border-bottom:1px solid #000000;height:25.5pt;'>MATRÍCULA: ${mission.matricula}</td>
              <td class='x53'></td>
              <td rowspan='2' class='x55' style='border-bottom:1px solid #000000;height:25.5pt;'>ROTA:</td>
              <td colspan='4' rowspan='2' class='x61' style='border-right:1px solid #000000;border-bottom:1px solid #000000;height:25.5pt;'>${mission.trechos}</td>
              <td class='x53'></td>
              <td colspan='2' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>CHAMADA (H):</td>
              <td class='x73'>12:30</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            <tr style='height:14.25pt'>
              <td class='x53'></td><td class='x53'></td>
              <td colspan='2' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>DECOLAGEM (H):</td>
              <td class='x73'>13:30</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            <tr style='height:14.25pt'>
              <td class='x43'></td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td>
              <td class='x50'></td><td class='x71'></td><td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            
            <!-- Table headers -->
            <tr style='height:12.75pt'>
              <td rowspan='2' class='x45'>Nº</td>
              <td colspan='3' rowspan='2' class='x52' style='border-right:1px solid #000000;border-bottom:1px solid #000000;height:24pt;'>NOME DOS PASSAGEIROS</td>
              <td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>CPF</td>
              <td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>DESTINO</td>
              <td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>PRIOR</td>
              <td colspan='2' class='x52' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>PESO</td>
              <td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>Nº</td>
              <td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>RESPONSÁVEL PELA INSCRIÇÃO</td>
              <td rowspan='2' class='x74' style='border-bottom:1px solid #000000;height:24pt;'>PARENTESCO</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            <tr style='height:12.75pt'>
              <td class='x52'>PAX</td>
              <td class='x52'>BAG</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            
            <!-- Passenger rows -->
            ${firstPageRows}
            
            <!-- Footer -->
            <tr style='height:16.5pt'>
              <td colspan='6' class='x48'>CHEFE DO PCAN-${codigoBase}: ${chefePCAN}</td>
              <td class='x66'>SOMA</td>
              <td class='x68'>${needsSecondPage ? firstPagePassengers.reduce((sum, p) => sum + p.peso, 0) : totalPaxWeight}</td>
              <td class='x68'>${needsSecondPage ? firstPagePassengers.reduce((sum, p) => sum + p.pesoBagagem + p.pesoBagagemMao, 0) : totalBaggageWeight}</td>
              <td colspan='3' class='x69'>CMT ANV:</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            <tr style='height:16.5pt'>
              <td colspan='6' class='x49'>DESPACHANTE: ${despachante}</td>
              <td class='x66'>TOTAL:</td>
              <td colspan='2' class='x68' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>${needsSecondPage ? (firstPagePassengers.reduce((sum, p) => sum + p.peso + p.pesoBagagem + p.pesoBagagemMao, 0)) : (totalPaxWeight + totalBaggageWeight)}</td>
              <td colspan='3' class='x69'>MEC ANV:</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
          </table>

          ${needsSecondPage ? `
          <!-- SEGUNDA PÁGINA -->
          <div class="page-break"></div>
          <table>
            <colgroup>
              <col class="col1"><col class="col2"><col class="col3"><col class="col4"><col class="col5">
              <col class="col6"><col class="col7"><col class="col8"><col class="col9"><col class="col10">
              <col class="col11"><col class="col12"><col class="col13"><col class="col14"><col class="col15">
            </colgroup>
            
            <!-- Header -->
            <tr style='height:16.5pt'>
              <td colspan='12' class='x40'>COMANDO DA AERONÁUTICA</td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td>
            </tr>
            <tr style='height:16.5pt'>
              <td colspan='12' class='x41'>${baseFullName}</td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td>
            </tr>
            <tr style='height:16.5pt'>
              <td colspan='12' class='x41'>SISTEMA DO CORREIO AÉREO NACIONAL</td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td>
            </tr>
            <tr style='height:16.5pt'>
              <td colspan='12' class='x42'>RELAÇÃO DE PASSAGEIROS</td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td>
            </tr>
            <tr style='height:7.5pt'>
              <td class='x43'></td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td>
              <td class='x50'></td><td class='x71'></td><td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            
            <!-- Airplane info section -->
            <tr style='height:15pt'>
              <td rowspan='3' class='x44'>AVIÃO</td>
              <td class='x51'>MODELO: ${mission.aeronave}</td>
              <td class='x53'></td>
              <td colspan='5' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>TERMINAL: POSTO CAN ${codigoBase}</td>
              <td class='x53'></td>
              <td colspan='2' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>DATA DO VOO:</td>
              <td class='x72'>${new Date(mission.dataVoo).toLocaleDateString('pt-BR')}</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            <tr style='height:12.75pt'>
              <td rowspan='2' class='x51' style='border-bottom:1px solid #000000;height:25.5pt;'>MATRÍCULA: ${mission.matricula}</td>
              <td class='x53'></td>
              <td rowspan='2' class='x55' style='border-bottom:1px solid #000000;height:25.5pt;'>ROTA:</td>
              <td colspan='4' rowspan='2' class='x61' style='border-right:1px solid #000000;border-bottom:1px solid #000000;height:25.5pt;'>${mission.trechos}</td>
              <td class='x53'></td>
              <td colspan='2' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>CHAMADA (H):</td>
              <td class='x73'>12:30</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            <tr style='height:14.25pt'>
              <td class='x53'></td><td class='x53'></td>
              <td colspan='2' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>DECOLAGEM (H):</td>
              <td class='x73'>13:30</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            <tr style='height:14.25pt'>
              <td class='x43'></td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td>
              <td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td><td class='x50'></td>
              <td class='x50'></td><td class='x71'></td><td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            
            <!-- Table headers -->
            <tr style='height:12.75pt'>
              <td rowspan='2' class='x45'>Nº</td>
              <td colspan='3' rowspan='2' class='x52' style='border-right:1px solid #000000;border-bottom:1px solid #000000;height:24pt;'>NOME DOS PASSAGEIROS</td>
              <td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>CPF</td>
              <td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>DESTINO</td>
              <td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>PRIOR</td>
              <td colspan='2' class='x52' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>PESO</td>
              <td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>Nº</td>
              <td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>RESPONSÁVEL PELA INSCRIÇÃO</td>
              <td rowspan='2' class='x74' style='border-bottom:1px solid #000000;height:24pt;'>PARENTESCO</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            <tr style='height:12.75pt'>
              <td class='x52'>PAX</td>
              <td class='x52'>BAG</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            
            <!-- Passenger rows -->
            ${secondPageRows}
            
            <!-- Footer -->
            <tr style='height:16.5pt'>
              <td colspan='6' class='x48'>CHEFE DO PCAN-${codigoBase}: ${chefePCAN}</td>
              <td class='x66'>SOMA</td>
              <td class='x68'>${totalPaxWeight}</td>
              <td class='x68'>${totalBaggageWeight}</td>
              <td colspan='3' class='x69'>CMT ANV:</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
            <tr style='height:16.5pt'>
              <td colspan='6' class='x49'>DESPACHANTE: ${despachante}</td>
              <td class='x66'>TOTAL:</td>
              <td colspan='2' class='x68' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>${totalPaxWeight + totalBaggageWeight}</td>
              <td colspan='3' class='x69'>MEC ANV:</td>
              <td class='x50'></td><td class='x50'></td><td class='x53'></td>
            </tr>
          </table>
          ` : ''}

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
                  {mission.isCompleted && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 font-semibold">
                      Concluída
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  OFRAG {mission.ofrag}
                </p>
                <p className="text-sm text-gray-600">
                  {mission.trechos.join(' - ')}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => generateMissionReport(mission)}
                  className="bg-blue-50 hover:bg-blue-100"
                >
                  Visualizar Impressão
                </Button>
                {!mission.isCompleted && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleComplete(mission)}
                    className="bg-green-50 hover:bg-green-100 text-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Concluir
                  </Button>
                )}
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
