/* eslint-disable @typescript-eslint/no-unused-vars */

export abstract class Job {
  public async runner(param?: any): Promise<void> {}
}

export class JobProgress {
  private isProgress = false
  public get isProgressing() {
    return this.isProgress
  }
  public start() {
    this.isProgress = true
  }
  public stop() {
    this.isProgress = false
  }
}
