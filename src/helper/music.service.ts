import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class MusicService {

  public play() {
    const audio = new Audio();
    audio.src = "assets/music/success.mp3";
    audio.load();
    return audio.play();
  }

}
