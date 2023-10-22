import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, map, tap} from "rxjs";
import {TodaysIncomeReportGetApiAdapter} from "../../api/adapter/todays-income-report.get.api.adapter";
import {IdentityService} from "./identity.service";

@Injectable({
  providedIn: "root"
})
export class CoreService {

  private readonly identityService = inject(IdentityService);
  private readonly todaysIncomeReportGetApiAdapter = inject(TodaysIncomeReportGetApiAdapter);

  #amount$ = new BehaviorSubject<null | number>(null);
  // private timeoutToAutoRefreshAmount = (1000 * 60) * 10; // 10 minutes
  private timeoutToAutoRefreshAmount = 20_000; // 10 minutes

  public readonly amount$ = this.#amount$.asObservable();
  #minusDays = 0;

  public setMinusDays(minusDays: number): Date {
    this.#minusDays = minusDays;
    const date = new Date();
    date.setDate(date.getDate() - minusDays);
    console.log("minusDays:", minusDays, "date:", date.toISOString());
    return date;
  }

  public async initialize() {

    await this.identityService.initialize();
    const accessToken = this.identityService.accessToken;

    this.initializeAmount(accessToken);

  }

  private initializeAmount(accessToken: string | undefined) {

    if (!accessToken) {
      console.error("Access token is not defined");
      return;
    }

    this.todaysIncomeReportGetApiAdapter
      .execute$(accessToken, this.#minusDays)
      .pipe(
        map(({reports}) => reports[0].aggregate.sales.total_money.amount),
        tap((amount) => this.#amount$.next(amount)),
      )
      .subscribe(() => {
        this.initializeAutoRefreshAmount();
      });

  }

  private initializeAutoRefreshAmount() {

    setTimeout(() => {
      this.initializeAmount(this.identityService.accessToken);
    }, this.timeoutToAutoRefreshAmount);

  }

}
