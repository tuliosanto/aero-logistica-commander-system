
export interface User {
  id: string;
  posto: string;
  nomeGuerra: string;
  nomeCompleto: string;
  baseAerea: string;
  perfil: 'Operador' | 'Administrador' | 'Supervisor';
  senha: string;
  username: string;
}
