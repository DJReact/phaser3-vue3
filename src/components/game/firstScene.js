import { Scene } from "phaser";
import sky from "@/assets/img/sky.png";
import bomb from "@/assets/img/bomb.png";

export default class FirstScene extends Scene {
  constructor() {
    super({ key: "FirstScene" });
  }
  preload() {
    this.load.image("sky", sky);
    this.load.image("bomb", bomb);
  }
  create() {
    this.scene.start("PlayScene");
  }
}
