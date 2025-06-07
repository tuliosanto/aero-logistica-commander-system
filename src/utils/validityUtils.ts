import { addDays, isAfter, isBefore, isToday, isWithinInterval, parseISO, isSameDay } from 'date-fns';

export const calculateEndDate = (startDate: string, days: number = 10): string => {
  const start = new Date(startDate);
  const end = addDays(start, days);
  return end.toISOString().split('T')[0];
};

export const isValidityExpired = (endDate: string): boolean => {
  const today = new Date();
  const validity = new Date(endDate);
  return isAfter(today, validity);
};

export const isValidityExpiring = (endDate: string, daysThreshold: number = 2): boolean => {
  const today = new Date();
  const validity = new Date(endDate);
  const warningDate = addDays(today, daysThreshold);
  
  return isAfter(validity, today) && (isBefore(validity, warningDate) || isToday(validity));
};

export const getDaysUntilExpiry = (endDate: string): number => {
  const today = new Date();
  const validity = new Date(endDate);
  const diffTime = validity.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const getValidityStatus = (endDate: string): 'active' | 'expiring' | 'expired' => {
  if (isValidityExpired(endDate)) {
    return 'expired';
  }
  if (isValidityExpiring(endDate, 2)) {
    return 'expiring';
  }
  return 'active';
};

// Função corrigida para verificar se a data da missão está dentro do período de validade da inscrição
export const isMissionDateWithinValidity = (
  missionDate: string, 
  startDate: string, 
  endDate: string
): boolean => {
  if (!missionDate || !startDate || !endDate) {
    console.log('Missing dates:', { missionDate, startDate, endDate });
    return false;
  }
  
  try {
    // Normalizar as datas para comparação (apenas a parte da data, sem horário)
    const missionDateObj = new Date(missionDate + 'T00:00:00');
    const startDateObj = new Date(startDate + 'T00:00:00');
    const endDateObj = new Date(endDate + 'T23:59:59');
    
    console.log('Date comparison:', {
      missionDate: missionDateObj.toISOString().split('T')[0],
      startDate: startDateObj.toISOString().split('T')[0], 
      endDate: endDateObj.toISOString().split('T')[0]
    });
    
    // Verificar se a data da missão está dentro do intervalo (inclusive)
    const isWithinRange = missionDateObj >= startDateObj && missionDateObj <= endDateObj;
    
    console.log('Is mission date within validity range?', isWithinRange);
    
    return isWithinRange;
  } catch (error) {
    console.error('Error checking mission date validity:', error);
    return false;
  }
};
