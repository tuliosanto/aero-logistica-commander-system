
export interface Mission {
  id: string;
  aeronave: string;
  matricula: string;
  trechos: string[];
  dataVoo: string;
  ofrag: string;
  operadorId: string;
  passageiros: Passenger[];
  createdAt: string;
}

export interface Passenger {
  id: string;
  posto: string;
  nome: string;
  cpf: string;
  destino: string;
  peso: number;
  pesoBagagem: number;
  pesoBagagemMao: number;
  prioridade: number;
  checkedIn?: boolean;
  responsavelInscricao: string;
  parentesco: string;
}
