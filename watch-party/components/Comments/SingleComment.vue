<template>
  <div class="single-comment-block">
    <div class="comment-text">{{ message }}</div>
    <div class="comment-subtext">at {{ timestamp }} by {{ username }}</div>
  </div>
</template>

<script>
export default {
  name: "SingleComment",
  props: ["message", "timestamp", "username"]
};
</script>

<style scoped lang="postcss">
.single-comment-block {
  @apply p-1 border-b-2 border-gray-300 w-full;
}

.comment-text {
  @apply text-base w-full break-words;
}
.comment-subtext {
  @apply flex justify-end text-xs text-gray-600;
}

@screen md {
  .single-comment-block {
    @apply p-2 border-b-2 border-gray-300 w-full;
  }
}
</style>
