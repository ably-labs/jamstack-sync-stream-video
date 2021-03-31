<template>
  <div class="flex h-screen max-w-full">
    test gallery
  </div>
</template>

<script>
export default {
  created() {
    console.log(this.$route.params.room);
  }
};
</script>
