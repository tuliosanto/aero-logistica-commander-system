
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Edit2, Trash2, Check, X, ArrowLeft, CheckCircle } from 'lucide-react';
import { Passenger } from '../types/Mission';
import { MILITARY_RANKS, PRIORITIES, AERODROMOS } from '../utils/constants';
import { toast } from '@/hooks/use-toast';
import PriorityTooltip from './PriorityTooltip';

interface PassengerListProps {
  passengers: Passenger[];
  onPassengersChange: (passengers: Passenger[]) => void;
  showMoveToWaitlist?: boolean;
  onMoveToWaitlist?: (passenger: Passenger) => void;
  onComplete?: () => void;
}

const PassengerList = ({ 
  passengers, 
  onPassengersChange, 
  showMoveToWaitlist = false, 
  onMoveToWaitlist,
  onComplete 
}: PassengerListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [posto, setPosto] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [destino, setDestino] = useState('');
  const [peso, setPeso] = useState(70);
  const [pesoBagagem, setPesoBagagem] = useState(0);
  const [pesoBagagemMao, setPesoBagagemMao] = useState(0);
  const [prioridade, setPrioridade] = useState(13);
  const [responsavelInscricao, setResponsavelInscricao] = useState('');
  const [parentesco, setParentesco] = useState('');

  // Sort passengers by priority
  const sortedPassengers = passengers.sort((a, b) => a.prioridade - b.prioridade);

  const resetForm = () => {
    setPosto('');
    setNome('');
    setCpf('');
    setDestino('');
    setPeso(70);
    setPesoBagagem(0);
    setPesoBagagemMao(0);
    setPrioridade(13);
    setResponsavelInscricao('');
    setParentesco('');
    setEditingId(null);
  };

  const startEdit = (passenger: Passenger) => {
    setPosto(passenger.posto);
    setNome(passenger.nome);
    setCpf(passenger.cpf);
    setDestino(passenger.destino);
    setPeso(passenger.peso);
    setPesoBagagem(passenger.pesoBagagem);
    setPesoBagagemMao(passenger.pesoBagagemMao);
    setPrioridade(passenger.prioridade);
    setResponsavelInscricao(passenger.responsavelInscricao);
    setParentesco(passenger.parentesco);
    setEditingId(passenger.id);
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    const updatedPassengers = passengers.map(p =>
      p.id === editingId
        ? {
            ...p,
            posto,
            nome,
            cpf,
            destino,
            peso,
            pesoBagagem,
            pesoBagagemMao,
            prioridade,
            responsavelInscricao,
            parentesco
          }
        : p
    );
    
    onPassengersChange(updatedPassengers);
    resetForm();
    
    toast({
      title: "Passageiro atualizado",
      description: `${posto} ${nome} foi atualizado com sucesso.`,
    });
  };

  const addPassenger = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPassenger: Passenger = {
      id: Date.now().toString(),
      posto,
      nome,
      cpf,
      destino,
      peso,
      pesoBagagem,
      pesoBagagemMao,
      prioridade,
      checkedIn: false,
      responsavelInscricao,
      parentesco
    };

    onPassengersChange([...passengers, newPassenger]);
    resetForm();
    setShowForm(false);
    
    toast({
      title: "Passageiro adicionado",
      description: `${posto} ${nome} foi adicionado à missão.`,
    });
  };

  const removePassenger = (passengerId: string) => {
    const passenger = passengers.find(p => p.id === passengerId);
    if (!passenger) return;

    if (confirm(`Tem certeza que deseja remover ${passenger.posto} ${passenger.nome} da missão?`)) {
      onPassengersChange(passengers.filter(p => p.id !== passengerId));
      
      toast({
        title: "Passageiro removido",
        description: `${passenger.posto} ${passenger.nome} foi removido da missão.`,
      });
    }
  };

  const toggleCheckIn = (passengerId: string) => {
    const updatedPassengers = passengers.map(p =>
      p.id === passengerId ? { ...p, checkedIn: !p.checkedIn } : p
    );
    onPassengersChange(updatedPassengers);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 3) return 'bg-red-100 text-red-800';
    if (priority <= 6) return 'bg-orange-100 text-orange-800';
    if (priority <= 9) return 'bg-yellow-100 text-yellow-800';
    if (priority <= 12) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Passageiro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addPassenger} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="posto">Posto/Graduação</Label>
                  <Select value={posto} onValueChange={setPosto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o posto" />
                    </SelectTrigger>
                    <SelectContent>
                      {MILITARY_RANKS.map(rank => (
                        <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input 
                    id="nome" 
                    value={nome} 
                    onChange={e => setNome(e.target.value)} 
                    placeholder="Nome completo do passageiro"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input 
                    id="cpf" 
                    value={cpf} 
                    onChange={handleCPFChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destino">Destino</Label>
                  <Select value={destino} onValueChange={setDestino}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {AERODROMOS.map(aero => (
                        <SelectItem key={aero.code} value={aero.code}>
                          {aero.code} - {aero.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input 
                    id="peso" 
                    type="number" 
                    value={peso} 
                    onChange={e => setPeso(Number(e.target.value))} 
                    min="1"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pesoBagagem">Bagagem Despachada (kg)</Label>
                  <Input 
                    id="pesoBagagem" 
                    type="number" 
                    value={pesoBagagem} 
                    onChange={e => setPesoBagagem(Number(e.target.value))} 
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pesoBagagemMao">Bagagem de Mão (kg)</Label>
                  <Input 
                    id="pesoBagagemMao" 
                    type="number" 
                    value={pesoBagagemMao} 
                    onChange={e => setPesoBagagemMao(Number(e.target.value))} 
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={prioridade.toString()} onValueChange={(value) => setPrioridade(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map(priority => (
                      <SelectItem key={priority.value} value={priority.value.toString()}>
                        <PriorityTooltip priority={priority.value}>
                          <span>{priority.label}</span>
                        </PriorityTooltip>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavelInscricao">Responsável pela Inscrição</Label>
                  <Input 
                    id="responsavelInscricao" 
                    value={responsavelInscricao} 
                    onChange={e => setResponsavelInscricao(e.target.value)} 
                    placeholder="Nome do responsável"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentesco">Parentesco (se aplicável)</Label>
                  <Input 
                    id="parentesco" 
                    value={parentesco} 
                    onChange={e => setParentesco(e.target.value)} 
                    placeholder="Ex: Cônjuge, Filho(a), etc."
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Adicionar Passageiro
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-green-600 hover:bg-green-700"
            disabled={showForm}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Passageiro
          </Button>
          {onComplete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Concluir Missão
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Concluir Missão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja concluir esta missão? Esta ação irá:
                    <br />• Arquivar a missão e todos os seus dados
                    <br />• Remover permanentemente os passageiros da lista de espera que foram incluídos
                    <br /><br />
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                    Sim, Concluir Missão
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {sortedPassengers.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Passageiro</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Peso Total</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPassengers.map((passenger) => (
                  <TableRow key={passenger.id} className={passenger.checkedIn ? 'bg-green-50' : ''}>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={passenger.checkedIn ? "default" : "outline"}
                        onClick={() => toggleCheckIn(passenger.id)}
                        className={passenger.checkedIn ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      {editingId === passenger.id ? (
                        <div className="space-y-2">
                          <Select value={posto} onValueChange={setPosto}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MILITARY_RANKS.map(rank => (
                                <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input 
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                            className="min-w-48"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">{passenger.posto} {passenger.nome}</p>
                          <p className="text-sm text-gray-500">
                            {passenger.parentesco && `(${passenger.parentesco})`}
                            {passenger.fromWaitlist && (
                              <span className="text-blue-600 font-semibold"> • Da lista de espera</span>
                            )}
                          </p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === passenger.id ? (
                        <Input 
                          value={cpf} 
                          onChange={handleCPFChange}
                          className="w-32"
                          maxLength={14}
                        />
                      ) : (
                        <span className="font-mono text-sm">{passenger.cpf}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === passenger.id ? (
                        <Select value={destino} onValueChange={setDestino}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AERODROMOS.map(aero => (
                              <SelectItem key={aero.code} value={aero.code}>
                                {aero.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        passenger.destino
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === passenger.id ? (
                        <div className="flex gap-1">
                          <Input 
                            type="number" 
                            value={peso} 
                            onChange={e => setPeso(Number(e.target.value))} 
                            className="w-16"
                            min="1"
                          />
                          <Input 
                            type="number" 
                            value={pesoBagagem} 
                            onChange={e => setPesoBagagem(Number(e.target.value))} 
                            className="w-16"
                            min="0"
                          />
                          <Input 
                            type="number" 
                            value={pesoBagagemMao} 
                            onChange={e => setPesoBagagemMao(Number(e.target.value))} 
                            className="w-16"
                            min="0"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">
                            {passenger.peso + passenger.pesoBagagem + passenger.pesoBagagemMao} kg
                          </p>
                          <p className="text-xs text-gray-500">
                            PAX: {passenger.peso}kg | Desp: {passenger.pesoBagagem}kg | Mão: {passenger.pesoBagagemMao}kg
                          </p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === passenger.id ? (
                        <Select value={prioridade.toString()} onValueChange={(value) => setPrioridade(parseInt(value))}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PRIORITIES.map(priority => (
                              <SelectItem key={priority.value} value={priority.value.toString()}>
                                <PriorityTooltip priority={priority.value}>
                                  <span>{priority.label}</span>
                                </PriorityTooltip>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getPriorityColor(passenger.prioridade)}>
                          {passenger.prioridade}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === passenger.id ? (
                        <div className="space-y-2">
                          <Input 
                            value={responsavelInscricao} 
                            onChange={e => setResponsavelInscricao(e.target.value)} 
                            className="min-w-32"
                          />
                          <Input 
                            value={parentesco} 
                            onChange={e => setParentesco(e.target.value)} 
                            className="min-w-32"
                            placeholder="Parentesco"
                          />
                        </div>
                      ) : (
                        passenger.responsavelInscricao
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {editingId === passenger.id ? (
                          <>
                            <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={resetForm}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(passenger)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {showMoveToWaitlist && passenger.fromWaitlist && onMoveToWaitlist && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onMoveToWaitlist(passenger)}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                <ArrowLeft className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removePassenger(passenger.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhum passageiro adicionado à missão.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PassengerList;
