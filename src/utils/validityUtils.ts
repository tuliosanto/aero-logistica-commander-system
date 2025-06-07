
import { addDays, isAfter, isBefore, isToday, isWithinInterval, parseISO } from 'date-fns';

export const calculateEndDate = (startDate: string): string => {
  const start = new Date(startDate);
  const end = addDays(start, 10);
  return end.toISOString().split('T')[0]; // Retorna apenas a data no formato YYYY-MM-DD
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

// Nova função para verificar se a data da missão está dentro do período de validade da inscrição
export const isMissionDateWithinValidity = (
  missionDate: string, 
  startDate: string, 
  endDate: string
): boolean => {
  if (!missionDate || !startDate || !endDate) return false;
  
  try {
    const mission = parseISO(missionDate);
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    return isWithinInterval(mission, { start, end });
  } catch (error) {
    console.error('Error checking mission date validity:', error);
    return false;
  }
};
