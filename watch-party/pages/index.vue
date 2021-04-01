<template>
  <div class="container flex-col">
    <div class="block ">
      <input
        type="text"
        class="rounded bg-gray-300 w-64 text-center"
        placeholder="Enter your username"
        v-model="username"
        :disabled="isCreatingRoom"
        @keyup.enter="createRoom()"
      />
    </div>
    <div class="block">
      <button
        class="rounded bg-gray-800  p-2 m-auto text-white hover:bg-gray-900 w-64"
        :class="{ 'opacity-50': btnDisabled, 'opacity-100': !btnDisabled }"
        :disabled="btnDisabled"
        @click="shouldShowCode ? copyBtnClicked() : createRoom()"
      >
        {{ btnText }}
        <font-awesome-icon
          v-if="shouldShowCode && !copyClicked"
          :icon="['fas', 'copy']"
        />
      </button>
    </div>
    <NuxtLink v-if="showBrowseLink" to="/gallery"
      >Pick a video to watch <font-awesome-icon :icon="['fas', 'video']"
    /></NuxtLink>
    <!-- <div class="block">
      <button
        v-if="showBrowseButton"
        class="rounded bg-transparent p-2 m-auto text-gray-800 hover:text-black w-64"
        @click="browseVideos()"
      >
        Pick a video to watch
        <font-awesome-icon :icon="['fas', 'video']" />
      </button>
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      username: null,
      btnText: "Create a private watch party",
      isCreatingRoom: false,
      shouldShowCode: false,
      copyClicked: null,
      baseShareLink: null,
      showBrowseLink: false
    };
  },
  created() {
    if (process.browser) {
      console.log("this is a browser");
      this.baseShareLink = window.location.href + "room/";
    }
  },
  computed: {
    ...mapGetters(["showShareableCodeStatus", "watchPartyRoomCode"]),
    btnDisabled() {
      return (
        (this.username == null || this.isCreatingRoom) && !this.shouldShowCode
      );
    }
  },
  watch: {
    showShareableCodeStatus: function(newStatus, oldStatus) {
      console.log("ok ready" + newStatus + oldStatus);
      this.shouldShowCode = newStatus;
      if (newStatus) {
        this.btnText = "Copy shareable link";
      }
    }
  },
  methods: {
    ...mapActions([
      "instantiateAbly",
      "generateWatchPartyCode",
      "disconnectAbly"
    ]),
    createRoom() {
      console.log("creating..");
      this.btnText = "Creating your watch party...";
      this.isCreatingRoom = true;
      this.instantiateAbly(this.username);
      this.generateWatchPartyCode();
    },
    copyBtnClicked() {
      this.copyClicked = true;
      this.showBrowseLink = true;
      this.btnText = "Copied !";
      setTimeout(() => {
        this.copyClicked = false;
        this.btnText = "Copy shareable link";
      }, 2000);
      navigator.clipboard.writeText(
        this.baseShareLink + this.watchPartyRoomCode
      );
    }
  },
  destroyed() {
    this.disconnectAbly();
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
