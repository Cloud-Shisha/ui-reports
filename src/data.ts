import {WeekdaysEnum} from "./weekdays.enum";

export const schedule = {
  [WeekdaysEnum.Monday]: {
    start: "12:00",
    end: "01:00",
  },
  [WeekdaysEnum.Tuesday]: {
    start: "12:00",
    end: "01:00",
  },
  [WeekdaysEnum.Wednesday]: {
    start: "12:00",
    end: "01:00",
  },
  [WeekdaysEnum.Thursday]: {
    start: "12:00",
    end: "01:00",
  },
  [WeekdaysEnum.Friday]: {
    start: "12:00",
    end: "03:00",
  },
  [WeekdaysEnum.Saturday]: {
    start: "14:00",
    end: "03:00",
  },
  [WeekdaysEnum.Sunday]: {
    start: "14:00",
    end: "01:00",
  }
};

export const percentageOfProfit = 5.5;
export const scheduleConfiguration = {
  [WeekdaysEnum.Friday]: {
    upEndEarningsInTimes: 2, // earningsRanges[0].end * scheduleConfiguration[WeekdaysEnum.Friday].upEndEarningsInTimes (1849 * 2 = 3698)
  },
  [WeekdaysEnum.Saturday]: {
    upEndEarningsInTimes: 2,
  }
};

export type earningStep = {
  start: number;
  end: number;
  percentage: number;
};
export const earningsRanges: earningStep[] = [
  // {
  //   start: 0,
  //   end: 1849,
  //   percentage: 0,
  // },
  {
    start: 0,
    end: 899,
    percentage: 0,
  },
  {
    start: 900,
    end: 1849,
    percentage: 0.2,
  },
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
