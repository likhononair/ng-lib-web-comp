import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { LoggerService } from './logger.service';

/**
 * Event payload emitted when an action is triggered
 */
export interface ActionEvent {
  type: 'increment' | 'decrement' | 'reset' | 'custom';
  value: number;
  timestamp: Date;
  message?: string;
}

@Component({
  selector: 'lib-hello-world-web-component',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hello-world-container">
      <h2 class="title">{{ title() }}</h2>
      <p class="message">{{ message() }}</p>

      <div class="counter-section">
        <span class="counter-label">Counter:</span>
        <span class="counter-value">{{ counter() }}</span>
        <span class="counter-doubled">(doubled: {{ doubledCounter() }})</span>
      </div>

      <div class="button-group">
        <button
          class="btn btn-primary"
          (click)="increment()"
          [disabled]="isMaxReached()">
          + Increment
        </button>
        <button
          class="btn btn-secondary"
          (click)="decrement()"
          [disabled]="isMinReached()">
          - Decrement
        </button>
        <button
          class="btn btn-warning"
          (click)="reset()">
          ↺ Reset
        </button>
        <button
          class="btn btn-info"
          (click)="triggerCustomAction()">
          ⚡ Custom Action
        </button>
      </div>

      <div class="info-section">
        <p>Min: {{ minValue() }} | Max: {{ maxValue() }} | Step: {{ step() }}</p>
      </div>
    </div>
  `,
  styles: `
    .hello-world-container {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      max-width: 400px;
      background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
    }

    .title {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 1.5rem;
    }

    .message {
      color: #666;
      margin-bottom: 20px;
    }

    .counter-section {
      font-size: 1.2rem;
      margin-bottom: 20px;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .counter-label {
      font-weight: 500;
      margin-right: 10px;
    }

    .counter-value {
      font-weight: bold;
      font-size: 1.5rem;
      color: #667eea;
    }

    .counter-doubled {
      color: #999;
      font-size: 0.9rem;
      margin-left: 10px;
    }

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 15px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-secondary {
      background: #764ba2;
      color: white;
    }

    .btn-warning {
      background: #f6ad55;
      color: white;
    }

    .btn-info {
      background: #48bb78;
      color: white;
    }

    .info-section {
      font-size: 0.85rem;
      color: #888;
      text-align: center;
    }
  `,
  providers: [LoggerService],
})
export class HelloWorldWebComponent implements OnInit, OnDestroy {
  // Input signals with defaults
  readonly title = input<string>('Hello World Component');
  readonly message = input<string>('This is an Angular web component!');
  readonly initialValue = input<number>(0);
  readonly minValue = input<number>(0);
  readonly maxValue = input<number>(100);
  readonly step = input<number>(1);

  // Output events
  readonly actionTriggered = output<ActionEvent>();
  readonly counterChanged = output<number>();

  // Internal state using signals
  readonly counter = signal<number>(0);

  // Computed values
  readonly doubledCounter = computed(() => this.counter() * 2);
  readonly isMaxReached = computed(() => this.counter() >= this.maxValue());
  readonly isMinReached = computed(() => this.counter() <= this.minValue());

  constructor(private readonly logger: LoggerService) {
    this.logger.log('HelloWorldWebComponent', 'Constructor called');

    // Effect to log counter changes
    effect(() => {
      const value = this.counter();
      this.logger.log('HelloWorldWebComponent', `Counter changed to: ${value}`);
    });

    // Effect to react to input changes
    effect(() => {
      const initial = this.initialValue();
      this.logger.log('HelloWorldWebComponent', `Initial value input changed to: ${initial}`);
    });
  }

  ngOnInit(): void {
    this.logger.log('HelloWorldWebComponent', 'ngOnInit - Initializing component');
    this.counter.set(this.initialValue());
    this.logger.log('HelloWorldWebComponent', `Counter initialized to: ${this.counter()}`);
  }

  ngOnDestroy(): void {
    this.logger.log('HelloWorldWebComponent', 'ngOnDestroy - Component destroyed');
  }

  /**
   * Increment the counter by step value
   */
  increment(): void {
    this.logger.log('HelloWorldWebComponent', 'increment() called');
    const newValue = Math.min(this.counter() + this.step(), this.maxValue());
    this.counter.set(newValue);
    this.emitAction('increment', newValue);
    this.counterChanged.emit(newValue);
  }

  /**
   * Decrement the counter by step value
   */
  decrement(): void {
    this.logger.log('HelloWorldWebComponent', 'decrement() called');
    const newValue = Math.max(this.counter() - this.step(), this.minValue());
    this.counter.set(newValue);
    this.emitAction('decrement', newValue);
    this.counterChanged.emit(newValue);
  }

  /**
   * Reset the counter to initial value
   */
  reset(): void {
    this.logger.log('HelloWorldWebComponent', 'reset() called');
    this.counter.set(this.initialValue());
    this.emitAction('reset', this.initialValue());
    this.counterChanged.emit(this.initialValue());
  }

  /**
   * Trigger a custom action event
   */
  triggerCustomAction(): void {
    this.logger.log('HelloWorldWebComponent', 'triggerCustomAction() called');
    this.emitAction('custom', this.counter(), 'Custom action triggered by user');
  }

  /**
   * Public method to set counter value from outside (for web component interop)
   */
  setCounter(value: number): void {
    this.logger.log('HelloWorldWebComponent', `setCounter() called with value: ${value}`);
    const clampedValue = Math.max(this.minValue(), Math.min(value, this.maxValue()));
    this.counter.set(clampedValue);
    this.counterChanged.emit(clampedValue);
  }

  /**
   * Public method to get current counter value
   */
  getCounter(): number {
    return this.counter();
  }

  private emitAction(type: ActionEvent['type'], value: number, message?: string): void {
    const event: ActionEvent = {
      type,
      value,
      timestamp: new Date(),
      message,
    };
    this.logger.log('HelloWorldWebComponent', `Emitting action event: ${JSON.stringify(event)}`);
    this.actionTriggered.emit(event);
  }
}
