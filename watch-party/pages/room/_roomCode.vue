<template>
  <div>
    <div
      class="username-section container"
      v-if="!isUsernameEntered && !getIsAdminStatus"
    >
      <ProjectTitle></ProjectTitle>
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
      <ProjectReferences></ProjectReferences>
    </div>
    <div class="video-section" v-if="isUsernameEntered || getIsAdminStatus">
      <div class="video-section-column">
        <VideoHeader />
        <VideoPlayer v-if="showVideo && !getDidAdminLeaveStatus"></VideoPlayer>
        <div
          class="force-sync-section"
          v-if="showVideo && !getIsAdminStatus && !getDidAdminLeaveStatus"
        >
          <button class="sync-btn" @click="forceSyncWithAdmin()">
            Force sync with admin
            <font-awesome-icon class="avatar " :icon="['fas', 'sync-alt']" />
          </button>
        </div>
        <div
          class="force-sync-section"
          v-if="getIsAdminStatus && !getDidAdminLeaveStatus"
        >
          <button
            v-if="getIsAdminStatus"
            class="sync-btn"
            @click="copyBtnClicked()"
          >
            {{ btnText }}
            <font-awesome-icon :icon="['fas', 'copy']" />
          </button>
        </div>
        <div v-if="!showVideo || getDidAdminLeaveStatus" class="waiting-msg">
          <p v-if="!getDidAdminLeaveStatus">
            Waiting for the admin to choose a video to watch together.
            <br /><br />Until then, you can start adding live comments, or check
            out this project on GitHub:
          </p>
          <p v-if="getDidAdminLeaveStatus">
            Unfortunately, the host of this watch party has left. Show's over!
            <br /><br />Check out this project on GitHub or
            <!--todo update url-->
            <a href="http://localhost:3000/" class="home-link"
              >go to the main page</a
            >
            to host your own watch party
          </p>
          <div class="my-5 ml-0">
            <gh-btns-star
              slug="ably-labs/jamstack-sync-stream-video"
              show-count
              class="gh-btn"
            ></gh-btns-star>
            <gh-btns-fork
              slug="ably-labs/jamstack-sync-stream-video"
              show-count
              class="gh-btn"
            ></gh-btns-fork>
          </div>
        </div>
      </div>
      <div class="comments-section">
        <CommentsList />
      </div>
    </div>
  </div>
</template>

<script>
import ProjectReferences from "../../components/ProjectReferences.vue";
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
      showVideo: false,
      copyClicked: null,
      btnText: "Copy shareable link"
    };
  },
  computed: {
    ...mapGetters([
      "getIsAdminStatus",
      "getDidAdminLeaveStatus",
      "getVideoChMessage",
      "getCurrentVideoStatus",
      "getShareableLink"
    ]),
    isUsernameAdded() {
      return this.username != null;
    }
  },
  watch: {
    getDidAdminLeaveStatus: function(newStatus, oldStatus) {
      console.log("ADMIN HAS LEFT");
    },
    getVideoChMessage: function(msg) {
      console.log("NON ADMIN RECEIVED MESSAGE", msg.name);
      if (!this.showVideo) {
        this.handleVideoPlayerUpdate(msg);
      }
    }
  },
  methods: {
    ...mapActions([
      "instantiateAbly",
      "setChosenVideoDetails",
      "publishCurrentVideoStatus",
      "requestInitialVideoStatus"
    ]),
    ...mapMutations(["setWatchPartyRoomCode", "setVideoStatusUpdate"]),
    joinRoom() {
      this.isAdmin = false;
      this.instantiateAbly({ username: this.username, isAdmin: this.isAdmin });
      this.isUsernameEntered = true;
    },
    handleVideoPlayerUpdate(msg) {
      msg.data.isVideoChosen === true
        ? (this.showVideo = true)
        : (this.showVideo = false);
      this.setVideoStatusUpdate(msg.data);
      console.log("came here first in room code");
      console.log(this.getCurrentVideoStatus);
    },
    forceSyncWithAdmin() {
      this.requestInitialVideoStatus();
    },
    copyBtnClicked() {
      this.copyClicked = true;
      this.btnText = "Copied !";
      setTimeout(() => {
        this.copyClicked = false;
        this.btnText = "Copy shareable link";
      }, 2000);
      navigator.clipboard.writeText(this.getShareableLink);
    }
  },
  created() {
    if (this.getIsAdminStatus) {
      this.showVideo = true;
      this.setVideoStatusUpdate({
        isVideoChosen: true,
        chosenVideoRef: this.$route.params.chosenVideoRef
      });
      this.publishCurrentVideoStatus("video-chosen");
    } else {
      this.setWatchPartyRoomCode(this.$route.params.roomCode);
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
  @apply rounded bg-gray-800 p-2 m-auto text-white w-64;
}

.action-btn:hover {
  @apply bg-gray-900;
}

.force-sync-section {
  @apply text-center;
}

.sync-btn {
  @apply rounded bg-gray-800 p-2 m-auto text-white w-3/4 my-2 text-xs;
}

.sync-btn:hover {
  @apply bg-gray-900;
}

.waiting-msg {
  @apply my-10;
}
.video-section-column {
  @apply w-full pt-3 px-3 pb-1;
  background-image: url("../../assets/grey-pattern.png");
  background-repeat: repeat;
}
.comments-section {
  @apply w-full overflow-hidden rounded;
}

.video-section {
  @apply h-screen;
  background-image: url("../../assets/grey-pattern.png");
  background-repeat: repeat;
}
.gh-btn {
  float: none;
  @apply ml-0;
}

.home-link {
  @apply text-blue-600;
}

@screen md {
  .comments-section {
    @apply w-1/3 bg-gray-200;
  }

  .waiting-msg {
    @apply my-48 w-1/2;
  }

  .video-section {
    @apply flex;
  }
  .video-section-column {
    @apply w-2/3 p-6 rounded;
  }

  .sync-btn {
    @apply w-1/2 text-sm;
  }
}

@screen xl {
  .comments-section {
    @apply w-1/4;
  }

  .video-section {
    @apply flex;
    background-image: url("../../assets/grey-pattern.png");
    background-repeat: repeat;
  }
  .video-section-column {
    @apply w-9/12;
  }
  .watchpage-refs {
    @apply border-red-900 border-2 text-center;
  }
}
</style>
