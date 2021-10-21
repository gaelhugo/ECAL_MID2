export default class EventEmitter {
  constructor() {
    this._events = {};
  }
  addEventListener(eventName, callback) {
    const events = this._events;
    const callbacks = (events[eventName] = events[eventName] || []);
    callbacks.push(callback);
  }
  emit(eventName, args) {
    const callbacks = this._events[eventName];
    if (callbacks) {
      callbacks.forEach((callback, index) => {
        callback.apply(null, args);
      });
    }
  }
  removeEventListener(eventName) {
    delete this._events[eventName];
  }
}
