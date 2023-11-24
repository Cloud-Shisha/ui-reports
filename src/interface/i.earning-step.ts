export interface IEarningStep {
  start: number;
  end: number;
  percentage: number;
}

export interface IAchievedEarningStep extends IEarningStep {
  achieved: boolean;
}
