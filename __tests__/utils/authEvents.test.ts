import { authEvents, AUTH_EVENTS } from "@/utils/authEvents";

describe("authEvents (SimpleEventEmitter)", () => {
  afterEach(() => {
    // Clean up all listeners to avoid leaking between tests
    authEvents.off(AUTH_EVENTS.REVOKED, () => {});
  });

  it("calls listener when event is emitted", () => {
    const listener = jest.fn();
    authEvents.on(AUTH_EVENTS.REVOKED, listener);

    authEvents.emit(AUTH_EVENTS.REVOKED);

    expect(listener).toHaveBeenCalledTimes(1);

    authEvents.off(AUTH_EVENTS.REVOKED, listener);
  });

  it("supports multiple listeners for the same event", () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    authEvents.on(AUTH_EVENTS.REVOKED, listener1);
    authEvents.on(AUTH_EVENTS.REVOKED, listener2);

    authEvents.emit(AUTH_EVENTS.REVOKED);

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);

    authEvents.off(AUTH_EVENTS.REVOKED, listener1);
    authEvents.off(AUTH_EVENTS.REVOKED, listener2);
  });

  it("removes listener with off()", () => {
    const listener = jest.fn();
    authEvents.on(AUTH_EVENTS.REVOKED, listener);
    authEvents.off(AUTH_EVENTS.REVOKED, listener);

    authEvents.emit(AUTH_EVENTS.REVOKED);

    expect(listener).not.toHaveBeenCalled();
  });

  it("does not call listeners for different events", () => {
    const listener = jest.fn();
    authEvents.on(AUTH_EVENTS.REFRESHED, listener);

    authEvents.emit(AUTH_EVENTS.REVOKED);

    expect(listener).not.toHaveBeenCalled();

    authEvents.off(AUTH_EVENTS.REFRESHED, listener);
  });

  it("does not throw when emitting event with no listeners", () => {
    expect(() => authEvents.emit("nonexistent")).not.toThrow();
  });

  it("does not throw when removing listener from event with no listeners", () => {
    const listener = jest.fn();
    expect(() => authEvents.off("nonexistent", listener)).not.toThrow();
  });

  it("handles multiple emits", () => {
    const listener = jest.fn();
    authEvents.on(AUTH_EVENTS.REVOKED, listener);

    authEvents.emit(AUTH_EVENTS.REVOKED);
    authEvents.emit(AUTH_EVENTS.REVOKED);
    authEvents.emit(AUTH_EVENTS.REVOKED);

    expect(listener).toHaveBeenCalledTimes(3);

    authEvents.off(AUTH_EVENTS.REVOKED, listener);
  });

  it("exports correct event constants", () => {
    expect(AUTH_EVENTS.REVOKED).toBe("auth:revoked");
    expect(AUTH_EVENTS.REFRESHED).toBe("auth:refreshed");
  });
});
