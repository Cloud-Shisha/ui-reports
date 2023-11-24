import {WeekdaysEnum} from "../weekdays.enum";

export interface ISchedule {
  weekdayName: WeekdaysEnum,
  start: string,
  end: string,
}

export type IScheduleConfiguration = {
  upEarningsInTimes: number;
};

export type IScheduleConfigurationByWeekday = {
  [key in keyof typeof WeekdaysEnum]: IScheduleConfiguration;
};
