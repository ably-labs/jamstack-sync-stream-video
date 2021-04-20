<template>
  <div class="m-5">
    <div class="copy-code-section">
      <button class="action-btn" @click="copyBtnClicked()">
        {{ btnText }}
        <font-awesome-icon :icon="['fas', 'copy']" />
      </button>
    </div>
    <div class="video-gallery">
      <div v-for="video in videos" :key="video.id" class="video-block">
        <img
          :src="'http://localhost:1337' + video.thumbnail.url"
          alt="Video thumbnail"
          width="500"
          height="600"
        />

        <NuxtLink
          :to="{
            path: pathToWatchParty,
            query: {
              chosenVidType: 'db',
              chosenVidCode: '1234',
              chosenVideoLink: 'someLinktodo',
            },
          }"
        >
          <p class="video-title">{{ video.title }}</p>
        </NuxtLink>
        <p class="video-description">
          {{ video.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import gql from "graphql-tag";

export default {
  data() {
    return {
      copyClicked: null,
      btnText: "Copy shareable link",
      pathToWatchParty: null,
      videos: []
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
  apollo: {
    videos: {
      query: gql`
        query {
          videos {
            id
            title
            thumbnail {
              url
            }
            description
            video {
              url
            }
          }
        }
      `
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
  @apply grid grid-cols-3 gap-4;
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
</style>
