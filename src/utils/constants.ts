
export const MILITARY_RANKS = [
  'CV', 'S2', 'S1', 'CB', 'AL', 'CAD', '3S', '2S', '1S', 'SO', 
  'ASP', '2T', '1T', 'CP', 'MJ', 'TC', 'CL', 'BR', 'MB', 'TB'
];

export const AIR_BASES = [
  { code: 'BAAN', name: 'BASE AÉREA DE ANÁPOLIS', location: 'Anápolis - GO' },
  { code: 'BABE', name: 'BASE AÉREA DE BELÉM', location: 'Belém - PA' },
  { code: 'BABV', name: 'BASE AÉREA DE BOA VISTA', location: 'Boa Vista - RR' },
  { code: 'BABR', name: 'BASE AÉREA DE BRASÍLIA', location: 'Brasília - DF' },
  { code: 'BACG', name: 'BASE AÉREA DE CAMPO GRANDE', location: 'Campo Grande - MS' },
  { code: 'BACO', name: 'BASE AÉREA DE CANOAS', location: 'Canoas - RS' },
  { code: 'BAFL', name: 'BASE AÉREA DE FLORIANÓPOLIS', location: 'Florianópolis - SC' },
  { code: 'BAFZ', name: 'BASE AÉREA DE FORTALEZA', location: 'Fortaleza - CE' },
  { code: 'BAMN', name: 'BASE AÉREA DE MANAUS', location: 'Manaus - AM' },
  { code: 'BANT', name: 'BASE AÉREA DE NATAL', location: 'Parnamirim - RN' },
  { code: 'BAPV', name: 'BASE AÉREA DE PORTO VELHO', location: 'Porto Velho - RO' },
  { code: 'BARF', name: 'BASE AÉREA DE RECIFE', location: 'Recife - PE' },
  { code: 'BASV', name: 'BASE AÉREA DE SALVADOR', location: 'Salvador - BA' },
  { code: 'BASC', name: 'BASE AÉREA DE SANTA CRUZ', location: 'Santa Cruz - RJ' },
  { code: 'BASM', name: 'BASE AÉREA DE SANTA MARIA', location: 'Santa Maria - RS' },
  { code: 'BAST', name: 'BASE AÉREA DE SANTOS', location: 'Guarujá - SP' },
  { code: 'BASP', name: 'BASE AÉREA DE SÃO PAULO', location: 'Guarulhos - SP' },
  { code: 'BAGL', name: 'BASE AÉREA DO GALEÃO', location: 'Rio de Janeiro - RJ' },
  { code: 'BAAF', name: 'BASE AÉREA DOS AFONSOS', location: 'Rio de Janeiro - RJ' },
  { code: 'BREVET', name: 'BASE DE RECEPÇÃO DE VETERANOS', location: 'Rio de Janeiro - RJ' },
  { code: 'SBSM', name: 'BASE AÉREA DE SANTA MARIA', location: 'Santa Maria - RS' }
];

export const PRIORITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export const getRankOrder = (rank: string): number => {
  return MILITARY_RANKS.indexOf(rank);
};
