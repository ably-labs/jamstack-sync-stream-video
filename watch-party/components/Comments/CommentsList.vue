<template>
  <div
    class="pl-4 pt-6 pb-6 pr-6 ml-2 text-gray-700 text-left w-full min-h-screen"
  >
    <div class="w-9/12 text-2xl font-semibold">
      LIVE COMMENTS
    </div>
    <div
      class="mt-3 border border-gray-500 rounded rounded-b-none comments-box overflow-y-scroll"
    >
      <ul>
        <li v-for="item in commLoop" :key="item">
          <SingleComment></SingleComment>
        </li>
      </ul>
    </div>
    <div
      class="bottom-0 border-t-0 border border-gray-500 flex justify-start rounded rounded-t-none"
    >
      <div class="p-2.5 w-10/12">
        <input
          type="text"
          class="block w-full rounded bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
          placeholder="Enter a comment..."
        />
      </div>
      <div class="">
        <button class="bg-gray-800 p-2 m-auto text-white hover:bg-gray-900">
          SEND
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SingleComment from "/components/Comments/SingleComment.vue";

export default {
  name: "CommentsList",
  components: {
    SingleComment
  },
  data() {
    return {
      commLoop: [1, 2, 3, 4, 5, 6, 7, 8]
    };
  }
};
</script>

<style scoped>
.comments-box {
  min-height: 80vh;
  max-height: 80vh;
}
</style>
