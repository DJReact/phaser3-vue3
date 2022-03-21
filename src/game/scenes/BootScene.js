import { Scene } from "phaser";
import Phaser from "phaser";
import sky from "@/game/assets/sky.png";
import bomb from "@/game/assets/bomb.png";
import ground from "../assets/platform.png";
import star from "../assets/star.png";
import dude from "../assets/dude.png";

export default class BootScene extends Scene {
  constructor() {
    super({ key: "BootScene" });
    // 平台
    this.platforms = null;
    // 玩家
    this.player = null;
    // 焦点
    this.cursors = null;
    // 星星
    this.stars = null;
    // 记分板
    this.score = 0;
    this.scoreText = null;
    // 炸弹组
    this.bombs = null;
    // 游戏状态
    this.gameOver = false;
  }
  preload() {
    this.load.image("sky", sky);
    this.load.image("bomb", bomb);
    this.load.image("ground", ground);
    this.load.image("star", star);
    // 加载精灵
    this.load.spritesheet("dude", dude, {
      frameWidth: 32,
      frameHeight: 48,
    });
    // this.load.audio("thud", [thudMp3, thudOgg]);
  }
  // 创建
  create() {
    // 新增天空图
    this.add.image(400, 300, "sky");
    // 新增平台 + 碰撞体
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");
    // 玩家
    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    // 玩家动画
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    // 记分板
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });
    // 炸弹组
    this.bombs = this.physics.add.group({
      key: "bomb",
      setXY: { x: 12, y: 0 },
    });
    this.bombs.children.iterate(function (child) {
      child.setCollideWorldBounds(true);
      child.onWorldBounds = true;
      child.setBounce(1);
      child.setVelocity(200, 20);
    });
    // this.bombs.setCollideWorldBounds(true);
    // this.bombs.onWorldBounds = true;
    // this.bombs.setBounce(1);
    // this.bombs.setVelocity(200, 20);
    // 星星组
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // 监听键盘
    this.cursors = this.input.keyboard.createCursorKeys();
    // 碰撞检测
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.platforms, this.stars);
    this.physics.add.collider(this.platforms, this.bombs);
    // 玩家碰到炸弹
    this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);
    // 销毁
    this.physics.add.overlap(this.player, this.stars, collectStar, null, this);
    // 碰到炸弹
    function hitBomb(player, bombs) {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play("turn");
      this.gameOver = true;
    }
    // 收集星星
    function collectStar(player, stars) {
      stars.disableBody(true, true);
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      console.log("this.stars", this.stars);
      // 如果星星全部销毁再生成一组
      if (this.isClear()) {
        this.stars.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });
      }
    }
  }
  isClear() {
    let numb = 0;
    this.stars?.children?.entries?.forEach((item) => {
      if (item.active === false) {
        numb++;
      }
    });
    return this.stars.children?.entries?.length === numb;
  }
  // 更新
  update() {
    if (this.gameOver) return;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
