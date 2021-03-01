<template>
  <div
    class="pl-4 pt-6 pb-6 pr-6 ml-2 text-gray-700 text-left w-full bg-gray-600"
  >
    <div class="w-9/12 text-2xl font-semibold">
      LIVE COMMENTS
    </div>
    <div class="border border-gray-500 rounded rounded-b-none comment-box">
      <ul class="p-2">
        <li>comments</li>
        <li>comments</li>
        <li>comments</li>
        <li>comments</li>
        <li>comments</li>
        <li>comments</li>
        <li>comments</li>
        <li>comments</li>
        <li>comments</li>
        <li>comments</li>
        <li>comments</li>
      </ul>
    </div>
    <div
      class="bottom-0 border-t-0 border border-gray-500 flex justify-between rounded rounded-t-none"
    >
      <div class="p-2.5">Enter text...</div>
      <div class="pl-2.5 pr-2.5 bg-gray-800">
        <button class="pt-2.5 pb-2.5 text-white">SEND</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentsList"
};
</script>

<style scoped>
.comment-box {
  min-height: 60%;
}
</style>
