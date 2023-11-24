import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {HttpClientModule} from "@angular/common/http";
import {ChartComponent} from "./component/chart/chart.component";
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgApexchartsModule,
    HttpClientModule,
    ChartComponent,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
      serverLogLevel: NgxLoggerLevel.OFF,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
