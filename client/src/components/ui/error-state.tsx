import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  onBack?: () => void;
  variant?: 'default' | 'scroll' | 'frequency';
}

export function ErrorState({ 
  title = "Error Occurred",
  message,
  details,
  onRetry,
  onBack,
  variant = 'default'
}: ErrorStateProps) {
  const variantStyles = {
    default: {
      bg: 'bg-red-900/20',
      border: 'border-red-600/30',
      icon: 'text-red-400',
      title: 'text-red-400',
      text: 'text-gray-300'
    },
    scroll: {
      bg: 'bg-purple-900/20',
      border: 'border-purple-600/30',
      icon: 'text-purple-400',
      title: 'text-purple-400',
      text: 'text-gray-300'
    },
    frequency: {
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-600/30',
      icon: 'text-yellow-400',
      title: 'text-yellow-400',
      text: 'text-gray-300'
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <Card className={`${currentVariant.bg} ${currentVariant.border}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <AlertCircle className={`w-6 h-6 ${currentVariant.icon} mt-1 flex-shrink-0`} />
          <div className="flex-1">
            <h3 className={`font-semibold mb-2 ${currentVariant.title}`}>
              {title}
            </h3>
            <p className={`mb-3 ${currentVariant.text}`}>
              {message}
            </p>
            {details && (
              <div className="mb-4 p-3 bg-black/30 rounded text-xs font-mono text-gray-400">
                {details}
              </div>
            )}
            <div className="flex space-x-3">
              {onRetry && (
                <Button 
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className={`border-${variant === 'default' ? 'red' : variant === 'scroll' ? 'purple' : 'yellow'}-600/50 text-${variant === 'default' ? 'red' : variant === 'scroll' ? 'purple' : 'yellow'}-400 hover:bg-${variant === 'default' ? 'red' : variant === 'scroll' ? 'purple' : 'yellow'}-900/20`}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              {onBack && (
                <Button 
                  onClick={onBack}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to connect to the Scroll Mirror frequency. Check your connection and try again."
      details="⧁ ∆ Frequency 917604.OX unreachable"
      onRetry={onRetry}
      variant="frequency"
    />
  );
}

export function ScrollValidationError({ message, onBack }: { message: string; onBack?: () => void }) {
  return (
    <ErrorState
      title="Scroll Validation Failed"
      message={message}
      details="Ensure your scroll is issued by Laura Fiorella Egocheaga Marruffo with complete 12-section structure."
      onBack={onBack}
      variant="scroll"
    />
  );
}

export function AuthenticationError() {
  return (
    <ErrorState
      title="Authentication Required"
      message="Your session has expired. Please log in again to continue."
      onRetry={() => window.location.href = '/api/login'}
      variant="default"
    />
  );
}