import {WeekdaysEnum} from "./weekdays.enum";
import {IEarningStep} from "./interface/i.earning-step";
import {ISchedule, IScheduleConfiguration, IScheduleConfigurationByWeekday} from "./interface/i.schedule";

export const schedules: ISchedule[] = [
  {
    weekdayName: WeekdaysEnum.Monday,
    start: "12:00",
    end: "01:00",
  },
  {
    weekdayName: WeekdaysEnum.Tuesday,
    start: "12:00",
    end: "01:00",
  },
  {
    weekdayName: WeekdaysEnum.Wednesday,
    start: "12:00",
    end: "01:00",
  },
  {
    weekdayName: WeekdaysEnum.Thursday,
    start: "12:00",
    end: "01:00",
  },
  {
    weekdayName: WeekdaysEnum.Friday,
    start: "12:00",
    end: "03:00",
  },
  {
    weekdayName: WeekdaysEnum.Saturday,
    start: "14:00",
    end: "03:00",
  },
  {
    weekdayName: WeekdaysEnum.Sunday,
    start: "14:00",
    end: "01:00",
  }
];


export const scheduleConfigurations: IScheduleConfigurationByWeekday = {
  [WeekdaysEnum.Monday]: {
    upEarningsInTimes: 1,
  },
  [WeekdaysEnum.Tuesday]: {
    upEarningsInTimes: 1,
  },
  [WeekdaysEnum.Wednesday]: {
    upEarningsInTimes: 1,
  },
  [WeekdaysEnum.Thursday]: {
    upEarningsInTimes: 1,
  },
  [WeekdaysEnum.Friday]: {
    upEarningsInTimes: 2, // earningsRanges[0].end * scheduleConfiguration[WeekdaysEnum.Friday].upEndEarningsInTimes (1849 * 2 = 3698)
  },
  [WeekdaysEnum.Saturday]: {
    upEarningsInTimes: 2,
  },
  [WeekdaysEnum.Sunday]: {
    upEarningsInTimes: 1,
  },
};


export const earningsRanges: IEarningStep[] = [
  // {
  //   start: 0,
  //   end: 1849,
  //   percentage: 0,
  // },
  {
    start: 1850,
    end: 2099,
    percentage: 0.3,
  },
  {
    start: 2100,
    end: 2399,
    percentage: 0.5,
  },
  {
    start: 2400,
    end: 2799,
    percentage: 0.8,
  },
  {
    start: 2800,
    end: 3099,
    percentage: 1,
  },
  {
    start: 3100,
    end: 3399,
    percentage: 1.4,
  },
  {
    start: 3400,
    end: 3999,
    percentage: 1.7,
  },
  {
    start: 4000,
    end: 4599,
    percentage: 2,
  },
  {
    start: 4600,
    end: 5499,
    percentage: 2.3,
  },
  {
    start: 5500,
    end: 6599,
    percentage: 2.7,
  },
  {
    start: 6600,
    end: Infinity,
    percentage: 3,
  },
];
