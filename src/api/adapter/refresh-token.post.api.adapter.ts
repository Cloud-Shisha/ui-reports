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
export class RefreshTokenPostApiAdapter {

  private readonly httpClient = inject(HttpClient);

  public execute$(refresh_token: string) {
    return this.httpClient.post<response>(EndpointApi.POST_REFRESH_TOKEN, null, {
      params: {
        refresh_token,
      }
    });
  }

}
