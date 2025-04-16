import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { PropsWithChildren } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorMessageProps extends PropsWithChildren {
  title: string;
  severity?: ErrorSeverity;
}

export function ErrorMessage({ title, children, severity = 'error' }: ErrorMessageProps) {
  const getIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
    }
  };

  return (
    <Alert variant={getAlertVariant(severity)} className="max-w-[800px]">
      {getIcon(severity)}
      <AlertTitle>{title}</AlertTitle>
      {children && <AlertDescription>{children}</AlertDescription>}
    </Alert>
  );
}
