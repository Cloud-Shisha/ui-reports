import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {getEarningsReportsPerHour} from "../endpoint.api";

type response = {
  "dateRange": string;
  "reports": [
    {
      "sub_report": [];
      "group_by_type": string;
      "group_by_value": null;
      "aggregate": {
        "sales": {
          "transaction_count": number;
          "discount_money": {
            "amount": number;
            "currency": "PLN";
          };
          "sub_total_money": null;
          "net_total_money": null;
          "discount_count": number;
          "total_money": {
            "amount": number;
            "currency": "PLN";
          };
          "tax_money": null;
          "product_quantity": number;
          "net_profit_money": null;
          "profit_money": null;
          "production_money": null;
          "net_production_money": null;
        };
      };
      "compare_aggregate": {};
    }
  ];
};

@Injectable({
  providedIn: "root"
})
export class GetEarningsReportsPerHourApiAdapter {

  private readonly httpClient = inject(HttpClient);

  public execute$() {
    return this.httpClient.get<response>(getEarningsReportsPerHour);
  }

}
