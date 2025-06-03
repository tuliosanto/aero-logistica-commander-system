
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
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>(missions);

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

    // Use the same HTML structure as the original "Relatório de Vôo"
    const reportContent = `
<!DOCTYPE html>
<html lang="">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="ProgId" content="Excel.Sheet">
<style>
a{
  color:blue;
}
a:visited{
  color:purple;
}
table{
  border: 0;
  border-collapse: collapse;
  border-spacing: 0;
}
.x40 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:12pt;
 font-weight:700;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:3px solid #000000;
 border-right:3px solid #000000;
 border-bottom:none;
 border-left:3px solid #000000;
}
.x41 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:12pt;
 font-weight:700;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:none;
 border-right:3px solid #000000;
 border-bottom:none;
 border-left:3px solid #000000;
}
.x42 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:12pt;
 font-weight:700;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:3px solid #000000;
 border-bottom:none;
 border-left:3px solid #000000;
}
.x43 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:none;
 border-right:none;
 border-bottom:none;
 border-left:3px solid #000000;
}
.x44 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:3px solid #000000;
}
.x45 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:9pt;
 font-weight:700;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:3px solid #000000;
}
.x47 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:3px solid #000000;
}
.x48 {
 text-align:left;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:3px solid #000000;
}
.x49 {
 text-align:left;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:3px solid #000000;
 border-left:3px solid #000000;
}
.x50 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
}
.x51 {
 text-align:left;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x52 {
 text-align:center;
 vertical-align:middle;
 white-space:normal;word-wrap:break-word;
 background:auto;
 font-size:9pt;
 font-weight:700;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x53 {
 text-align:left;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
}
.x55 {
 text-align:left;
 vertical-align:middle;
 white-space:normal;word-wrap:break-word;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x61 {
 text-align:center;
 vertical-align:middle;
 white-space:normal;word-wrap:break-word;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x62 {
 text-align:center;
 vertical-align:middle;
 white-space:normal;word-wrap:break-word;
 background:auto;
 font-size:9pt;
 font-weight:700;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x65 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x66 {
 text-align:left;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:9pt;
 font-weight:700;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x68 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 color:#000000;
 font-size:9pt;
 font-weight:700;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:1px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x69 {
 text-align:left;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:9pt;
 font-weight:700;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:3px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x71 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:none;
 border-right:3px solid #000000;
 border-bottom:none;
 border-left:none;
}
.x72 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 color:#000000;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:3px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x73 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:3px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x74 {
 text-align:center;
 vertical-align:middle;
 white-space:normal;word-wrap:break-word;
 background:auto;
 font-size:9pt;
 font-weight:700;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:3px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
.x76 {
 text-align:center;
 vertical-align:middle;
 white-space:nowrap;
 background:auto;
 font-size:10pt;
 font-weight:400;
 font-style:normal;
 font-family:Arial,sans-serif;
 border-top:1px solid #000000;
 border-right:3px solid #000000;
 border-bottom:1px solid #000000;
 border-left:1px solid #000000;
}
@media print {
  body { margin: 0; }
  .no-print { display: none; }
}
</style>
</head>
<body link='blue' vlink='purple' bgcolor='white'>
<div id='section'>
<div id='table_0'>
<table style='border-collapse:collapse; table-layout:fixed;width:978pt'>
 <col style='background:none;width:23.25pt'>
 <col style='background:none;width:161.25pt'>
 <col style='background:none;width:89.25pt'>
 <col style='background:none;width:51.75pt'>
 <col style='background:none;width:75pt'>
 <col style='background:none;width:61.5pt'>
 <col style='background:none;width:45.75pt'>
 <col style='background:none;width:52.5pt'>
 <col style='background:none;width:43.5pt'>
 <col style='background:none;width:21.75pt'>
 <col span='2' style='background:none;width:86.25pt'>
 <col style='background:none;width:80.25pt'>
 <col span='2' style='background:none;width:50.25pt'>
 <tr style='height:16.5pt'>
<td colspan='12' class='x40' style='border-right:3px solid #000000;height:14.25pt;'><span style='font-size:12pt;color:#000000;font-weight:700;text-decoration:none;font-family:Arial,sans-serif;'>COMANDO DA AERONÁUTICA</span></td>
<td class='x50' style='width:80.25pt;'></td>
<td class='x50' style='width:50.25pt;'></td>
<td class='x50' style='width:50.25pt;'></td>
 </tr>
 <tr style='height:16.5pt'>
<td colspan='12' class='x41' style='border-right:3px solid #000000;height:16.5pt;'>${currentUser.baseAerea || 'BASE AÉREA DE SANTA MARIA'}</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
 </tr>
 <tr style='height:16.5pt'>
<td colspan='12' class='x41' style='border-right:3px solid #000000;height:16.5pt;'>SISTEMA DO CORREIO AÉREO NACIONAL</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
 </tr>
 <tr style='height:16.5pt'>
<td colspan='12' class='x42' style='border-right:3px solid #000000;border-top:1px solid #000000;height:15.75pt;'>RELAÇÃO DE PASSAGEIROS</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'>&nbsp;</td>
 </tr>
 <tr style='height:7.5pt'>
<td class='x43' style='height:7.5pt;'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x71'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>
 <tr style='height:15pt'>
<td rowspan='3' class='x44' style='border-bottom:1px solid #000000;height:40.5pt;'><div style='white-space:nowrap;width:40px;height:31px;margin-top:-0px;margin-left:4px;transform: rotate(-90deg);-o-transform: rotate(-90deg);-webkit-transform: rotate(-90deg);-moz-transform: rotate(-90deg);-ms-transform: rotate(-90deg);'>AVIÃO</div></td>
<td class='x51'>MODELO: ${mission.aeronave}</td>
<td class='x53'></td>
<td colspan='5' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>TERMINAL: POSTO CAN ${currentUser.baseAerea?.replace('BASE AÉREA DE ', '') || 'SANTA MARIA'}</td>
<td class='x53'></td>
<td colspan='2' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>DATA DO VOO:</td>
<td class='x72'>${formatDateForPrint(parseISO(mission.dataVoo))}</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>
 <tr style='height:12.75pt'>
<td rowspan='2' class='x51' style='border-bottom:1px solid #000000;height:25.5pt;'>MATRÍCULA: ${mission.matricula || ''}</td>
<td class='x53'></td>
<td rowspan='2' class='x55' style='border-bottom:1px solid #000000;height:25.5pt;'>ROTA:</td>
<td colspan='4' rowspan='2' class='x61' style='border-right:1px solid #000000;border-bottom:1px solid #000000;height:25.5pt;'>${mission.trechos.join(' – ')}</td>
<td class='x53'></td>
<td colspan='2' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>CHAMADA (H):</td>
<td class='x73'>${mission.horarioChamada || ''}</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>
 <tr style='height:14.25pt'>
<td class='x53'></td>
<td class='x53'></td>
<td colspan='2' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>DECOLAGEM (H):</td>
<td class='x73'>${mission.horarioDecolagem || ''}</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>
 <tr style='height:14.25pt'>
<td class='x43' style='height:14.25pt;'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x71'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>
 <tr style='height:12.75pt'>
<td rowspan='2' class='x45' style='border-bottom:1px solid #000000;height:24pt;'>N°</td>
<td colspan='3' rowspan='2' class='x52' style='border-right:1px solid #000000;border-bottom:1px solid #000000;height:24pt;'>NOME DOS PASSAGEIROS</td>
<td rowspan='2' class='x62' style='border-bottom:1px solid #000000;height:24pt;'>CPF</td>
<td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>DESTINO</td>
<td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>PRIOR</td>
<td colspan='2' class='x52' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>PESO</td>
<td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>N°</td>
<td rowspan='2' class='x52' style='border-bottom:1px solid #000000;height:24pt;'>RESPONSÁVEL PELA INSCRIÇÃO</td>
<td rowspan='2' class='x74' style='border-bottom:1px solid #000000;height:24pt;'>PARENTESCO</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>
 <tr style='height:12.75pt'>
<td class='x52'>PAX</td>
<td class='x52'>BAG</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>
${mission.passageiros.map((p, index) => `
 <tr style='height:14.25pt'>
