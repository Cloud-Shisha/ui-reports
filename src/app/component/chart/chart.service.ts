import {Injectable} from "@angular/core";
import {earningStep} from "../../../data";
import {Subject} from "rxjs";

@Injectable()
export class ChartService {

  public initialized = false;
  public nextStep: earningStep | undefined;

  public readonly amount$ = new Subject<number>();

}
