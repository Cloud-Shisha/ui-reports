import {Component, inject, OnInit, ViewChild} from "@angular/core";
import JSConfetti from "js-confetti";
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
import {GetEarningsReportsPerHourApiAdapter} from "../api/adapter/get.earnings.reports.per.hour.api.adapter";
import {map, tap} from "rxjs";
import {earningsRanges, earningStep, percentageOfProfit, scheduleConfiguration} from "../data";
import {WeekdaysEnum} from "../weekdays.enum";

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

  public chartOptions: ChartOptions | undefined;

  public amount = 0;

  public readonly stepsOfEarnings: earningStep[] = []

  public readonly today = new Date();

  private readonly getEarningsReportsPerHourApiAdapter = inject(GetEarningsReportsPerHourApiAdapter);

  public readonly listOfAdditionalProfits: {
    amount: number;
  }[] = [
    // {
    //   amount: 36
    // }
  ]
  private nextStep: earningStep | undefined;

  public ngOnInit() {
    initFlowbite();
    this.initStepsOfEarnings();
    this.getEarningsReportsPerHourApiAdapter
      .execute$()
      .pipe(
        map(({reports}) => reports[0].aggregate.sales.total_money.amount),
        tap((amount) => this.amount = amount),
        tap(this.detectIfConfettiShouldBeShown.bind(this)),
      )
      .subscribe(() => {
        this.renderChart();
      });
  }

  private detectIfConfettiShouldBeShown() {
    const lastPassedStepIndex = this.stepsOfEarnings.findIndex((step) => this.amount >= step.start && this.amount <= step.end);
    const step = this.stepsOfEarnings[lastPassedStepIndex];
    if (lastPassedStepIndex > -1 && step.percentage > 0) {
      this.listOfAdditionalProfits.push({
        amount: +((this.amount * (step.percentage / 100)) / percentageOfProfit).toFixed(2),
      });
      this.nextStep = this.stepsOfEarnings[lastPassedStepIndex + 1];
      this.confetti();
    }
  }

  private initStepsOfEarnings() {
    const weekdayName = this.today.toLocaleString("en", {weekday: "long"}) as WeekdaysEnum.Friday | WeekdaysEnum.Saturday;
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

  private renderChart() {

    const amount = this.amount;
    const firstStep = this.nextStep?.start || 0;
    let serie = () => (amount * 100) / firstStep;
    this.chartOptions = {
      series: [serie()],
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
            size: "70%",
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
                return ((this.nextStep?.start || 0) - this.amount).toFixed(2).toString() + " zł";
              },
              color: "#111",
              fontSize: "36px",
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
      labels: ["Jeszcze potrzebujecie"]
    };
    // this.chart?.render();
  }

  private confetti() {
    const jsConfetti = new JSConfetti();

    jsConfetti.addConfetti().then();
  }
}
