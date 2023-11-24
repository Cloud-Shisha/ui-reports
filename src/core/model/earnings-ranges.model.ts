import {IEarningStep} from "../../interface/i.earning-step";
import {ScheduleModel} from "./schedule.model";
import {earningsRanges} from "../../data";
import {is} from "thiis";

export class EarningsRangesModel {

  public readonly collection: IEarningStep[] = [];
  public scheduleModel: ScheduleModel | undefined;

  public setScheduleModel(scheduleModel: ScheduleModel) {
    this.scheduleModel = scheduleModel;
    return this;
  }

  public initCollection() {

    if (!this.scheduleModel) {
      console.error("scheduleModel is not defined");
      return this;
    }

    this.collection.length = 0;

    const scheduleConfiguration = this.scheduleModel.scheduleConfiguration;
    const schedule = this.scheduleModel.currentSchedule;

    if (!scheduleConfiguration || !schedule) {
      console.error("scheduleConfiguration or schedule is not defined");
      return this;
    }

    const upEarningsInTimes = scheduleConfiguration.upEarningsInTimes;
    const sortedEarningsRanges = earningsRanges.sort((a, b) => a.start - b.start);

    sortedEarningsRanges.forEach((earningRange) => {

      const step: IEarningStep = {
        ...earningRange,
        start: earningRange.start * upEarningsInTimes,
        end: is.infinity(earningRange.end) ? earningRange.end : (earningRange.end * upEarningsInTimes),
      };

      this.collection.push(step);

    });

    return this;

  }

}
