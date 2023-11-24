import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {ChartComponent} from "./component/chart/chart.component";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        NgApexchartsModule,
        HttpClientModule,
        ChartComponent,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
