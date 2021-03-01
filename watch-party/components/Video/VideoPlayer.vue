<template>
  <section class="ml-6 w-11/12 container">
    <div
      class="video-player-box  vjs-big-play-centered vjs-16-9"
      :playsinline="playsinline"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @ended="onPlayerEnded($event)"
      @loadeddata="onPlayerLoadeddata($event)"
      @waiting="onPlayerWaiting($event)"
      @playing="onPlayerPlaying($event)"
      @timeupdate="onPlayerTimeupdate($event)"
      @canplay="onPlayerCanplay($event)"
      @canplaythrough="onPlayerCanplaythrough($event)"
      @ready="playerReadied"
      @statechanged="playerStateChanged($event)"
      v-video-player:myVideoPlayer="playerOptions"
    ></div>
  </section>
</template>

<script>
export default {
  name: "VideoPlayer",
  data() {
    return {
      playsinline: true,
      playerOptions: {
        //player configuration
        muted: false, //whether to mute
        language: "en",
        fluid: true,
        // width: "550px",
        // height: "300px",
        liveui: true,
        playbackRates: [0.7, 1.0, 1.5, 2.0], //Playback speed
        sources: [
          {
            type: "video/mp4",
            src:
              "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }
        ],
        poster:
          "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg" //Cover image
      }
    };
  },
  mounted() {
    console.log("this is current player instance object", this.myVideoPlayer);
  },
  methods: {
    // monitor playback
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    // monitor pause
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // monitor stop
    onPlayerEnded(player) {
      // console.log('player ended!', player)
    },
    // monitor loading is complete
    onPlayerLoadeddata(player) {
      // console.log('player Loadeddata!', player)
    },
    // monitor video buffer waiting
    onPlayerWaiting(player) {
      // console.log('player Waiting!', player)
    },
    // monitor the video to play after pause
    onPlayerPlaying(player) {
      // console.log('player Playing!', player)
    },
    // Monitor video playback duration update
    onPlayerTimeupdate(player) {
      // console.log('player Timeupdate!', player.currentTime())
    },
    onPlayerCanplay(player) {
      console.log("player Canplay!", player);
    },
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },
    // monitor state changes
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },
    // The monitor player is ready
    playerReadied(player) {
      // console.log('example 01: the player is readied', player)
    }
  }
};
</script>

<style scoped></style>
