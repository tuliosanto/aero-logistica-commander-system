
export interface CANWaitlistPassenger {
  id: string;
  posto: string;
  nome: string;
  cpf: string;
  telefone?: string;
  destino: string;
  peso: number;
  pesoBagagem: number;
  pesoBagagemMao: number;
  prioridade: number;
  responsavelInscricao: string;
  parentesco?: string;
  dataInscricao: string;
  baseAerea: string;
  isAllocated?: boolean;
}
