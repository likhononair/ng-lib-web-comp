import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    service = new LoggerService();
    // Spy on console methods
    jest.spyOn(console, 'debug').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log debug messages', () => {
    service.debug('TestComponent', 'Debug message');
    expect(console.debug).toHaveBeenCalled();
  });

  it('should log info messages', () => {
    service.log('TestComponent', 'Info message');
    expect(console.info).toHaveBeenCalled();
  });

  it('should log warning messages', () => {
    service.warn('TestComponent', 'Warning message');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    service.error('TestComponent', 'Error message');
    expect(console.error).toHaveBeenCalled();
  });

  it('should store log history', () => {
    service.log('TestComponent', 'Test message');
    const history = service.getLogHistory();
    expect(history.length).toBe(1);
    expect(history[0].component).toBe('TestComponent');
    expect(history[0].message).toBe('Test message');
    expect(history[0].level).toBe('info');
  });

  it('should clear log history', () => {
    service.log('TestComponent', 'Test message');
    service.clearLogHistory();
    const history = service.getLogHistory();
    expect(history.length).toBe(0);
  });

  it('should not log when disabled', () => {
    service.setEnabled(false);
    service.log('TestComponent', 'Test message');
    expect(console.info).not.toHaveBeenCalled();
  });

  it('should still store history when disabled', () => {
    service.setEnabled(false);
    service.log('TestComponent', 'Test message');
    const history = service.getLogHistory();
    expect(history.length).toBe(1);
  });
});

