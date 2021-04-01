<template>
  <div class="grid grid-cols-3 gap-4 m-5">
    <div v-for="index in 10" :key="index" class="text-left border-2 rounded">
      <img
        src="../assets/vid-thumbnail.png"
        alt="Video thumbnail"
        width="500"
        height="600"
      />
      <p class="text-base text-gray-800 m-3">
        Apollo Command and Service Module Animation
      </p>
      <p class="text-xs text-gray-600 m-3">
        Animation of the Command and Service Module (CSM) of the Apollo space
        program, spinning against an animated background of the world.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {}
};
</script>
