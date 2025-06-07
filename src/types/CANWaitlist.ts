
export interface CANWaitlistPassenger {
  id: string;
  posto: string;
  nome: string;
  cpf: string;
  telefone: string;
  destino: string;
  peso: number;
  pesoBagagem: number;
  pesoBagagemMao: number;
  prioridade: number;
  responsavelInscricao: string;
  parentesco: string;
  dataInscricao: string;
  dataInicioValidade: string; // Nova data de início da validade
  dataFimValidade: string; // Data calculada automaticamente (início + 10 dias)
  baseAerea: string;
  isAllocated?: boolean;
  missionId?: string;
  isExpired?: boolean; // Para verificar se a inscrição expirou
}

// Alias for backward compatibility
export type CANWaitlistEntry = CANWaitlistPassenger;
