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

  private initScheduleConfiguration() {
    if (!this.scheduleDate) {
      console.error("scheduleDate is not defined");
      return this;
    }
    const weekdayLong = this.scheduleDate.weekdayLong;
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
    const weekdayLong = this.scheduleDate.weekdayLong;
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
    const weekdayLong = this.scheduleDate.plus({day: 1}).weekdayLong;
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

    const weekdayLong = this.today.weekdayLong;
    // Find schedule by weekday
    const schedule = schedules.find((schedule) => schedule.weekdayName === weekdayLong);

    // Check if found schedule is valid
    if (!schedule) {
      this.scheduleDidNotFound = true;
      return this;
    }

    const start = this.today.startOf('day').plus({
      hours: DateTime.fromISO(schedule.start).hour,
      minutes: DateTime.fromISO(schedule.start).minute,
    });
    const end = this.today.startOf('day').plus({
      hours: DateTime.fromISO(schedule.end).hour,
      minutes: DateTime.fromISO(schedule.end).minute,
    });

    // Check if schedule is valid for today
    if (start > this.today) {
      // If not, use previous schedule
      this.scheduleDate = this.today.minus({days: 1});
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


}
