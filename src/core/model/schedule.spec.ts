import { ScheduleModel } from './schedule.model';
import { DateTime } from 'luxon';
import { WeekdaysEnum } from '../../weekdays.enum';
import { schedules, scheduleConfigurations } from '../../data';

describe('ScheduleModel', () => {
  let scheduleModel: ScheduleModel;

  beforeEach(() => {
    scheduleModel = new ScheduleModel();
    scheduleModel
      .setToday(DateTime.fromISO("2023-11-24T13:30:00.000Z"))
      .init()
  });

  it('should set scheduleDidNotFound to true if no schedule is found', () => {
    const weekdayLong = scheduleModel.today.weekdayLong;
    const schedule = schedules.find((schedule) => schedule.weekdayName === weekdayLong);
    if (!schedule) {
      expect(scheduleModel.scheduleDidNotFound).toBe(true);
    }
  });

  it('should set scheduleDidNotFound to true if schedule end time has passed', () => {
    // update today to be after schedule end time
    scheduleModel
      .setToday(DateTime.fromISO("2023-11-25T23:30:00.000Z"))
      .init();
    expect(scheduleModel.scheduleDidNotFound).toBe(true);
  });

  it('should set scheduleDate to yesterday if today\'s schedule has not started yet', () => {
    scheduleModel.setToday(DateTime.fromISO("2023-11-24T00:30:00.000Z")).init();
    expect(scheduleModel.scheduleDate.hasSame(scheduleModel.today.minus({days: 1}), 'day')).toBe(true);
  });

  it('should set scheduleDate to today if today\'s schedule is ongoing', () => {
    const weekdayLong = scheduleModel.today.weekdayLong;
    const schedule = schedules.find((schedule) => schedule.weekdayName === weekdayLong);
    if (schedule && schedule.start <= scheduleModel.today.toFormat("HH:mm") && schedule.end >= scheduleModel.today.toFormat("HH:mm")) {
      expect(scheduleModel.scheduleDate.hasSame(scheduleModel.today, 'minute')).toBe(true);
    }
  });

  it('should initialize currentSchedule with the correct schedule', () => {
    const weekdayLong = scheduleModel.scheduleDate.weekdayLong;
    const schedule = schedules.find((schedule) => schedule.weekdayName === weekdayLong);
    expect(scheduleModel.currentSchedule).toEqual(schedule);
  });

  it('should initialize scheduleConfiguration with the correct configuration', () => {
    const weekdayLong = scheduleModel.scheduleDate.weekdayLong;
    const scheduleConfiguration = scheduleConfigurations[weekdayLong as WeekdaysEnum];
    expect(scheduleModel.scheduleConfiguration).toEqual(scheduleConfiguration);
  });

  // Add more test cases here
});
