import {Component, inject, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke, NgApexchartsModule
} from "ng-apexcharts";
import {NgIf} from "@angular/common";
import {ChartService} from "./chart.service";

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    NgApexchartsModule
  ]
})
export class ChartComponent implements OnInit {

  @ViewChild(ChartComponent)
  public chart: ChartComponent | undefined;

  public chartOptions: ChartOptions | undefined;

  private readonly chartService = inject(ChartService);

  public ngOnInit() {
    this.chartService.amount$.subscribe((amount) => {
      this.renderChart(amount);
    });
  }

  private renderChart(amount: number) {

    const firstStep = this.chartService.nextStep?.start || 0;
    const sizePercentage = 70;
    const percentage = +((amount / firstStep) * 100).toFixed(2);
    const serieValue = percentage > 97 && percentage < 100 ? 97 : percentage;

    const result = (this.chartService.nextStep?.start || 0) - amount;

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

    this.chartService.initialized = true;

  }

}
