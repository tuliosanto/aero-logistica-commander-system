
export interface User {
  id: string;
  posto: string;
  nomeGuerra: string;
  nomeCompleto: string;
  baseAerea: string;
  perfil: 'Operador' | 'Administrador' | 'Supervisor' | 'Secretario';
  senha: string;
  username: string;
  nome?: string; // Nome completo do usuário para relatórios
}
