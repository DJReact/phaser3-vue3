import ballPng from "../images/ball_32_32.png";
import paddle from "../images/paddle_128_32.png";
import brick1 from "../images/brick1_64_32.png";
import brick2 from "../images/brick2_64_32.png";
import brick3 from "../images/brick3_64_32.png";
export default function () {
  console.log("this", this);
  this.load.image("ball", ballPng);
  this.load.image("paddle", paddle);
  this.load.image("brick1", brick1);
  this.load.image("brick2", brick2);
  this.load.image("brick3", brick3);
  this.load.on("complete", () => {
    console.log("所有资源加载完毕");
    // state.isLoading = false;
  });
}
