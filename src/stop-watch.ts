/** @internal */
export class StopWatch {
  static start(name: string) {
    return new StopWatch(name);
  }

  private readonly start: number;
  private readonly name: string;

  constructor(name: string) {
    this.start = Date.now();
    this.name = name;
    console.log(`${this.name} starting`);
  }

  report(section?: string) {
    const timing = Date.now() - this.start;
    console.log(`${this.name} ${section ?? 'done'} @ ${timing} ms`);
  }
}