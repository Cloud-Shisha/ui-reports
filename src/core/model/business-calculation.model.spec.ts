import { BusinessCalculationModel } from './business-calculation.model';
import { ScheduleModel } from './schedule.model';
import { DateTime } from 'luxon';
import { earningsRanges } from '../../data';
import {EarningsRangesModel} from "./earnings-ranges.model";

describe('BusinessCalculationModel', () => {
  let businessCalculationModel: BusinessCalculationModel;
  let scheduleModel: ScheduleModel;

  beforeEach(() => {
    scheduleModel = new ScheduleModel();
    scheduleModel.today = DateTime.fromISO("2023-11-22T13:30:00.000Z");
    scheduleModel.init();
    const earningsRangesModel = new EarningsRangesModel();
    earningsRangesModel.setScheduleModel(scheduleModel);
    businessCalculationModel = new BusinessCalculationModel([], earningsRangesModel);
  });

  it('should calculate profit correctly', () => {
    const amount = 1000;
    const percentage = 10;
    const expectedProfit = +((amount * (percentage / 100)) / BusinessCalculationModel.percentageOfProfit).toPrecision(2);
    const actualProfit = BusinessCalculationModel.calculateProfit(amount, percentage);
    expect(actualProfit).toBeCloseTo(expectedProfit, 2);
  });

  it('should initialize steps of earnings correctly', () => {
    const amount = 500;
    businessCalculationModel.initStepsOfEarnings(amount);
    const expectedSteps = earningsRanges.map(earningRange => ({
      ...earningRange,
      achieved: amount >= earningRange.start && amount <= earningRange.end,
    }));
    expect(businessCalculationModel.achievedEarningSteps).toEqual(expectedSteps);
  });

  it('should return next earning step after passed', () => {
    const amount = 500;
    businessCalculationModel.initStepsOfEarnings(amount);
    const expectedNextStep = earningsRanges.find(earningRange => amount < earningRange.start && amount < earningRange.end);
    const actualNextStep = businessCalculationModel.getNextEarningsStepAfterPassed();
    expect(actualNextStep?.start).toEqual(expectedNextStep?.start);
  });

  it('should return true if some earning step is achieved', () => {
    const amount = 2000;
    businessCalculationModel.initStepsOfEarnings(amount);
    const isSomeStepAchieved = businessCalculationModel.someEarningStepIsAchieved();
    expect(isSomeStepAchieved).toBe(true);
  });

  it('should return false if no earning step is achieved', () => {
    const amount = 0;
    businessCalculationModel.initStepsOfEarnings(amount);
    const isSomeStepAchieved = businessCalculationModel.someEarningStepIsAchieved();
    expect(isSomeStepAchieved).toBe(false);
  });
});
