<template>
  <div class="m-5">
    <div class="gallery-header">
      <p class="gallery-msg">
        Choose a video you'd like to stream with friends
      </p>
      <div class="copy-code-section">
        <button class="action-btn" @click="copyBtnClicked()">
          {{ btnText }}
          <font-awesome-icon :icon="['fas', 'copy']" />
        </button>
      </div>
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
            path: 'room',
            query: {
              chosenVidType: 'db',
              chosenVidCode: '1234',
              chosenVideoLink: 'someLinktodo',
              roomCode: getWatchPartyRoomCode
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
      btnText: "Copy shareable link"
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
  }
};
</script>

<style scoped lang="postcss">
.gallery-header {
  @apply flex text-left justify-between;
}

.gallery-msg {
  @apply my-2 text-xs w-40;
}
.action-btn {
  @apply rounded bg-gray-800 p-1 text-white w-40 text-xs;
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
  @apply text-left border-2 border-gray-600 rounded;
}

.video-title {
  @apply text-base font-medium text-black m-3;
}

.video-description {
  @apply text-xs text-gray-800 font-medium m-3;
}
.thumbnail-img {
  width: 100%;
}
@screen sm {
  .gallery-msg {
    @apply w-1/2 text-sm;
  }
  .video-gallery {
    @apply grid-cols-2;
  }
  .action-btn {
    @apply w-64;
  }
}

@screen md {
  .video-gallery {
    @apply grid-cols-3;
  }

  .action-btn {
    @apply rounded bg-gray-800 p-2 text-white w-64 text-base;
  }

  .gallery-header {
    @apply flex text-center justify-between;
  }

  .gallery-msg {
    @apply p-2 my-auto text-base text-left;
  }
}
</style>
