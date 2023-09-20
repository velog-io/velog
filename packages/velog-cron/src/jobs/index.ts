export class JobProgressManager {
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
