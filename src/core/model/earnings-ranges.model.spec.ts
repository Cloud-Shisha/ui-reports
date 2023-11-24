import {EarningsRangesModel} from './earnings-ranges.model';
import {ScheduleModel} from './schedule.model';
import {DateTime} from 'luxon';
import {earningsRanges} from '../../data';

describe('EarningsRangesModel', () => {
  let earningsRangesModel: EarningsRangesModel;
  let scheduleModel: ScheduleModel;

  beforeEach(() => {
    earningsRangesModel = new EarningsRangesModel();
    scheduleModel = new ScheduleModel();
    scheduleModel.today = DateTime.fromISO("2023-11-24T13:30:00.000Z");
    scheduleModel.init();
    earningsRangesModel.setScheduleModel(scheduleModel);
  });

  it('should initialize collection with correct earning steps when scheduleModel is defined', () => {
    earningsRangesModel.initCollection();
    const scheduleConfiguration = scheduleModel.scheduleConfiguration;
    const upEarningsInTimes = scheduleConfiguration?.upEarningsInTimes;
    const expectedCollection = earningsRanges.sort((a, b) => a.start - b.start).map(earningRange => ({
      ...earningRange,
      start: earningRange.start * upEarningsInTimes,
      end: earningRange.end * upEarningsInTimes,
    }));
    expect(earningsRangesModel.collection).toEqual(expectedCollection);
  });

  it('should not initialize collection if scheduleModel is not defined', () => {
    // @ts-ignore
    earningsRangesModel.setScheduleModel(undefined);
    earningsRangesModel.initCollection();
    expect(earningsRangesModel.collection.length).toBe(0);
  });

  it('should not initialize collection if scheduleConfiguration or schedule is not defined', () => {
    // @ts-ignore
    scheduleModel.currentSchedule = undefined;
    earningsRangesModel.initCollection();
    expect(earningsRangesModel.collection.length).toBe(0);
  });

  it('should initialize collection with correct earning steps when upEarningsInTimes is zero', () => {
    scheduleModel.scheduleConfiguration.upEarningsInTimes = 0;
    earningsRangesModel.initCollection();
    const expectedCollection = earningsRanges.sort((a, b) => a.start - b.start).map((earningRange, index) => ({
      ...earningRange,
      start: 0,
      // At least one of the values should be infinity
      end: earningsRanges.length - 1 === index ? Infinity : 0,
    }));
    expect(earningsRangesModel.collection).toEqual(expectedCollection);
  });
});
