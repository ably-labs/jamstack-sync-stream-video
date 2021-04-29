<template>
  <div class="video-header-section">
    <div class="video-header-title">
      LIVE WATCH PARTY WITH ABLY AND STRAPI
    </div>
    <div class="presence-stats">
      <div class="green-online-circle"></div>
      <div class="presence-count">{{ getPresenceCount }} people watching</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "VideoHeader",
  computed: {
    ...mapGetters(["getPresenceCount"])
  }
};
</script>

<style scoped lang="postcss">
.video-header-section {
  @apply text-gray-700 text-left flex justify-between w-full;
}

.video-header-title {
  @apply text-sm font-semibold my-1;
}

.presence-stats {
  @apply my-1 text-xs w-2/6 flex justify-end;
}

.green-online-circle {
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  @apply h-2 w-2 border-2 border-white rounded-full bg-green-400;
}

.presence-count {
  @apply ml-2;
}

@screen md {
  .video-header-section {
    @apply mb-2;
  }

  .video-header-title {
    @apply text-base my-5 w-3/4;
  }
  .presence-stats {
    @apply text-base my-5 w-1/4;
  }
  .green-online-circle {
    @apply h-3 w-3 my-2 border-2 border-white rounded-full bg-green-400;
  }
}

@screen lg {
  .video-header-title {
    @apply text-lg;
  }
  .presence-stats {
    @apply text-base;
  }
  .green-online-circle {
    @apply h-3 w-3 my-2 border-2 border-white rounded-full bg-green-400;
  }
}
</style>
