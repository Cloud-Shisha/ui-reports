import {Component, inject, OnInit, ViewChild} from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  ChartComponent
} from "ng-apexcharts";
import {initFlowbite} from "flowbite";
import {earningsRanges, earningStep, percentageOfProfit, scheduleConfiguration, schedules} from "../data";
import {WeekdaysEnum} from "../weekdays.enum";
import {ConfettiService} from "../helper/confetti.service";
import {CoreService} from "../core/service/core.service";
import {filter} from "rxjs";
import {is} from "thiis";
import {getRandomMotivationText} from "../motivates";
import {typeAndClearMessage} from "../tools";

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  @ViewChild(ChartComponent)
  public chart: ChartComponent | undefined;

  public initialized = false;

  private readonly confettiService = inject(ConfettiService);
  private readonly coreService = inject(CoreService);

  public chartOptions: ChartOptions | undefined;

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

  private nextStep: earningStep | undefined;

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

        if (!this.initialized) {

          this.pushMotivationText();

        }

        this.initStepsOfEarnings();
        this.detectIfConfettiShouldBeShown(amount);
        this.renderChart(amount);
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
      this.nextStep = this.stepsOfEarnings[lastPassedStepIndex + 1];
      if (!this.nextStep) {
        this.nextStep = step;
        this.lastStepPassed = true;
      } else {
        this.lastStepPassed = false;
      }
      if (!prevProfit) {
        this.confettiService.executeAsync().then();
      } else if (prevProfit.start !== step.start) {
        this.confettiService.executeAsync().then();
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

    this.nextStep = this.stepsOfEarnings[1];
  }

  private renderChart(amount: number) {

    const firstStep = this.nextStep?.start || 0;
    const sizePercentage = 70;
    const percentage = +((amount / firstStep) * 100).toFixed(2);
    const serieValue = percentage > 97 && percentage < 100 ? 97 : percentage;

    const result = (this.nextStep?.start || 0) - amount;

    this.chartOptions = {
      series: [serieValue],
      chart: {
        height: 350,
        type: "radialBar",
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: `${sizePercentage}%`,
            background: "#fff",
            image: undefined,
            position: "front",
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24
            }
          },
          track: {
            background: "#fff",
            strokeWidth: "67%",
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35
            }
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: "#888",
              fontSize: "17px",
            },
            value: {
              formatter: () => {
                if (result < 0) {
                  return "Wszystkie nagrody!";
                }
                return result.toFixed(2).toString() + " zł";
              },
              color: result < 0 ? "green" : "#111",
              fontSize: result < 0 ? "20px" : "36px",
              show: true
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#ABE5A1"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: result < 0 ? ["Gratulacje! Macie:"] : ["Jeszcze potrzebujecie"]
    };

    this.initialized = true;

  }

}


