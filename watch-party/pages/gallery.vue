<template>
  <div class="m-5">
    <div class="copy-code-section">
      <button class="action-btn" @click="copyBtnClicked()">
        {{ btnText }}
        <font-awesome-icon :icon="['fas', 'copy']" />
      </button>
    </div>
    <div class="video-gallery">
      <div v-for="index in 10" :key="index" class="video-block">
        <img
          src="../assets/vid-thumbnail.png"
          alt="Video thumbnail"
          width="500"
          height="600"
          class="thumbnail-img"
        />

        <NuxtLink
          :to="{
            path: pathToWatchParty,
            query: {
              chosenVidType: 'db',
              chosenVidCode: '1234',
              chosenVideoLink: 'someLinktodo'
            }
          }"
        >
          <p class="video-title">
            Apollo Command and Service Module Animation
          </p>
        </NuxtLink>
        <p class="video-description">
          Animation of the Command and Service Module (CSM) of the Apollo space
          program, spinning against an animated background of the world.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      copyClicked: null,
      btnText: "Copy shareable link",
      pathToWatchParty: null
    };
  },
  computed: {
    ...mapGetters(["getShareableLink", "getWatchPartyRoomCode"])
  },
  methods: {
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
    this.pathToWatchParty = "room/" + this.getWatchPartyRoomCode;
  }
};
</script>

<style scoped lang="postcss">
.action-btn {
  @apply rounded bg-gray-800 p-2 text-white w-64;
}

.action-btn:hover {
  @apply bg-gray-900;
}

.copy-code-section {
  @apply flex justify-end mt-2 mb-2;
}

.video-gallery {
  @apply grid grid-cols-1 gap-4;
}

.video-block {
  @apply text-left border-2 rounded;
}

.video-title {
  @apply text-base text-gray-800 m-3;
}

.video-description {
  @apply text-xs text-gray-600 m-3;
}
.thumbnail-img {
  width: 100%;
}
@screen sm {
  .video-gallery {
    @apply grid-cols-2;
  }
}

@screen md {
  .video-gallery {
    @apply grid-cols-3;
  }
}
</style>
