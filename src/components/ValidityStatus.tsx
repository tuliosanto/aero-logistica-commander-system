
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getValidityStatus, getDaysUntilExpiry } from '../utils/validityUtils';

interface ValidityStatusProps {
  endDate: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ValidityStatus = ({ endDate, showIcon = true, size = 'md' }: ValidityStatusProps) => {
  const status = getValidityStatus(endDate);
  const daysLeft = getDaysUntilExpiry(endDate);

  const getStatusConfig = () => {
    switch (status) {
      case 'expired':
        return {
          variant: 'destructive' as const,
          icon: XCircle,
          text: 'Expirado',
          className: 'bg-red-100 text-red-800 border-red-300'
        };
      case 'expiring':
        return {
          variant: 'outline' as const,
          icon: AlertTriangle,
          text: `Expira em ${daysLeft} dia${daysLeft !== 1 ? 's' : ''}`,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
        };
      case 'active':
        return {
          variant: 'outline' as const,
          icon: CheckCircle,
          text: `Válido por ${daysLeft} dias`,
          className: 'bg-green-100 text-green-800 border-green-300'
        };
      default:
        return {
          variant: 'outline' as const,
          icon: Clock,
          text: 'Status desconhecido',
          className: 'bg-gray-100 text-gray-800 border-gray-300'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.text}
    </Badge>
  );
};

export default ValidityStatus;
