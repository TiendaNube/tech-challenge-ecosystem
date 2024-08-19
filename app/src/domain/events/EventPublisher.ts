export interface EventListener {
  handle(event: DomainEvent): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DomainEvent {}

export interface EventPublisher {
  publish(event: DomainEvent): void;
  register(listener: EventListener): void;
}
