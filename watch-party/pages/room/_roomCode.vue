<template>
  <div>
    <div
      class="username-section container"
      v-if="!isUsernameEntered && !getAdminStatus"
    >
      <div class="block">
        <input
          type="text"
          class="username-input"
          placeholder="Enter your username"
          v-model="username"
          @keyup.enter="joinRoom()"
        />
      </div>
      <div class="block">
        <button
          class="action-btn"
          :class="{
            'opacity-50': !isUsernameAdded,
            'opacity-100': isUsernameAdded
          }"
          :disabled="!isUsernameAdded"
          @click="joinRoom()"
        >
          Join the watch party
        </button>
      </div>
    </div>
    <div class="video-section" v-if="isUsernameEntered || getAdminStatus">
      <div class="p-6 w-9/12 bg-gray-200 rounded">
        <VideoHeader />
        <VideoPlayer v-if="showVideo"></VideoPlayer>
        <div v-if="!showVideo" class="waiting-msg">
          Waiting for the admin to choose a video to watch together...Feel free
          to suggest something in the comments section
        </div>
      </div>
      <div class="comments-section">
        <CommentsList />
      </div>
    </div>
  </div>
</template>

<script>
import VideoHeader from "../../components/Video/VideoHeader.vue";
import VideoPlayer from "../../components/Video/VideoPlayer.vue";
import CommentsList from "../../components/Comments/CommentsList.vue";

import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      username: null,
      isUsernameEntered: false,
      isAdmin: null,
      showVideo: null,
      channelsSubscribed: false
    };
  },
  computed: {
    ...mapGetters([
      "getAdminStatus",
      "getPartyChInstance",
      "getAblyConnectionStatus",
      "getVideoChInstance",
      "getAdminLeaveStatus"
    ]),
    isUsernameAdded() {
      return this.username != null;
    }
  },
  watch: {
    getAblyConnectionStatus: function(newStatus, oldStatus) {
      console.log("ok ready" + newStatus + oldStatus);
      this.ablyConnectionStatus = newStatus;
      if (newStatus && !this.channelsSubscribed) {
        this.subscribeToChannels();
      }
    },
    getAdminLeaveStatus: function(newStatus, oldStatus) {
      console.log("ADMIN HAS LEFT");
    }
  },
  methods: {
    ...mapActions([
      "instantiateAbly",
      "disconnectAbly",
      "setChosenVideoDetails"
    ]),
    ...mapMutations(["setWatchPartyRoomCode"]),
    joinRoom() {
      console.log("join clicked");
      this.isAdmin = false;
      this.instantiateAbly({ username: this.username, isAdmin: this.isAdmin });
      this.isUsernameEntered = true;
    },
    subscribeToChannels() {
      this.getVideoChInstance.subscribe(msg => {
        this.handleVideoPlayerUpdate(msg);
      });
      this.channelsSubscribed = true;
    },
    handleVideoPlayerUpdate() {
      this.showVideo = true;
    }
  },
  created() {
    if (!this.getAdminStatus && !this.getSelectedVideoStatus) {
      this.showVideo = false;
      this.setWatchPartyRoomCode(this.$route.params.roomCode);
    } else if (!this.getAdminStatus) {
      this.setWatchPartyRoomCode(this.$route.params.roomCode);
    } else if (this.getAdminStatus) {
      this.showVideo = true;
      this.getVideoChInstance.publish({ abc: "abc" });
    }
  },
  destroyed() {}
};
</script>

<style scoped lang="postcss">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.username-section {
  @apply flex-col;
}

.username-input {
  @apply rounded bg-gray-300 w-64 text-center;
}

.action-btn {
  @apply rounded bg-gray-800  p-2 m-auto text-white w-64;
}

.action-btn:hover {
  @apply bg-gray-900;
}

.video-section {
  @apply flex h-screen max-w-full;
}

.waiting-msg {
  @apply ml-6 mt-56 mb-56 border border-current;
}

.comments-section {
  @apply w-1/4 overflow-hidden rounded;
}
</style>
