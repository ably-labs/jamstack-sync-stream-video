<template>
  <div class="m-5">
    <p class="gallery-msg">
      Pick a video you'd like to stream with friends. Either choose from the
      gallery or paste a YouTube link
    </p>
    <div class="gallery-header">
      <div class="youtube-input">
        <input
          type="text"
          class="url-input"
          placeholder="YouTube video URL"
          v-model="youtubeVideoLink"
        />
        <NuxtLink
          :to="{
            path: 'room',
            query: {
              chosenVidType: 'youtube',
              chosenVidRef: '',
              chosenVidCode: '1234',
              chosenVideoLink: 'someLinktodo',
              roomCode: getWatchPartyRoomCode,
              chosenVidUrl: youtubeVideoLink,
              chosenVidThumb: ''
            }
          }"
        >
          <button class="load-btn">
            LOAD
          </button>
        </NuxtLink>
      </div>
      <div class="copy-code-section">
        <button class="action-btn" @click="copyBtnClicked()">
          {{ btnText }}
          <font-awesome-icon :icon="['fas', 'copy']" />
        </button>
      </div>
    </div>
    <div class="video-gallery">
      <div v-for="video in videos" :key="video.id" class="video-block">
        <img
          :src="video.thumbnail.url"
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
              chosenVidRef: video.id,
              chosenVidCode: '1234',
              chosenVideoLink: 'someLinktodo',
              roomCode: getWatchPartyRoomCode,
              chosenVidUrl: video.video.url,
              chosenVidThumb: video.thumbnail.url
            }
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
      youtubeVideoLink: null,
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
.gallery-header {
  @apply text-left justify-between;
}
.youtube-input {
  @apply my-2 text-xs w-full flex;
}
.url-input {
  @apply block w-full rounded bg-gray-100 border border-gray-500;
}
.load-btn {
  @apply rounded bg-gray-800 p-1 h-full text-white w-40 text-xs;
}
.load-btn:hover {
  @apply bg-gray-900;
}
.action-btn {
  @apply rounded bg-gray-800 p-1 text-white w-40 text-xs;
}

.action-btn:hover {
  @apply bg-gray-900;
}

.copy-code-section {
  @apply mt-2 mb-2;
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
  .youtube-input {
    @apply w-3/5 mr-2 text-sm;
  }
  .video-gallery {
    @apply grid-cols-2;
  }
  .action-btn {
    @apply w-64;
  }
  .gallery-header {
    @apply flex;
  }
  .copy-code-section {
    @apply flex justify-end;
  }
}

@screen md {
  .video-gallery {
    @apply grid-cols-3;
  }

  .action-btn {
    @apply rounded bg-gray-800 p-2 text-white w-64 text-base;
  }

  .load-btn {
    @apply text-base;
  }

  .gallery-header {
    @apply flex text-center justify-between;
  }

  .youtube-input {
    @apply py-2 my-auto text-base text-left;
  }
}
</style>
