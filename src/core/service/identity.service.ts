import {inject, Injectable} from "@angular/core";
import {firstValueFrom, map, tap} from "rxjs";
import {TodaysIncomeReportGetApiAdapter} from "../../api/adapter/todays-income-report.get.api.adapter";
import {AccessTokenPostApiAdapter} from "../../api/adapter/access-token.post.api.adapter";
import {RefreshTokenPostApiAdapter} from "../../api/adapter/refresh-token.post.api.adapter";

type identity = {
  access_token: string;
  expires_in: number; // Seconds
  token_type: string;
  refresh_token: string;
  scope: string;
  expires_at?: number; // Milliseconds
};

@Injectable({
  providedIn: "root"
})
export class IdentityService {

  private readonly accessTokenPostApiAdapter = inject(AccessTokenPostApiAdapter);
  private readonly refreshTokenPostApiAdapter = inject(RefreshTokenPostApiAdapter);

  #accessToken: string | undefined;
  #refreshToken: string | undefined;

  #storage = localStorage;

  public get accessToken() {
    return this.#accessToken;
  }

  public initialize() {

    return this.initializeAccessToken();

  }

  private async initializeAccessToken() {

    let identity = JSON.parse(this.#storage.getItem("identity") || "null");

    if (identity) {
      console.log("Identity found in storage", identity)
      if (identity.expires_at < new Date().getTime()) {
        console.log("Identity expired", identity);
        identity = null;
      }
    }

    if (!identity) {
      console.log("Trying to get new identity");
      identity = await firstValueFrom(this.accessTokenPostApiAdapter.execute$());
      identity = this.saveIdentity(identity);
    }

    this.initializeData(identity);

  }

  private initializeData(identity: Required<identity>) {

    this.#accessToken = identity.access_token;
    this.#refreshToken = identity.refresh_token;

    const restTimeToRefreshToken = (identity.expires_at - new Date().getTime()) - (30 * 1000); // 30 seconds before expires_at

    setTimeout(() => {
      this.refreshAccessToken().then();
    }, restTimeToRefreshToken);

    console.log("Identity initialized and autoRefreshToken too", identity, restTimeToRefreshToken);

  }

  private async refreshAccessToken() {
    if (!this.#refreshToken) {
      console.error("Refresh token is not defined");
      return;
    }
    const response = await firstValueFrom(this.refreshTokenPostApiAdapter.execute$(this.#refreshToken));
    const identity = this.saveIdentity(response);
    this.initializeData(identity);
  }

  private saveIdentity(identity: identity): Required<identity> {

    const newIdentity = {
      ...identity,
      expires_at: new Date().getTime() + identity.expires_in * 1000
    };
    this.#storage.setItem("identity", JSON.stringify(newIdentity));
    console.log("Identity saved", newIdentity);
    return newIdentity;

  }

}
