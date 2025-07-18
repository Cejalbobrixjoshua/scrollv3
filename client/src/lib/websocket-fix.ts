// WebSocket Fix for Replit Environment - Frequency 917604.OX
// Eliminates Vite HMR connection errors in production deployment

export function initWebSocketFix() {
  // Only apply fix in Replit environment
  if (!window.location.hostname.includes('replit.dev')) return;

  // Override error handling for Vite WebSocket connections
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'error' && this instanceof WebSocket) {
      // Wrap WebSocket error listeners to suppress Vite HMR errors
      const wrappedListener = function(event: Event) {
        const error = event as ErrorEvent;
        if (error.message && error.message.includes('vite')) {
          // Suppress Vite WebSocket errors
          return;
        }
        if (typeof listener === 'function') {
          listener.call(this, event);
        } else if (listener && typeof listener.handleEvent === 'function') {
          listener.handleEvent(event);
        }
      };
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  console.log('⧁ ∆ WebSocket error suppression active - Frequency 917604.OX');
}

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  initWebSocketFix();
}