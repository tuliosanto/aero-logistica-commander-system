
export interface User {
  id: string;
  posto: string;
  nomeGuerra: string;
  nomeCompleto: string;
  baseAerea: string;
  perfil: 'Operador' | 'Administrador';
  senha: string;
  username: string;
}
