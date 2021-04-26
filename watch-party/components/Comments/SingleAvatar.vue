<template>
  <div class="single-avatar-block">
    <font-awesome-icon class="avatar " :icon="['fas', 'user-circle']" />
    <div class="green-online-circle"></div>
    <div class="username">{{ username }}</div>
  </div>
</template>

<script>
export default {
  name: "SingleAvatar",
  props: ["clientId", "username", "isAdmin"]
};
</script>

<style scoped lang="postcss">
.single-avatar-block {
  @apply p-4 w-full flex relative;
}

.avatar {
  @apply my-auto h-8 w-10;
}
.username {
  @apply text-lg p-2;
}

.comment-subtext {
  @apply flex justify-end text-xs text-gray-600;
}
.green-online-circle {
  @apply absolute h-3 w-3 my-2 border-2 border-white rounded-full bg-green-400;
}
</style>
