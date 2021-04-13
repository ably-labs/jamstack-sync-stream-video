<template>
  <div class="ml-6 text-gray-700 h-16 text-left flex justify-between w-full">
    <div class="w-9/12 text-2xl font-semibold ml-0 mt-auto mb-auto">
      LIVE WATCH PARTY WITH ABLY AND STRAPI
    </div>
    <div class="m-auto w-3/12">{{ getPresenceCount }} people watching</div>
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

<style scoped></style>
