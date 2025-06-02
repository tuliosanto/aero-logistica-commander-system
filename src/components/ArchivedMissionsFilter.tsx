
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';
import { Mission } from '../types/Mission';

interface ArchivedMissionsFilterProps {
  missions: Mission[];
  onFilter: (filteredMissions: Mission[]) => void;
}

interface FilterState {
  aeronave: string;
  trechos: string;
  ofrag: string;
  passengerName: string;
  passengerCPF: string;
}

const ArchivedMissionsFilter = ({ missions, onFilter }: ArchivedMissionsFilterProps) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    aeronave: '',
    trechos: '',
    ofrag: '',
    passengerName: '',
    passengerCPF: ''
  });

  const applyFilters = () => {
    let filteredMissions = missions;

    if (filters.aeronave) {
      filteredMissions = filteredMissions.filter(mission =>
        mission.aeronave.toLowerCase().includes(filters.aeronave.toLowerCase())
      );
    }

    if (filters.trechos) {
      filteredMissions = filteredMissions.filter(mission =>
        mission.trechos.some(trecho =>
          trecho.toLowerCase().includes(filters.trechos.toLowerCase())
        )
      );
    }

    if (filters.ofrag) {
      filteredMissions = filteredMissions.filter(mission =>
        mission.ofrag.toLowerCase().includes(filters.ofrag.toLowerCase())
      );
    }

    if (filters.passengerName) {
      filteredMissions = filteredMissions.filter(mission =>
        mission.passageiros.some(passenger =>
          passenger.nome.toLowerCase().includes(filters.passengerName.toLowerCase())
        )
      );
    }

    if (filters.passengerCPF) {
      filteredMissions = filteredMissions.filter(mission =>
        mission.passageiros.some(passenger =>
          passenger.cpf.includes(filters.passengerCPF)
        )
      );
    }

    onFilter(filteredMissions);
  };

  const clearFilters = () => {
    setFilters({
      aeronave: '',
      trechos: '',
      ofrag: '',
      passengerName: '',
      passengerCPF: ''
    });
    onFilter(missions);
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowFilter(!showFilter)}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        {showFilter ? 'Ocultar Filtros' : 'Filtrar Missões'}
      </Button>

      {showFilter && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aeronave">Aeronave</Label>
                <Input
                  id="aeronave"
                  value={filters.aeronave}
                  onChange={(e) => handleFilterChange('aeronave', e.target.value)}
                  placeholder="Ex: C-95"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trechos">Trechos</Label>
                <Input
                  id="trechos"
                  value={filters.trechos}
                  onChange={(e) => handleFilterChange('trechos', e.target.value)}
                  placeholder="Ex: SBSM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ofrag">OFRAG</Label>
                <Input
                  id="ofrag"
                  value={filters.ofrag}
                  onChange={(e) => handleFilterChange('ofrag', e.target.value)}
                  placeholder="Ex: 001/2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengerName">Nome do Passageiro</Label>
                <Input
                  id="passengerName"
                  value={filters.passengerName}
                  onChange={(e) => handleFilterChange('passengerName', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengerCPF">CPF do Passageiro</Label>
                <Input
                  id="passengerCPF"
                  value={filters.passengerCPF}
                  onChange={(e) => handleFilterChange('passengerCPF', e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArchivedMissionsFilter;
