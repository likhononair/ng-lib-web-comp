import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelloWorldWebComponent, ActionEvent } from './hello-world-web-component';
import { LoggerService } from './logger.service';

describe('HelloWorldWebComponent', () => {
  let component: HelloWorldWebComponent;
  let fixture: ComponentFixture<HelloWorldWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelloWorldWebComponent],
      providers: [LoggerService],
    }).compileComponents();

    fixture = TestBed.createComponent(HelloWorldWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title', () => {
    expect(component.title()).toBe('Hello World Component');
  });

  it('should have default message', () => {
    expect(component.message()).toBe('This is an Angular web component!');
  });

  it('should initialize counter to 0 by default', () => {
    expect(component.counter()).toBe(0);
  });

  it('should increment counter', () => {
    component.increment();
    expect(component.counter()).toBe(1);
  });

  it('should decrement counter', () => {
    component.counter.set(5);
    component.decrement();
    expect(component.counter()).toBe(4);
  });

  it('should not decrement below minValue', () => {
    component.counter.set(0);
    component.decrement();
    expect(component.counter()).toBe(0);
  });

  it('should not increment above maxValue', () => {
    component.counter.set(100);
    component.increment();
    expect(component.counter()).toBe(100);
  });

  it('should reset counter to initial value', () => {
    component.counter.set(50);
    component.reset();
    expect(component.counter()).toBe(0);
  });

  it('should emit actionTriggered event on increment', () => {
    let emittedEvent: ActionEvent | null = null;
    component.actionTriggered.subscribe((event) => {
      emittedEvent = event;
    });

    component.increment();

    expect(emittedEvent).toBeTruthy();
    expect(emittedEvent!.type).toBe('increment');
    expect(emittedEvent!.value).toBe(1);
  });

  it('should emit counterChanged event on decrement', () => {
    let emittedValue: number | null = null;
    component.counter.set(5);
    component.counterChanged.subscribe((value) => {
      emittedValue = value;
    });

    component.decrement();

    expect(emittedValue).toBe(4);
  });

  it('should compute doubled counter correctly', () => {
    component.counter.set(5);
    expect(component.doubledCounter()).toBe(10);
  });

  it('should detect when max is reached', () => {
    component.counter.set(100);
    expect(component.isMaxReached()).toBe(true);
  });

  it('should detect when min is reached', () => {
    component.counter.set(0);
    expect(component.isMinReached()).toBe(true);
  });

  it('should allow setting counter via setCounter method', () => {
    component.setCounter(42);
    expect(component.counter()).toBe(42);
  });

  it('should clamp setCounter value to min/max range', () => {
    component.setCounter(150);
    expect(component.counter()).toBe(100);

    component.setCounter(-10);
    expect(component.counter()).toBe(0);
  });

  it('should return counter value via getCounter method', () => {
    component.counter.set(25);
    expect(component.getCounter()).toBe(25);
  });

  it('should emit custom action event', () => {
    let emittedEvent: ActionEvent | null = null;
    component.actionTriggered.subscribe((event) => {
      emittedEvent = event;
    });

    component.triggerCustomAction();

    expect(emittedEvent).toBeTruthy();
    expect(emittedEvent!.type).toBe('custom');
    expect(emittedEvent!.message).toBe('Custom action triggered by user');
  });
});
