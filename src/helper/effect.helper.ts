import {inject, Injectable} from "@angular/core";
import {ConfettiService} from "./confetti.service";
import {MusicService} from "./music.service";

@Injectable({
  providedIn: "root"
})
export class EffectHelper {

  private readonly confettiService = inject(ConfettiService);
  private readonly musicService = inject(MusicService);

  public executeAsync() {
    this.musicService.play().then();
    setTimeout(() => {
      this.confettiService.executeAsync().then();
    }, 850);
  }
}
