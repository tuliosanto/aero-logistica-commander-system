
export interface User {
  id: string;
  posto: string;
  nomeGuerra: string;
  nomeCompleto: string;
  baseAerea: string;
  perfil: 'Operador' | 'Administrador' | 'Supervisor' | 'Secretario';
  senha: string;
  username: string;
}
