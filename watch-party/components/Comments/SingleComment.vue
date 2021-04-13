<template>
  <div class="p-2 border-b-2 border-gray-300 w-full">
    <div class="text-base">{{ message }}</div>
    <div class="flex justify-end text-xs text-gray-600">
      at {{ timestamp }} by {{ username }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SingleComment",
  props: ["message", "timestamp", "username"]
};
</script>

<style scoped></style>
