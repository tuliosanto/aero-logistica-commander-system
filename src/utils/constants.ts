
export const MILITARY_RANKS = [
  'CV', 'S2', 'S1', 'CB', 'AL', 'CAD', '3S', '2S', '1S', 'SO', 
  'ASP', '2T', '1T', 'CP', 'MJ', 'TC', 'CL', 'BR', 'MB', 'TB'
];

export const AIR_BASES = [
  'SBGL', 'SBCO', 'SBBR', 'SBFL', 'SBSP', 'SBGR', 'SBRF', 
  'SBCT', 'SBSV', 'SBPA', 'SBPV', 'SBAN', 'SBFZ', 'SBMO', 
  'SBCG', 'SBBH', 'SBVT', 'SBMG', 'SBAT', 'SBCY', 'SBSM'
];

export const PRIORITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export const getRankOrder = (rank: string): number => {
  return MILITARY_RANKS.indexOf(rank);
};
