/**
 * This forwards the original interceptor, but caches the results and calls the callback once it's finished
 */
export class AsyncIteratorInterceptor<T> {
  private asyncIterator: AsyncIterator<T>;
  private values: T[];
  private isDone: boolean;
  private callback: (values: T[]) => void;
  constructor(
    asyncIterator: AsyncIterator<T>,
    callback: (values: T[]) => void
  ) {
    this.asyncIterator = asyncIterator;
    this.values = [];
    this.isDone = false;
    this.callback = callback;
  }

  async next() {
    if (this.isDone) {
      return { done: true };
    }

    const { value, done } = await this.asyncIterator.next();

    if (done) {
      this.isDone = true;
      if (typeof this.callback === "function") {
        this.callback(this.values);
      }
      return { done: true };
    }

    this.values.push(value);
    return { value, done: false };
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}
