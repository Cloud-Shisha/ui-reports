import {DateTime} from "luxon";
import {scheduleConfigurations, schedules} from "../../data";
import {ISchedule, IScheduleConfiguration} from "../../interface/i.schedule";
import {WeekdaysEnum} from "../../weekdays.enum";

export class ScheduleModel {

  public today = DateTime.now();
  public scheduleDidNotFound = false;
  public scheduleDate!: DateTime;
  public currentSchedule!: ISchedule;
  public nextSchedule!: ISchedule;
  public scheduleConfiguration!: IScheduleConfiguration;

  public constructor() {
    this.init();
  }

  public setToday(today: DateTime) {
    this.today = today;
    return this;
  }

  public init() {
    this.initScheduleDate().initSchedule().initNextSchedule().initScheduleConfiguration();
  }

  public get currentScheduleIsFromYesterday() {
    if (!this.scheduleDate) {
      console.error("scheduleDate is not defined");
      return false;
    }
    return this.scheduleDate.hasSame(this.today.minus({days: 1}), "day");
  }

  public get isScheduleStillValid() {
    if (!this.scheduleDate) {
      console.error("isScheduleStillValid:scheduleDate is not defined");
      return false;
    }
    if (!this.currentSchedule) {
      console.error("isScheduleStillValid:currentSchedule is not defined");
      return false;
    }

    const {start, end} = this.getScheduleStartAndEnd(this.scheduleDate, this.currentSchedule);
    return this.scheduleDate >= start && this.scheduleDate <= end;
  }

  private initScheduleConfiguration() {
    if (!this.scheduleDate) {
      console.error("scheduleDate is not defined");
      return this;
    }
    const weekdayLong = this.scheduleDate.setLocale('en').weekdayLong;
    if (!weekdayLong) {
      console.error("weekdayLong is not defined");
      return this;
    }
    // Find schedule by weekday
    const scheduleConfiguration = scheduleConfigurations[weekdayLong as WeekdaysEnum];
    // Check if found schedule is valid
    if (!scheduleConfiguration) {
      console.warn("scheduleConfiguration is not defined");
      return this;
    }
    this.scheduleConfiguration = scheduleConfiguration;
    return this;
  }

  private initSchedule() {
    if (!this.scheduleDate) {
      console.error("scheduleDate is not defined");
      return this;
    }
    if (this.scheduleDidNotFound) {
      console.error("scheduleDidNotFound is true");
      return this;
    }
    const weekdayLong = this.scheduleDate.setLocale('en').weekdayLong;
    const schedule = schedules.find((schedule) => schedule.weekdayName === weekdayLong);
    if (!schedule) {
      console.error("schedule is not defined");
      return this;
    }
    this.currentSchedule = schedule;
    return this;
  }

  private initNextSchedule() {
    // init next schedule

    if (!this.scheduleDate) {
      console.error("scheduleDate is not defined");
      return this;
    }
    if (this.scheduleDidNotFound) {
      console.error("scheduleDidNotFound is true");
      return this;
    }
    const weekdayLong = this.scheduleDate.plus({day: 1}).setLocale('en').weekdayLong;
    const schedule = schedules.find((schedule) => schedule.weekdayName === weekdayLong);
    if (!schedule) {
      console.error("schedule is not defined");
      return this;
    }
    this.nextSchedule = schedule;
    return this;
  }

  /**
   * Detect which scheduleDate should be used by schedules from data.ts
   * @private
   */
  private initScheduleDate() {
    // Check if today is future
    if (this.today > DateTime.now()) {
      this.scheduleDidNotFound = true;
      return this;
    }

    const weekdayLong = this.today.setLocale('en').weekdayLong;
    // Find schedule by weekday
    const schedule = schedules.find((schedule) => schedule.weekdayName === weekdayLong);

    // Check if found schedule is valid
    if (!schedule) {
      this.scheduleDidNotFound = true;
      return this;
    }

    const {start, end} = this.getScheduleStartAndEnd(this.today, schedule);

    // Check if schedule is valid for today
    if (start > this.today) {
      // Get previous schedule
      const yesterday = this.today.minus({days: 1});
      const previousSchedule = schedules.find((schedule) => schedule.weekdayName === yesterday.setLocale('en').weekdayLong);
      if (!previousSchedule) {
        this.scheduleDidNotFound = true;
        return this;
      }
      // Check if previous schedule is valid for today
      const {start, end} = this.getScheduleStartAndEnd(yesterday, previousSchedule);
      this.scheduleDate = start;
      return this;
    }

    if (end < this.today) {
      this.scheduleDidNotFound = true;
      return this;
    }
    // If yes, use today schedule
    this.scheduleDate = this.today;
    return this;
  }

  private getScheduleStartAndEnd(scheduleDate: DateTime, schedule: ISchedule,) {

    const start = scheduleDate.startOf('day').plus({
      hours: DateTime.fromISO(schedule.start).hour,
      minutes: DateTime.fromISO(schedule.start).minute,
    });

    let end = scheduleDate.startOf('day').plus({
      hours: DateTime.fromISO(schedule.end).hour,
      minutes: DateTime.fromISO(schedule.end).minute,
    });

    if (start > end) {
      end = end.plus({days: 1});
    }

    return {start, end};

  }


}
