import {IAchievedEarningStep} from "../../interface/i.earning-step";
import {EarningsRangesModel} from "./earnings-ranges.model";
import {ScheduleModel} from "./schedule.model";

export class BusinessCalculationModel {

  public static readonly percentageOfProfit = 5.55;

  /**
   * 1963*(0.3/100)/5.55 = 1.06
   * ((виторг * процент від доходу)/100)/коефіцієнт додаткового доходу
   * @param amount
   * @param percentage
   */
  public static calculateProfit(amount: number, percentage: number): number {

    const specialistProfit = (amount * (percentage / 100));
    const profitInBusinessCurrency = specialistProfit / this.percentageOfProfit;
    const profitInBusinessCurrencyPrecision = (profitInBusinessCurrency).toPrecision(2);
    const profitOfEachSpecialist = +profitInBusinessCurrencyPrecision;
    return profitOfEachSpecialist;

  }

  public currentAmount = 0;

  public constructor(
    public readonly achievedEarningSteps: IAchievedEarningStep[] = [],
    public readonly earningsRangesModel = new EarningsRangesModel(),
  ) {
    this.earningsRangesModel
      .initCollection();
  }

  // Build list of earnings steps with status of achieved or not by amount
  public initStepsOfEarnings(amount: number) {

    this.currentAmount = amount;
    this.achievedEarningSteps.length = 0;

    this.earningsRangesModel.collection.forEach((earningRange) => {

      const step: IAchievedEarningStep = {
        ...earningRange,
        achieved: amount >= earningRange.start && amount <= earningRange.end,
      };

      this.achievedEarningSteps.push(step);

    });

    return this;

  }

  public getLastAchievedProfit() {
    const found = this.achievedEarningSteps
      .filter((step) => step.achieved)
      .pop();
    if (!found) {
      return 0;
    }
    return BusinessCalculationModel.calculateProfit(this.currentAmount, found.percentage);
  }

  public getFullEarningsStepsAchieved() {
    return this.achievedEarningSteps.every((step) => step.achieved);
  }

  public getNextEarningsStepAfterPassed() {
    return this.achievedEarningSteps.find((step) => !step.achieved);
  }

  public someEarningStepIsAchieved() {
    return this.achievedEarningSteps.some((step) => step.achieved);
  }

}
