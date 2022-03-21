<template>
  <div class="page">
    <div id="container">
      <div class="score">成绩： {{ score }}</div>
      <div class="cjy_popup" v-if="gameOver" @click="playAgain">
        <div class="mask"></div>
        <div class="content">游戏结束</div>
      </div>
    </div>
  </div>
</template>

<script>
import Phaser from "phaser";
import { onMounted, reactive, toRefs } from "vue";
import ballPng from "./images/ball_32_32.png";
import paddle from "./images/paddle_128_32.png";
import brick1 from "./images/brick1_64_32.png";
import brick2 from "./images/brick2_64_32.png";
import brick3 from "./images/brick3_64_32.png";

export default {
  name: "aMole",
  setup() {
    let player, ball, violetBricks, yellowBricks, redBricks, cursors;
    let openingText, playerWonText;
    let game;
    let gameOverText;
    const state = reactive({
      isLoading: true,
      game: undefined,
      gameStarted: false,
      score: 0,
      gameOver: false,
    });

    const playAgain = () => {
      console.log(888);
    };
    const handleStart = () => {
      console.log("game", game);
    };
    // 超出结束
    function isGameOver(world) {
      return ball.body.y > world.bounds.height;
    }
    // 是否胜利
    function isWon() {
      return (
        violetBricks.countActive() +
          yellowBricks.countActive() +
          redBricks.countActive() ===
        0
      );
    }
    const config = {
      type: Phaser.AUTO,
      parent: "container",
      width: 800,
      height: 640,
      scale: {
        // mode: Phaser.Scale.RESIZE,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload: function () {
          this.load.image("ball", ballPng);
          this.load.image("paddle", paddle);
          this.load.image("brick1", brick1);
          this.load.image("brick2", brick2);
          this.load.image("brick3", brick3);
          this.load.on("complete", () => {
            console.log("this!", this);
            console.log("所有资源加载完毕");
            state.isLoading = false;
          });
        },
        create: function () {
          player = this.physics.add.sprite(400, 600, "paddle");
          player.setCollideWorldBounds(true);

          openingText = this.add
            .text(
              this.physics.world.bounds.width / 2,
              this.physics.world.bounds.height / 2,
              "Press Space to Start",
              {
                fontSize: "50px",
                fill: "#fff",
              }
            )
            .setOrigin(0.5);
          // 游戏结束
          gameOverText = this.add
            .text(
              this.physics.world.bounds.width / 2,
              this.physics.world.bounds.height / 2,
              "Game over",
              {
                fontSize: "50px",
                fill: "#fff",
              }
            )
            .setOrigin(0.5);
          gameOverText.on("pointerup", () => {
            console.log("开始游戏");
          });
          // 通关
          playerWonText = this.add
            .text(
              this.physics.world.bounds.width / 2,
              this.physics.world.bounds.height / 2,
              "You won!",
              {
                fontSize: "50px",
                fill: "#fff",
              }
            )
            .setOrigin(0.5);
          gameOverText.setVisible(false);
          playerWonText.setVisible(false);
          // 玩家不动
          player.setImmovable(true);
          ball = this.physics.add.sprite(400, 565, "ball");
          ball.setCollideWorldBounds(true);
          ball.setBounce(1, 1);
          violetBricks = this.physics.add.group({
            key: "brick1",
            repeat: 9,
            immovable: true,
            setXY: {
              x: 80,
              y: 140,
              stepX: 70,
            },
          });
          yellowBricks = this.physics.add.group({
            key: "brick2",
            repeat: 9,
            immovable: true,
            setXY: {
              x: 80,
              y: 90,
              stepX: 70,
            },
          });
          redBricks = this.physics.add.group({
            key: "brick3",
            repeat: 9,
            immovable: true,
            setXY: {
              x: 80,
              y: 40,
              stepX: 70,
            },
          });
          //   世界底部不检测
          this.physics.world.checkCollision.down = false;
          //   监听键盘
          cursors = this.input.keyboard.createCursorKeys();
          //   碰撞检测
          this.physics.add.collider(player, ball, hitPlayer, null, this);
          this.physics.add.collider(
            ball,
            violetBricks,
            destroyBricks,
            null,
            this
          );
          this.physics.add.collider(
            ball,
            yellowBricks,
            destroyBricks,
            null,
            this
          );
          this.physics.add.collider(ball, redBricks, destroyBricks, null, this);
          // 球碰到玩家
          function hitPlayer(player, ball) {
            ball.setVelocityY(ball.body.velocity.y - 5);
            let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
            // If the ball is to the left of the player, ensure the X-velocity is negative
            if (ball.x < player.x) {
              ball.setVelocityX(-newXVelocity);
            } else {
              ball.setVelocityX(newXVelocity);
            }
          }
          // 销毁砖块
          function destroyBricks(ball, brick) {
            state.score += 10;
            brick.disableBody(true, true);
            if (ball.body.velocity.x === 0) {
              let randNum = Math.random();
              randNum >= 0.5 && ball.body.setVelocityX(150);
              randNum < 0.5 && ball.body.setVelocityX(-150);
            }
          }
        },
        update: function () {
          player.body.setVelocityX(0);
          if (isGameOver(this.physics.world)) {
            this.physics.pause();
            gameOverText.setVisible(true);
            ball.disableBody(true, true);
            // state.gameOver = true;
          } else if (isWon()) {
            this.physics.pause();
            playerWonText.setVisible(true);
            ball.disableBody(true, true);
            console.log("你赢了");
          } else {
            //   正常情况
            if (cursors.left.isDown) {
              player.body.setVelocityX(-350);
            } else if (cursors.right.isDown) {
              player.body.setVelocityX(350);
            }

            if (!state.gameStarted) {
              ball.setX(player.x);
              if (cursors.space.isDown) {
                openingText.setVisible(false);
                state.gameStarted = true;
                ball.setVelocityY(-400);
              }
            }
          }
        },
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: false,
          debug: true,
        },
      },
    };

    onMounted(() => {
      game = new Phaser.Game(config);
      console.log("config", config);
    });
    return {
      ...toRefs(state),
      playAgain,
      handleStart,
    };
  },
};
</script>
<style src="./index.scss" lang="scss" scoped></style>
