<template>
  <section class="">
    <div
      class="videojs-player video-player-box vjs-big-play-centered vjs-16-9"
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
      v-video-player:myVideoPlayer="getLatestVideoPlayerOptions"
    ></div>
  </section>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
// todo add youtube support with https://github.com/videojs/videojs-youtube
export default {
  name: "VideoPlayer",
  data() {
    return {
      playsinline: true
    };
  },
  computed: {
    ...mapGetters([
      "getIsAdminStatus",
      "getVideoChMessage",
      "getCurrentVideoStatus",
      "getLatestVideoPlayerOptions"
    ])
  },
  mounted() {
    this.setVideoPlayerInstance(this.myVideoPlayer);
  },
  watch: {
    getVideoChMessage: function(msg) {
      console.log("NON ADMIN RECEIVED MESSAGE", msg.name);
      switch (msg.name) {
        case "play-event":
          this.myVideoPlayer.play();
          this.myVideoPlayer.currentTime(msg.data.currentTime);
          this.myVideoPlayer.play();
          break;
        case "pause-event":
          this.myVideoPlayer.pause();
          break;
        case "general-status":
          this.setVideoStatusUpdate(msg.data);
          if (!msg.data.didStartPlayingVideo) {
            this.myVideoPlayer.pause();
            this.myVideoPlayer.currentTime(0);
          } else if (msg.data.isPlaying) {
            this.myVideoPlayer.play();
            this.myVideoPlayer.currentTime(msg.data.currentTime);
          } else if (msg.data.isPaused) {
            this.myVideoPlayer.currentTime(msg.data.currentTime);
            this.myVideoPlayer.play();
            this.myVideoPlayer.pause();
          }
      }
    }
  },
  methods: {
    ...mapActions(["publishCurrentVideoStatus"]),
    ...mapMutations(["setVideoStatusUpdate", "setVideoPlayerInstance"]),
    // monitor playback
    onPlayerPlay(player) {
      if (this.getIsAdminStatus) {
        this.setVideoStatusUpdate({
          didStartPlayingVideo: true,
          isPlaying: true,
          isPaused: false
        });
        this.publishCurrentVideoStatus("play-event");
      }
    },
    // monitor pause
    onPlayerPause(player) {
      if (this.getIsAdminStatus) {
        this.setVideoStatusUpdate({
          isPlaying: false,
          isPaused: true
        });
        this.publishCurrentVideoStatus("pause-event");
      }
    },
    // monitor stop
    onPlayerEnded(player) {
      // console.log('player ended!', player)
    },
    // monitor loading is complete
    onPlayerLoadeddata(player) {
      if (this.getCurrentVideoStatus.didStartPlayingVideo) {
        this.myVideoPlayer.currentTime(this.getCurrentVideoStatus.currentTime);
        if (this.getCurrentVideoStatus.isPlaying) {
          this.myVideoPlayer.play();
        } else if (this.getCurrentVideoStatus.isPaused) {
          this.myVideoPlayer.play();
          this.myVideoPlayer.pause();
        }
      }
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
      this.setVideoStatusUpdate({
        currentTime: player.currentTime()
      });
    },
    onPlayerCanplay(player) {
      // console.log("player Canplay!", player);
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
  },
  created() {}
};
</script>

<style scoped lang="postcss">
.videojs-player {
  @apply border-2 border-black;
}
</style>
