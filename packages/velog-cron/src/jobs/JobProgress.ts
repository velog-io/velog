/* eslint-disable @typescript-eslint/no-unused-vars */

export abstract class Job {
  public async run(param?: any): Promise<void> {}
}

export class JobProgress {
  private jobInProgress = false
  public get isJobProgressing() {
    return this.jobInProgress
  }
  public start() {
    this.jobInProgress = true
  }
  public stop() {
    this.jobInProgress = false
  }
}