<td class='x47' style='height:12.75pt;'>${index + 1}</td>
<td colspan='3' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>${p.posto} ${p.nome}</td>
<td class='x51'>${p.cpf}</td>
<td class='x65'>${p.destino}</td>
<td class='x65'>${p.prioridade}</td>
<td class='x65'>${p.peso}</td>
<td class='x65'>${p.pesoBagagem + p.pesoBagagemMao}</td>
<td class='x65'></td>
<td class='x65'>${p.responsavelInscricao || ''}</td>
<td class='x76'>${p.parentesco || ''}</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>`).join('')}
${Array.from({
      length: Math.max(0, 25 - mission.passageiros.length)
    }, (_, i) => `
 <tr style='height:14.25pt'>
<td class='x47' style='height:12.75pt;'>${mission.passageiros.length + i + 1}</td>
<td colspan='3' class='x51' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'></td>
<td class='x51'></td>
<td class='x65'></td>
<td class='x65'></td>
<td class='x65'></td>
<td class='x65'></td>
<td class='x65'></td>
<td class='x65'></td>
<td class='x76'></td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>`).join('')}
 <tr style='height:16.5pt'>
<td colspan='6' class='x48' style='border-right:1px solid #000000;border-bottom:1px solid #000000;height:15pt;'>CHEFE DO PCAN: ${currentUser.nome || ''}</td>
<td class='x66'>SOMA</td>
<td class='x68'>${mission.passageiros.reduce((sum, p) => sum + p.peso, 0)}</td>
<td class='x68'>${mission.passageiros.reduce((sum, p) => sum + p.pesoBagagem + p.pesoBagagemMao, 0)}</td>
<td colspan='3' class='x69' style='border-right:3px solid #000000;border-bottom:1px solid #000000;'>CMT ANV:</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>
 <tr style='height:16.5pt'>
<td colspan='6' class='x49' style='border-right:1px solid #000000;border-bottom:3px solid #000000;height:13.5pt;'>DESPACHANTE:</td>
<td class='x66'>TOTAL:</td>
<td colspan='2' class='x68' style='border-right:1px solid #000000;border-bottom:1px solid #000000;'>${mission.passageiros.reduce((sum, p) => sum + p.peso + p.pesoBagagem + p.pesoBagagemMao, 0)}</td>
<td colspan='3' class='x69' style='border-right:3px solid #000000;border-bottom:1px solid #000000;'>MEC ANV:</td>
<td class='x50'></td>
<td class='x50'></td>
<td class='x53'></td>
 </tr>
</table>
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

    reportWindow.document.write(reportContent);
    reportWindow.document.close();
  };

  const handleConsultMission = (mission: Mission) => {
    setSelectedMission(mission);
    setShowMissionModal(true);
  };

  const handleFilter = (filtered: Mission[]) => {
    setFilteredMissions(filtered);
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
        <div className="space-y-6">
          <ArchivedMissionsFilter missions={missions} onFilter={handleFilter} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Missões Filtradas ({filteredMissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredMissions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma missão encontrada com os filtros aplicados.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredMissions.map((mission) => (
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
                          <p className="text-sm text-gray-600 mb-1">
                            Data: {formatDateForPrint(parseISO(mission.dataVoo))}
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
