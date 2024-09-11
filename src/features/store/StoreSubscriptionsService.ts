export class StoreSubscriptionsService {
  _subscriptions: (() => void)[] = [];

  registerSubscriptions(...subscriptions: (() => void)[]) {
    this._subscriptions.push(...subscriptions);
  }

  unsubscribeAll() {
    this._subscriptions.forEach((s) => s());
    this._subscriptions = [];
  }
}
