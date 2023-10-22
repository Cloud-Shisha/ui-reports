import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EndpointApi} from "../endpoint.api";

type response = {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
}

@Injectable({
  providedIn: "root"
})
export class AccessTokenPostApiAdapter {

  private readonly httpClient = inject(HttpClient);

  public execute$() {
    return this.httpClient.post<response>(EndpointApi.POST_ACCESS_TOKEN, null);
  }

}
