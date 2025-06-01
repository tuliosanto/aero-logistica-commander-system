import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { BaseConfig } from '../types/BaseConfig';
import { User } from '../types/User';
import { useBaseImage } from '../hooks/useBaseImage';

interface BaseConfigProps {
  currentUser: User;
}

const BaseConfigComponent = ({ currentUser }: BaseConfigProps) => {
  const [config, setConfig] = useState<BaseConfig | null>(null);
  const [nomeChefe, setNomeChefe] = useState('');
  const [postoChefe, setPostoChefe] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const baseImage = useBaseImage(currentUser.baseAerea);

  useEffect(() => {
    loadConfig();
  }, [currentUser.baseAerea]);

  const loadConfig = () => {
    // Simulando carregamento das configurações
    const savedConfig = localStorage.getItem(`baseConfig_${currentUser.baseAerea}`);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setConfig(config);
      setNomeChefe(config.nomeChefe);
      setPostoChefe(config.postoChefe);
    } else {
      setNomeChefe('');
      setPostoChefe('');
    }
  };

  const handleSave = () => {
    setIsLoading(true);

    const newConfig: BaseConfig = {
      id: config?.id || Date.now().toString(),
      baseAerea: currentUser.baseAerea,
      nomeChefe,
      postoChefe,
      createdAt: config?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salvando no localStorage (em produção seria uma API)
    localStorage.setItem(`baseConfig_${currentUser.baseAerea}`, JSON.stringify(newConfig));
    setConfig(newConfig);

    toast({
      title: "Configurações salvas",
      description: "As configurações da base aérea foram atualizadas com sucesso.",
    });

    setIsLoading(false);
  };

  const getCodigoBase = () => {
    // Extrai os dois últimos caracteres da base aérea
    return currentUser.baseAerea.slice(-2);
  };

  if (currentUser.perfil === 'Operador') {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">
          Apenas Supervisores e Administradores podem acessar as configurações da base aérea.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-700">
            Configurações da Base Aérea - {currentUser.baseAerea}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="postoChefe">Posto do Chefe do PCAN-{getCodigoBase()}</Label>
              <Input
                type="text"
                id="postoChefe"
                value={postoChefe}
                onChange={(e) => setPostoChefe(e.target.value)}
                placeholder="Ex: Cap R1"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="nomeChefe">Nome do Chefe do PCAN-{getCodigoBase()}</Label>
              <Input
                type="text"
                id="nomeChefe"
                value={nomeChefe}
                onChange={(e) => setNomeChefe(e.target.value)}
                placeholder="Ex: João Marcos Aguirre"
              />
            </div>

            <Button 
              onClick={handleSave} 
              disabled={isLoading || !nomeChefe.trim() || !postoChefe.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>  
          <div className="flex justify-center items-center">
            <img 
              src={baseImage} 
              alt={`Logo da ${currentUser.baseAerea}`}
              className="max-w-full max-h-64 object-contain mx-auto"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BaseConfigComponent;
