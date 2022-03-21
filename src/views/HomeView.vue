<template>
  <div :id="containerId" v-if="downloaded"></div>
  <div class="placeholder" v-else>Downloading ...</div>
</template>
<script>
import { reactive, toRefs, onMounted, nextTick } from "vue";
export default {
  setup() {
    const state = reactive({
      homeId: null,
      downloaded: false,
      gameInstance: null,
      containerId: "game-container",
    });

    onMounted(async () => {
      const game = await import(/* webpackChunkName: "game" */ "@/game/game");
      console.log("game", game);
      state.downloaded = true;
      nextTick(() => {
        state.gameInstance = game.launch(state.containerId);
        console.log("state.gameInstance", state.gameInstance);
      });
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>
<style lang="scss" scoped>
.placeholder {
  font-size: 2rem;
  font-family: "Courier New", Courier, monospace;
}
</style>
