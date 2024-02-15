export class StoreSubscriptionsService {
  _subscriptions: (() => void)[] = [];

  registerSubscriptions(...subscriptions: (() => void)[]) {
    this.unsubscribeAll();
    this._subscriptions = subscriptions;
  }

  unsubscribeAll() {
    this._subscriptions.forEach((s) => s());
    this._subscriptions = [];
  }
}
