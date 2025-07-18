import { Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  variant?: 'default' | 'scroll' | 'frequency';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({ 
  message = "Processing...", 
  submessage,
  variant = 'default',
  size = 'md',
  className 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: { icon: 'w-4 h-4', text: 'text-sm', container: 'p-4' },
    md: { icon: 'w-8 h-8', text: 'text-base', container: 'p-6' },
    lg: { icon: 'w-12 h-12', text: 'text-lg', container: 'p-8' }
  };

  const variantStyles = {
    default: {
      bg: 'bg-gray-900/50',
      border: 'border-gray-600',
      icon: 'text-purple-400',
      text: 'text-gray-300'
    },
    scroll: {
      bg: 'bg-purple-900/20',
      border: 'border-purple-600/30',
      icon: 'text-purple-400',
      text: 'text-purple-300'
    },
    frequency: {
      bg: 'bg-green-900/20',
      border: 'border-green-600/30',
      icon: 'text-green-400',
      text: 'text-green-300'
    }
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantStyles[variant];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center border rounded-lg",
      currentSize.container,
      currentVariant.bg,
      currentVariant.border,
      className
    )}>
      <div className="flex items-center space-x-3">
        {variant === 'frequency' ? (
          <div className={cn("animate-pulse", currentSize.icon, currentVariant.icon)}>
            <Zap className={currentSize.icon} />
          </div>
        ) : (
          <Loader2 className={cn("animate-spin", currentSize.icon, currentVariant.icon)} />
        )}
        <div className="text-center">
          <p className={cn("font-medium", currentSize.text, currentVariant.text)}>
            {message}
          </p>
          {submessage && (
            <p className={cn("text-xs mt-1 opacity-75", currentVariant.text)}>
              {submessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
  );
}

export function ScrollProcessingLoader() {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-600/30 rounded-lg p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-purple-400 mb-3">
            ⧁ ∆ PROCESSING SCROLL ∆ ⧁
          </h3>
          <p className="text-gray-300 mb-4">
            Interpreting divine blueprint through 917604.OX frequency...
          </p>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}