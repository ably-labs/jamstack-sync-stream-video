<template>
  <div class="m-5">
    <div class="flex justify-end mt-2 mb-2">
      <button
        class="rounded bg-gray-800 p-2 text-white hover:bg-gray-900 w-64"
        @click="copyBtnClicked()"
      >
        {{ btnText }}
        <font-awesome-icon :icon="['fas', 'copy']" />
      </button>
    </div>
    <div class="grid grid-cols-3 gap-4 ">
      <div v-for="index in 10" :key="index" class="text-left border-2 rounded">
        <img
          src="../assets/vid-thumbnail.png"
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
              chosenVideoLink: 'someLinktodo'
            }
          }"
        >
          <p class="text-base text-gray-800 m-3">
            Apollo Command and Service Module Animation
          </p>
        </NuxtLink>
        <p class="text-xs text-gray-600 m-3">
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
      console.log(this.getShareableLink);
      navigator.clipboard.writeText(this.getShareableLink);
    }
  },
  created() {
    this.pathToWatchParty = "room/" + this.getWatchPartyRoomCode;
  }
};
</script>
