import {AfterContentInit, Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {initFlowbite} from "flowbite";
import {earningsRanges, scheduleConfigurations, schedules} from "../data";
import {WeekdaysEnum} from "../weekdays.enum";
import {CoreService} from "../core/service/core.service";
import {filter} from "rxjs";
import {is} from "thiis";
import {initMessageWithAutoUpdate} from "../tools";
import {EffectHelper} from "../helper/effect.helper";
import {ChartService} from "./component/chart/chart.service";
import {refreshIn12Hours} from "../helper";
import {BusinessCalculationModel} from "../core/model/business-calculation.model";
import {NGXLogger} from "ngx-logger";
import {IEarningStep} from "../interface/i.earning-step";
import {EarningsRangesModel} from "../core/model/earnings-ranges.model";
import {ScheduleModel} from "../core/model/schedule.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  encapsulation: ViewEncapsulation.None,
  providers: [
    ChartService
  ]
})
export class AppComponent implements OnInit, AfterContentInit {

  private readonly ngxLogger = inject(NGXLogger);
  private readonly effectHelper = inject(EffectHelper);
  private readonly coreService = inject(CoreService);
  private readonly chartService = inject(ChartService);

  private readonly earningsRangesModel: EarningsRangesModel;
  private readonly scheduleModel: ScheduleModel;
  private readonly businessCalculationModel: BusinessCalculationModel;

  // public today = new Date();
  // public minusDays = 0;

  public initialized = false;

  constructor() {
    // Init models
    this.earningsRangesModel = new EarningsRangesModel();
    this.scheduleModel = new ScheduleModel();
    this.earningsRangesModel.setScheduleModel(this.scheduleModel);
    this.businessCalculationModel = new BusinessCalculationModel([], this.earningsRangesModel);

    refreshIn12Hours();
    // this.initMinusDays();
  }

  public get fullEarningsStepsAchieved() {
    return this.businessCalculationModel.getFullEarningsStepsAchieved();
  }

  public get isScheduleStillValid() {
    return this.scheduleModel.isScheduleStillValid;
  }

  public get currentScheduleIsFromYesterday() {
    return this.scheduleModel.currentScheduleIsFromYesterday;
  }

  public get currentProfit() {
    return this.businessCalculationModel.getLastAchievedProfit();
  }

  public get nextSchedule() {
    return this.businessCalculationModel?.earningsRangesModel?.scheduleModel?.nextSchedule;
  }

  // private initMinusDays() {
  //   this.ngxLogger.info("initMinusDays");
  //   // this.schedule = this.getSchedule();
  //   const urlParams = new URLSearchParams(window.location.search);
  //   this.minusDays = +(urlParams.get('minusDays') || 0);
  //   if (!this.minusDays) {
  //     // const scheduleIsFromYesterday = this.schedule.weekdayName !== this.today.toLocaleString("en", {weekday: "long"});
  //     // this.minusDays = scheduleIsFromYesterday ? 1 : 0;
  //   }
  //   this.today = this.coreService.setMinusDays(this.minusDays);
  //   this.ngxLogger.info("initMinusDays:today:", this.today.toISOString());
  // }

  public ngOnInit() {
    initFlowbite();
    if (this.currentScheduleIsFromYesterday) {
      this.coreService.setMinusDays(1);
    }
    this.coreService.initialize().then(() => {

      console.log(this.isScheduleStillValid);

      this.coreService.amount$.pipe(filter(is.number)).subscribe((amount) => {

        this.ngxLogger.info("amount:", amount);

        this.businessCalculationModel.initStepsOfEarnings(amount);

        // Show confetti if some earning step is achieved
        if (this.businessCalculationModel.someEarningStepIsAchieved()) {
          this.effectHelper.executeAsync();
        }

        this.chartService.setNextStep(this.businessCalculationModel.getNextEarningsStepAfterPassed());
        this.chartService.amount$.next(amount);
        // this.initMinusDays();

        if (!this.initialized) {
          this.initialized = true;
          this.ngxLogger.info("initialized");
        }

      });

    });

  }

  public ngAfterContentInit() {
    initMessageWithAutoUpdate();
  }

}


