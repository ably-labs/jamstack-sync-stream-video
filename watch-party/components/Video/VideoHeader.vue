<template>
  <div class="video-header-section">
    <div class="video-header-title">
      LIVE WATCH PARTY WITH ABLY AND STRAPI
    </div>
    <div class="presence-stats">{{ getPresenceCount }} people watching</div>
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
  @apply ml-6 text-gray-700 h-16 text-left flex justify-between w-full;
}

.video-header-title {
  @apply w-9/12 text-2xl font-semibold ml-0 mt-auto mb-auto;
}

.presence-stats {
  @apply m-auto w-3/12;
}
</style>
