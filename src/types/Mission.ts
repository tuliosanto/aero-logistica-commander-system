
export interface Mission {
  id: string;
  aeronave: string;
  matricula: string;
  trechos: string; // Changed from string[] to string to match how it's used
  dataVoo: string;
  ofrag: string;
  operadorId: string;
  passageiros: Passenger[];
  createdAt: string;
  baseAerea: string; // Adicionando campo para identificar a base aérea
  isCompleted?: boolean; // Nova propriedade para indicar se a missão foi concluída
}

export interface Passenger {
  id: string;
  posto: string;
  nome: string;
  cpf: string;
  telefone?: string; // Adding telefone field
  destino: string;
  peso: number;
  pesoBagagem: number;
  pesoBagagemMao: number;
  prioridade: number;
  checkedIn?: boolean;
  responsavelInscricao: string;
  parentesco: string;
  fromWaitlist?: boolean; // Nova propriedade para indicar se veio da lista de espera
  waitlistId?: string; // ID do registro na lista de espera (se aplicável)
}
