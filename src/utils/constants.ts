
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
  { code: 'BAAF', name: 'BASE AÉREA DOS AFONSOS', location: 'Rio de Janeiro - RJ' }
];

export const AERODROMOS = [
  // Aeródromos com bases aéreas associadas
  { code: 'SBAN', name: 'Anápolis', location: 'Anápolis - GO', baseAerea: 'BAAN' },
  { code: 'SBBE', name: 'Val de Cans', location: 'Belém - PA', baseAerea: 'BABE' },
  { code: 'SBBV', name: 'Atlas Brasil Cantanhede', location: 'Boa Vista - RR', baseAerea: 'BABV' },
  { code: 'SBBR', name: 'Juscelino Kubitschek', location: 'Brasília - DF', baseAerea: 'BABR' },
  { code: 'SBCG', name: 'Campo Grande', location: 'Campo Grande - MS', baseAerea: 'BACG' },
  { code: 'SBCO', name: 'Canoas', location: 'Canoas - RS', baseAerea: 'BACO' },
  { code: 'SBFL', name: 'Hercílio Luz', location: 'Florianópolis - SC', baseAerea: 'BAFL' },
  { code: 'SBFZ', name: 'Pinto Martins', location: 'Fortaleza - CE', baseAerea: 'BAFZ' },
  { code: 'SBEG', name: 'Eduardo Gomes', location: 'Manaus - AM', baseAerea: 'BAMN' },
  { code: 'SBNT', name: 'Augusto Severo', location: 'Natal - RN', baseAerea: 'BANT' },
  { code: 'SBPV', name: 'Governador Jorge Teixeira de Oliveira', location: 'Porto Velho - RO', baseAerea: 'BAPV' },
  { code: 'SBRF', name: 'Guararapes', location: 'Recife - PE', baseAerea: 'BARF' },
  { code: 'SBSV', name: 'Deputado Luís Eduardo Magalhães', location: 'Salvador - BA', baseAerea: 'BASV' },
  { code: 'SBAF', name: 'Santos Dumont', location: 'Rio de Janeiro - RJ', baseAerea: 'BASC' },
  { code: 'SBSM', name: 'Base Aérea de Santa Maria', location: 'Santa Maria - RS', baseAerea: 'BASM' },
  { code: 'SBST', name: 'Base Aérea de Santos', location: 'Guarujá - SP', baseAerea: 'BAST' },
  { code: 'SBGR', name: 'Guarulhos', location: 'São Paulo - SP', baseAerea: 'BASP' },
  { code: 'SBGL', name: 'Galeão', location: 'Rio de Janeiro - RJ', baseAerea: 'BAGL' },
  { code: 'SBAF', name: 'Campo dos Afonsos', location: 'Rio de Janeiro - RJ', baseAerea: 'BAAF' },
  
  // Aeródromos sem bases aéreas associadas
  { code: 'SBSP', name: 'Congonhas', location: 'São Paulo - SP' },
  { code: 'SBKP', name: 'Viracopos', location: 'Campinas - SP' },
  { code: 'SBPA', name: 'Salgado Filho', location: 'Porto Alegre - RS' },
  { code: 'SBCT', name: 'Afonso Pena', location: 'Curitiba - PR' },
  { code: 'SBBH', name: 'Tancredo Neves', location: 'Belo Horizonte - MG' },
  { code: 'SBGO', name: 'Santa Genoveva', location: 'Goiânia - GO' },
  { code: 'SBVT', name: 'Eurico de Aguiar Salles', location: 'Vitória - ES' },
  { code: 'SBMQ', name: 'Alberto Alcolumbre', location: 'Macapá - AP' },
  { code: 'SBSL', name: 'Marechal Cunha Machado', location: 'São Luís - MA' },
  { code: 'SBTE', name: 'Senador Petrônio Portella', location: 'Teresina - PI' },
  { code: 'SBCY', name: 'Hugo Cantergiani', location: 'Caxias do Sul - RS' },
  { code: 'SBDN', name: 'Presidente Castro Pinto', location: 'João Pessoa - PB' },
  { code: 'SBMO', name: 'Campo de Marte', location: 'São Paulo - SP' },
  { code: 'SBJP', name: 'Presidente Castro Pinto', location: 'João Pessoa - PB' },
  { code: 'SBAC', name: 'Plácido de Castro', location: 'Rio Branco - AC' },
  { code: 'SBCZ', name: 'Campo Grande', location: 'Corumbá - MS' },
  { code: 'SBji', name: 'Presidente Itamar Franco', location: 'Juiz de Fora - MG' },
  { code: 'SBLO', name: 'Coronel Horácio de Mattos', location: 'Lençóis - BA' },
  { code: 'SBMN', name: 'Zumbi dos Palmares', location: 'Maceió - AL' },
  { code: 'SBAQ', name: 'Dix-Sept Rosado', location: 'Mossoró - RN' },
  { code: 'SBPF', name: 'Lauro Kurtz', location: 'Passo Fundo - RS' },
  { code: 'SBRB', name: 'Plácido de Castro', location: 'Rio Branco - AC' },
  { code: 'SBUG', name: 'Rubem Berta', location: 'Uruguaiana - RS' },
  { code: 'SBCC', name: 'Cabo Frio', location: 'Cabo Frio - RJ' }
];

export const PRIORITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export const getRankOrder = (rank: string): number => {
  return MILITARY_RANKS.indexOf(rank);
};

export const getAerodromoByBase = (baseAerea: string): string => {
  const aerodrome = AERODROMOS.find(aero => aero.baseAerea === baseAerea);
  return aerodrome?.code || '';
};
