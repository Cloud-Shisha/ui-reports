import {Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {initFlowbite} from "flowbite";
import {earningsRanges, earningStep, percentageOfProfit, scheduleConfiguration, schedules} from "../data";
import {WeekdaysEnum} from "../weekdays.enum";
import {CoreService} from "../core/service/core.service";
import {filter} from "rxjs";
import {is} from "thiis";
import {getRandomMotivationText} from "../motivates";
import {typeAndClearMessage} from "../tools";
import {EffectHelper} from "../helper/effect.helper";
import {ChartService} from "./component/chart/chart.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  encapsulation: ViewEncapsulation.None,
  providers: [
    ChartService
  ]
})
export class AppComponent implements OnInit {

  private readonly effectHelper = inject(EffectHelper);
  private readonly coreService = inject(CoreService);
  private readonly chartService = inject(ChartService);

  public readonly stepsOfEarnings: earningStep[] = [];
  public lastStepPassed = false;

  public today = new Date();
  public minusDays = 0;
  public weSeeYesterdayBecauseNewScheduleIsNotReady = false;
  public schedule = this.getSchedule();
  public nextSchedule = this.getSchedule(false);

  public readonly listOfAdditionalProfits: {
    amount: number;
    percentage: number;
    start: number;
    end: number;
  }[] = [
    // {
    //   amount: 36,
    //   percentage: 2,
    //   start: 0,
    //   end: 1849,
    // }
  ];

  constructor() {
    setTimeout(() => {
      window.location.reload();
    }, 12 * 60 * 60 * 1000);
    this.initMinusDays();
  }

  private initMinusDays() {
    this.schedule = this.getSchedule();
    const urlParams = new URLSearchParams(window.location.search);
    this.minusDays = +(urlParams.get('minusDays') || 0);
    if (!this.minusDays) {
      const scheduleIsFromYesterday = this.schedule.weekdayName !== this.today.toLocaleString("en", {weekday: "long"});
      this.minusDays = scheduleIsFromYesterday ? 1 : 0;
    }
    this.today = this.coreService.setMinusDays(this.minusDays);
    console.log("today:", this.today.toISOString());
  }


  public ngOnInit() {
    initFlowbite();
    this.coreService.initialize().then(() => {

      this.coreService.amount$.pipe(filter(is.number)).subscribe((amount) => {

        if (!this.chartService.initialized) {

          this.pushMotivationText();

        }

        this.initStepsOfEarnings();
        this.detectIfConfettiShouldBeShown(amount);
        this.chartService.amount$.next(amount);
        this.initMinusDays();

      });

    });

  }

  private pushMotivationText() {
    setTimeout(() => {

      typeAndClearMessage(getRandomMotivationText(), 70, 35, 600_000).then(() => {
        this.pushMotivationText();
      });

    }, 250);
  }

  private detectIfConfettiShouldBeShown(amount: number) {
    const prevProfit = this.listOfAdditionalProfits[0];
    this.listOfAdditionalProfits.length = 0;
    const lastPassedStepIndex = this.stepsOfEarnings.findIndex((step) => amount >= step.start && amount <= step.end);
    const step = this.stepsOfEarnings[lastPassedStepIndex];
    if (lastPassedStepIndex > -1 && step.percentage > 0) {
      this.listOfAdditionalProfits.push({
        // 1963*(0.3/100)/5.55 = 1.06
        // ((уторг * процент від дозоду)/100)/конфіціент додаткового дозоду
        amount: +((amount * (step.percentage / 100)) / percentageOfProfit).toFixed(2),
        ...step
      });
      this.chartService.nextStep = this.stepsOfEarnings[lastPassedStepIndex + 1];
      if (!this.chartService.nextStep) {
        this.chartService.nextStep = step;
        this.lastStepPassed = true;
      } else {
        this.lastStepPassed = false;
      }
      if (!prevProfit) {
        this.effectHelper.executeAsync();
      } else if (prevProfit.start !== step.start) {
        this.effectHelper.executeAsync();
      }
    }
  }

  private getSchedule(checkToday = true): {
    weekdayName: WeekdaysEnum;
    start: string;
    end: string;
  } {

    // Saturday 00:30 so we should see Friday schedule
    const scheduleIndex = schedules.findIndex((schedule) => {
      return schedule.weekdayName === this.today.toLocaleString("en", {weekday: "long"});
    });

    if (scheduleIndex === -1) {
      throw new Error("Schedule not found");
    }

    const schedule = schedules[scheduleIndex];

    if (checkToday) {
      const todayTIme = `${this.today.getHours().toString().padStart(2, '0')}:${this.today.getMinutes().toString()}`;
      if (schedule.start > todayTIme) {
        this.weSeeYesterdayBecauseNewScheduleIsNotReady = true;
        const prevScheduleIndex = scheduleIndex - 1;
        if (prevScheduleIndex === -1) {
          return schedules[schedules.length - 1];
        }
        return schedules[prevScheduleIndex];
      }
    }

    return schedule;
  }

  private initStepsOfEarnings() {

    const weekdayName = this.schedule.weekdayName as WeekdaysEnum.Friday | WeekdaysEnum.Saturday;

    this.stepsOfEarnings.length = 0;
    this.stepsOfEarnings.push(...earningsRanges.map((earningStep) => {
      const foundConfiguration = scheduleConfiguration[weekdayName];
      if (foundConfiguration) {
        return {
          ...earningStep,
          start: earningStep.start * foundConfiguration.upEndEarningsInTimes,
          end: earningStep.end * foundConfiguration.upEndEarningsInTimes,
        };
      }
      return earningStep;
    }));

    this.chartService.nextStep = this.stepsOfEarnings[1];
  }

}


