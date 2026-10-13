type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    
    // En desarrollo siempre imprimimos
    if (process.env.NODE_ENV !== 'production') {
      if (meta) {
        console[level](formattedMessage, meta);
      } else {
        console[level](formattedMessage);
      }
    } else {
      // En producción, solo error/warn, o mandar a un servicio externo como Sentry/Datadog
      if (level === 'error' || level === 'warn') {
        if (meta) {
          console[level](formattedMessage, meta);
        } else {
          console[level](formattedMessage);
        }
        // TODO: integrate with external logging service
      }
    }
  }

  info(message: string, meta?: any) { this.log('info', message, meta); }
  warn(message: string, meta?: any) { this.log('warn', message, meta); }
  error(message: string, meta?: any) { this.log('error', message, meta); }
  debug(message: string, meta?: any) { this.log('debug', message, meta); }
}

export const logger = new Logger();
