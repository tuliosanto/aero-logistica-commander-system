import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, UserPlus, X, Printer } from 'lucide-react';
import { Mission, Passenger } from '@/types/Mission';
import { useToast } from "@/hooks/use-toast"
import { AIR_BASES, getRankOrder } from '@/utils/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types/User';

interface MissionListProps {
  currentUser: User;
}

const MissionList = ({ currentUser }: MissionListProps) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [missionToEdit, setMissionToEdit] = useState<Mission | null>(null);
  const [numero, setNumero] = useState('');
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [aeronave, setAeronave] = useState('');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [missionToDeleteId, setMissionToDeleteId] = useState<string | null>(null);
  const [addingPassengerFor, setAddingPassengerFor] = useState<string | null>(null);
  const [passengerPosto, setPassengerPosto] = useState('');
  const [passengerNomeGuerra, setPassengerNomeGuerra] = useState('');
  const [passengerNomeCompleto, setPassengerNomeCompleto] = useState('');
  const [passengerIdentidade, setPassengerIdentidade] = useState('');
  const [passengerCPF, setPassengerCPF] = useState('');
  const [passengerBase, setPassengerBase] = useState('');
  const [passengerPrioridade, setPassengerPrioridade] = useState('');
  const [passengerObservacoes, setPassengerObservacoes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const storedMissions = localStorage.getItem('missions');
    if (storedMissions) {
      setMissions(JSON.parse(storedMissions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('missions', JSON.stringify(missions));
  }, [missions]);

  const handleCreate = () => {
    if (!numero || !origem || !destino || !dataHora || !aeronave) {
      toast({
        title: "Erro ao criar missão",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const newMission: Mission = {
      id: crypto.randomUUID(),
      numero,
      origem,
      destino,
      dataHora,
      aeronave,
      passageiros: [],
    };

    setMissions([...missions, newMission]);
    setIsFormOpen(false);
    clearForm();
    toast({
      title: "Missão criada com sucesso",
      description: `Missão ${numero} criada de ${origem} para ${destino}.`,
    });
  };

  const handleEdit = (mission: Mission) => {
    setIsEditing(true);
    setMissionToEdit(mission);
    setNumero(mission.numero);
    setOrigem(mission.origem);
    setDestino(mission.destino);
    setDataHora(mission.dataHora);
    setAeronave(mission.aeronave);
    setIsFormOpen(true);
  };

  const handleUpdate = () => {
    if (!missionToEdit) return;

    const updatedMission: Mission = {
      ...missionToEdit,
      numero,
      origem,
      destino,
      dataHora,
      aeronave,
    };

    const updatedMissions = missions.map((mission) =>
      mission.id === missionToEdit.id ? updatedMission : mission
    );

    setMissions(updatedMissions);
    setIsFormOpen(false);
    setIsEditing(false);
    setMissionToEdit(null);
    clearForm();
    toast({
      title: "Missão atualizada com sucesso",
      description: `Missão ${numero} atualizada.`,
    });
  };

  const handleDelete = (id: string) => {
    setMissionToDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDelete = () => {
    if (!missionToDeleteId) return;

    const updatedMissions = missions.filter((mission) => mission.id !== missionToDeleteId);
    setMissions(updatedMissions);
    setIsDeleteConfirmationOpen(false);
    setMissionToDeleteId(null);
    toast({
      title: "Missão excluída com sucesso",
      description: `Missão excluída permanentemente.`,
    });
  };

  const addPassenger = () => {
    if (!addingPassengerFor) return;

    if (!passengerPosto || !passengerNomeGuerra || !passengerNomeCompleto || !passengerIdentidade || !passengerCPF || !passengerBase || !passengerPrioridade) {
      toast({
        title: "Erro ao adicionar passageiro",
        description: "Por favor, preencha todos os campos do passageiro.",
        variant: "destructive",
      });
      return;
    }

    const newPassenger: Passenger = {
      posto: passengerPosto,
      nomeGuerra: passengerNomeGuerra,
      nomeCompleto: passengerNomeCompleto,
      identidade: passengerIdentidade,
      cpf: passengerCPF,
      base: passengerBase,
      prioridade: parseInt(passengerPrioridade),
      observacoes: passengerObservacoes,
    };

    const updatedMissions = missions.map((mission) => {
      if (mission.id === addingPassengerFor) {
        const updatedPassageiros = [...(mission.passageiros || []), newPassenger];
        return { ...mission, passageiros: updatedPassageiros };
      }
      return mission;
    });

    setMissions(updatedMissions);
    setAddingPassengerFor(null);
    clearPassengerForm();
    toast({
      title: "Passageiro adicionado com sucesso",
      description: `${passengerPosto} ${passengerNomeGuerra} adicionado à missão.`,
    });
  };

  const removePassenger = (missionId: string, index: number) => {
    const updatedMissions = missions.map((mission) => {
      if (mission.id === missionId) {
        const updatedPassageiros = [...(mission.passageiros || [])];
        updatedPassageiros.splice(index, 1);
        return { ...mission, passageiros: updatedPassageiros };
      }
      return mission;
    });

    setMissions(updatedMissions);
    toast({
      title: "Passageiro removido com sucesso",
      description: `Passageiro removido da missão.`,
    });
  };

  const clearForm = () => {
    setNumero('');
    setOrigem('');
    setDestino('');
    setDataHora('');
    setAeronave('');
  };

  const clearPassengerForm = () => {
    setPassengerPosto('');
    setPassengerNomeGuerra('');
    setPassengerNomeCompleto('');
    setPassengerIdentidade('');
    setPassengerCPF('');
    setPassengerBase('');
    setPassengerPrioridade('');
    setPassengerObservacoes('');
  };

  const baseConfig = AIR_BASES.reduce((acc: { [key: string]: string }, base) => {
    acc[base.code] = base.name;
    return acc;
  }, {});

  const generatePageContent = (passengers: Passenger[], mission: Mission, baseConfig: { [key: string]: string }, pageNumber: number, totalPages: number) => {
    return `
      <div class="header">
        <div class="title">RELATÓRIO DE ESCALA DE PASSAGEIROS - RELAPAX</div>
        <div>${mission.origem} / ${mission.destino}</div>
      </div>
      
      <div class="mission-info">
        <div><strong>Missão Nº:</strong> ${mission.numero}</div>
        <div><strong>Data/Hora:</strong> ${new Date(mission.dataHora).toLocaleString('pt-BR')}</div>
        <div><strong>Aeronave:</strong> ${mission.aeronave}</div>
        <div><strong>Página:</strong> ${pageNumber} de ${totalPages}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th class="col-numero">Nº</th>
            <th class="col-posto">Posto</th>
            <th class="col-nome-guerra">Nome de Guerra</th>
            <th class="col-nome-completo">Nome Completo</th>
            <th class="col-identidade">Identidade</th>
            <th class="col-cpf">CPF</th>
            <th class="col-base">Base</th>
            <th class="col-prioridade">Prioridade</th>
            <th class="col-observacoes">Observações</th>
          </tr>
        </thead>
        <tbody>
          ${passengers.map((passenger, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${passenger.posto}</td>
              <td>${passenger.nomeGuerra}</td>
              <td>${passenger.nomeCompleto}</td>
              <td>${passenger.identidade}</td>
              <td>${passenger.cpf}</td>
              <td>${baseConfig[passenger.base] || passenger.base}</td>
              <td>${passenger.prioridade}</td>
              <td>${passenger.observacoes}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <div>Emitido em: ${new Date().toLocaleString('pt-BR')}</div>
        <div class="signature-box">
          <div>_________________________</div>
          <div>Responsável pela Emissão</div>
        </div>
      </div>
    `;
  };

  const handlePrint = (mission: Mission) => {
    const passengersPerPage = 30;
    const allPassengers = mission.passageiros || [];
    const totalPassengers = allPassengers.length;
    const totalPages = Math.ceil(totalPassengers / passengersPerPage);

    const firstPagePassengers = allPassengers.slice(0, passengersPerPage);
    const secondPagePassengers = totalPages > 1 ? allPassengers.slice(passengersPerPage, 2 * passengersPerPage) : [];

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>RELAPAX - ${mission.numero}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 15mm;
          }
          
          @media print {
            body { 
              margin: 0; 
              font-family: Arial, sans-serif;
              font-size: 10px;
            }
            .page-break { 
              page-break-before: always; 
            }
          }
          
          body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 0;
          }
          
          .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          
          .title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          
          .mission-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 11px;
          }
          
          .mission-info div {
            flex: 1;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          
          th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: center;
            font-size: 9px;
            vertical-align: middle;
          }
          
          th {
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 8px;
          }
          
          .col-numero { width: 4%; }
          .col-posto { width: 8%; }
          .col-nome-guerra { width: 12%; }
          .col-nome-completo { width: 20%; }
          .col-identidade { width: 12%; }
          .col-cpf { width: 12%; }
          .col-base { width: 8%; }
          .col-prioridade { width: 6%; }
          .col-observacoes { width: 18%; }
          
          .footer {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }
          
          .signature-box {
            width: 200px;
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 5px;
          }
          
          .page-break {
            page-break-before: always;
          }
        </style>
      </head>
      <body>
        ${generatePageContent(firstPagePassengers, mission, baseConfig, 1, totalPages)}
        ${secondPagePassengers.length > 0 ? `<div class="page-break">${generatePageContent(secondPagePassengers, mission, baseConfig, 2, totalPages)}</div>` : ''}
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Missões de Voo</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Missão
        </Button>
      </div>

      <div className="grid gap-4">
        {missions.map((mission) => (
          <Card key={mission.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Missão {mission.numero}</h3>
                <p className="text-sm text-gray-600">
                  {mission.origem} → {mission.destino}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(mission.dataHora).toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-gray-600">
                  Aeronave: {mission.aeronave} | Passageiros: {mission.passageiros?.length || 0}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(mission)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                {(currentUser.perfil === 'Administrador' || currentUser.perfil === 'Supervisor') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(mission.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Passageiros</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingPassengerFor(mission.id)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar Passageiro
                </Button>
              </div>

              {mission.passageiros && mission.passageiros.length > 0 ? (
                <div className="space-y-2">
                  {mission.passageiros
                    .sort((a, b) => {
                      const rankOrderA = getRankOrder(a.posto);
                      const rankOrderB = getRankOrder(b.posto);
                      if (rankOrderA !== rankOrderB) {
                        return rankOrderB - rankOrderA;
                      }
                      return a.prioridade - b.prioridade;
                    })
                    .map((passenger, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <span className="font-medium">
                            {passenger.posto} {passenger.nomeGuerra}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            - {passenger.nomeCompleto}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            (Prioridade: {passenger.prioridade})
                          </span>
                        </div>
                        {(currentUser.perfil === 'Administrador' || currentUser.perfil === 'Supervisor') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePassenger(mission.id, index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handlePrint(mission)}
                      className="flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Imprimir RELAPAX
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Nenhum passageiro adicionado</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Missão' : 'Criar Nova Missão'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Edite os campos da missão para atualizar as informações.'
                : 'Preencha os campos abaixo para criar uma nova missão.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numero" className="text-right">
                Número
              </Label>
              <Input
                id="numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origem" className="text-right">
                Origem
              </Label>
              <Input
                id="origem"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destino" className="text-right">
                Destino
              </Label>
              <Input
                id="destino"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataHora" className="text-right">
                Data/Hora
              </Label>
              <Input
                type="datetime-local"
                id="dataHora"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="aeronave" className="text-right">
                Aeronave
              </Label>
              <Input
                id="aeronave"
                value={aeronave}
                onChange={(e) => setAeronave(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={() => { setIsFormOpen(false); clearForm(); setIsEditing(false); }}>
              Cancelar
            </Button>
            <Button type="submit" onClick={isEditing ? handleUpdate : handleCreate} className="ml-2">
              {isEditing ? 'Atualizar Missão' : 'Criar Missão'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir esta missão? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={() => { setIsDeleteConfirmationOpen(false); setMissionToDeleteId(null); }}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" onClick={confirmDelete} className="ml-2">
              Excluir Missão
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addingPassengerFor !== null} onOpenChange={() => setAddingPassengerFor(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Passageiro</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do passageiro para adicionar à missão.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passengerPosto" className="text-right">
                Posto
              </Label>
              <Input
                id="passengerPosto"
                value={passengerPosto}
                onChange={(e) => setPassengerPosto(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passengerNomeGuerra" className="text-right">
                Nome de Guerra
              </Label>
              <Input
                id="passengerNomeGuerra"
                value={passengerNomeGuerra}
                onChange={(e) => setPassengerNomeGuerra(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passengerNomeCompleto" className="text-right">
                Nome Completo
              </Label>
              <Input
                id="passengerNomeCompleto"
                value={passengerNomeCompleto}
                onChange={(e) => setPassengerNomeCompleto(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passengerIdentidade" className="text-right">
                Identidade
              </Label>
              <Input
                id="passengerIdentidade"
                value={passengerIdentidade}
                onChange={(e) => setPassengerIdentidade(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passengerCPF" className="text-right">
                CPF
              </Label>
              <Input
                id="passengerCPF"
                value={passengerCPF}
                onChange={(e) => setPassengerCPF(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passengerBase" className="text-right">
                Base
              </Label>
              <Select value={passengerBase} onValueChange={setPassengerBase}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a base" />
                </SelectTrigger>
                <SelectContent>
                  {AIR_BASES.map(base => (
                    <SelectItem key={base.code} value={base.code}>
                      {base.code} - {base.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passengerPrioridade" className="text-right">
                Prioridade
              </Label>
              <Input
                id="passengerPrioridade"
                type="number"
                value={passengerPrioridade}
                onChange={(e) => setPassengerPrioridade(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passengerObservacoes" className="text-right">
                Observações
              </Label>
              <Input
                id="passengerObservacoes"
                value={passengerObservacoes}
                onChange={(e) => setPassengerObservacoes(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={() => { setAddingPassengerFor(null); clearPassengerForm(); }}>
              Cancelar
            </Button>
            <Button type="submit" onClick={addPassenger} className="ml-2">
              Adicionar Passageiro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MissionList;
