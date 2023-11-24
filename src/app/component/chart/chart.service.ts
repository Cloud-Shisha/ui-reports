import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {IEarningStep} from "../../../interface/i.earning-step";

@Injectable()
export class ChartService {

  public initialized = false;
  public nextStep: IEarningStep | undefined;

  public readonly amount$ = new Subject<number>();

  public setNextStep(step: IEarningStep | undefined) {
    this.nextStep = step;
    return this;
  }


}
