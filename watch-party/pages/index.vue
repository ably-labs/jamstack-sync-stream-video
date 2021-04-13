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
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      username: null,
      btnText: "Create a private watch party",
      isCreatingRoom: false,
      shouldShowCode: false,
      copyClicked: null,
      baseShareLink: null,
      showBrowseLink: false,
      isAdmin: null,
      shareableLink: null
    };
  },
  created() {
    if (process.browser) {
      this.baseShareLink = window.location.href + "room/";
    }
  },
  computed: {
    ...mapGetters(["showShareableCodeStatus", "getWatchPartyRoomCode"]),
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
    ...mapMutations(["setShareableLink"]),
    ...mapActions(["instantiateAbly", "disconnectAbly"]),
    createRoom() {
      console.log("creating..");
      this.btnText = "Creating your watch party...";
      this.isCreatingRoom = true;
      this.isAdmin = true;
      this.instantiateAbly({ username: this.username, isAdmin: this.isAdmin });
    },
    copyBtnClicked() {
      this.copyClicked = true;
      this.showBrowseLink = true;
      this.btnText = "Copied !";
      setTimeout(() => {
        this.copyClicked = false;
        this.btnText = "Copy shareable link";
      }, 2000);
      this.shareableLink = this.baseShareLink + this.getWatchPartyRoomCode;
      navigator.clipboard.writeText(this.shareableLink);
      this.setShareableLink(this.shareableLink);
    }
  },
  destroyed() {}
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
