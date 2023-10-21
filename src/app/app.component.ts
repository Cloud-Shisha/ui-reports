import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import JSConfetti from "js-confetti";
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke,
  ApexAxisChartSeries
} from "ng-apexcharts";
import {initFlowbite} from "flowbite";

export type ChartOptions = {
  series:  ApexAxisChartSeries | ApexNonAxisChartSeries;
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
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild(ChartComponent) chart: ChartComponent | undefined;
  public chartOptions: ChartOptions;

  public amount = 0;

  public firstStep = 4000;
  // @ts-ignore
  public timer: string | number | NodeJS.Timeout | undefined;

  randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private confittu() {
    const jsConfetti = new JSConfetti();

    jsConfetti.addConfetti();
  }

  public ngOnInit() {
    initFlowbite();
  }

  public ngAfterViewInit() {
    this.timer = setInterval(() => {
      const newAmount = Math.floor(this.randomInRange(0, this.firstStep / 2));
      this.amount += newAmount;
      if (this.amount >= this.firstStep) {
        clearInterval(this.timer);
        clearTimeout(this.timer);
        this.amount = this.firstStep;
      }
      const amount = this.amount;
      const firstStep = this.firstStep;
      let serie = () => (amount * 100) / firstStep;
      console.log(serie());
      if (serie() === 100) {
        this.confittu();
      }
      this.chart?.updateSeries([serie()]);
    }, 2000);
  }

  constructor() {
    const amount = this.amount;
    const firstStep = this.firstStep;
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
              fontSize: "17px"
            },
            value: {
              formatter: () => {
                return (this.firstStep - this.amount).toString();
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
      labels: ["Percent"]
    };
  }
}
