type Listener = () => void;

class SimpleEventEmitter {
  private listeners: Map<string, Set<Listener>> = new Map();

  on(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: string, listener: Listener): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit(event: string): void {
    this.listeners.get(event)?.forEach((listener) => listener());
  }
}

export const AUTH_EVENTS = {
  REVOKED: "auth:revoked",
  REFRESHED: "auth:refreshed",
} as const;

export type AuthEventType = (typeof AUTH_EVENTS)[keyof typeof AUTH_EVENTS];

export const authEvents = new SimpleEventEmitter();
