import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EndpointApi} from "../endpoint.api";

type Response = {
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

// type Amount = {
//   amount: number;
//   currency: string;
// };
//
// type Terminal = {
//   uid: string;
//   name: string;
// };
//
// type Data = {
//   id: {
//     $numberInt: string;
//   };
//   uid: string;
//   opened_at: string;
//   closed_at: string;
//   start_amount: Amount;
//   total_amount: Amount;
//   income_amount: Amount;
//   end_amount: Amount;
//   terminal: Terminal;
//   status: string;
//   type: string;
// };
//
// type Response = {
//   data: Data[];
// };

@Injectable({
  providedIn: "root"
})
export class TodaysIncomeReportGetApiAdapter {

  private readonly httpClient = inject(HttpClient);

  public execute$(access_token: string, minus_days = 0) {
    return this.httpClient.get<Response>(EndpointApi.GET_TODAYS_INCOME_REPORT, {
      params: {
        access_token,
        minus_days
      }
    });
  }

}
