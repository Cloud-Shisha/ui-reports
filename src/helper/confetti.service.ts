import {Injectable} from "@angular/core";
import JSConfetti from "js-confetti";

@Injectable({
  providedIn: "root"
})
export class ConfettiService {

  private readonly confetti = new JSConfetti();

  public executeAsync() {
    return this.confetti.addConfetti();
  }

}
