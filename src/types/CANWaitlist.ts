
export interface CANWaitlistPassenger {
  id: string;
  posto: string;
  nome: string;
  cpf: string;
  destino: string;
  peso: number;
  pesoBagagem: number;
  pesoBagagemMao: number;
  prioridade: number; // 1-13 como nas missões
  responsavelInscricao: string;
  parentesco: string;
  dataInscricao: string;
  baseAerea: string;
  isAllocated?: boolean; // Nova propriedade para indicar se está alocado em uma missão
  missionId?: string; // ID da missão onde está alocado
}
