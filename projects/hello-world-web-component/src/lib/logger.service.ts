import { Injectable } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  component: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly prefix = '[HelloWorldWebComponent]';
  private logHistory: LogEntry[] = [];
  private enabled = true;

  /**
   * Enable or disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Log a debug message
   */
  debug(component: string, message: string): void {
    this.logMessage('debug', component, message);
  }

  /**
   * Log an info message
   */
  log(component: string, message: string): void {
    this.logMessage('info', component, message);
  }

  /**
   * Log a warning message
   */
  warn(component: string, message: string): void {
    this.logMessage('warn', component, message);
  }

  /**
   * Log an error message
   */
  error(component: string, message: string): void {
    this.logMessage('error', component, message);
  }

  /**
   * Get all logged entries
   */
  getLogHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  /**
   * Clear log history
   */
  clearLogHistory(): void {
    this.logHistory = [];
  }

  private logMessage(level: LogLevel, component: string, message: string): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      component,
      message,
    };

    this.logHistory.push(entry);

    if (!this.enabled) {
      return;
    }

    const timestamp = entry.timestamp.toISOString();
    const formattedMessage = `${this.prefix} [${timestamp}] [${level.toUpperCase()}] [${component}] ${message}`;

    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }
}

