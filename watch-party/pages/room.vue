<template>
  <div class="flex h-screen max-w-full bg-orange-900">
    <div class="p-6 w-9/12 bg-gray-200 rounded">
      <VideoHeader />
      <VideoPlayer />
    </div>
    <div class="w-1/4 overflow-hidden bg-yellow-500 rounded">
      <CommentsList />
    </div>
  </div>
</template>

<script>
import VideoHeader from "../components/Video/VideoHeader.vue";
import VideoPlayer from "../components/Video/VideoPlayer.vue";
import CommentsList from "../components/Comments/CommentsList.vue";
export default {};
</script>
