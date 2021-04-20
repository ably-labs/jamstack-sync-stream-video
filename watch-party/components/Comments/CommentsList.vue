<template>
  <div class="comment-list-section">
    <div class="comments-header">
      LIVE COMMENTS
    </div>
    <div class="comments" ref="commentsBox">
      <ul>
        <li v-for="comment in commentsArray" :key="comment.msgId">
          <SingleComment
            :message="comment.content"
            :timestamp="comment.timestamp"
            :username="comment.username"
          ></SingleComment>
        </li>
      </ul>
    </div>
    <div class="comment-input-section">
      <div class="p-2.5 w-10/12">
        <input
          type="text"
          class="comment-input"
          placeholder="Enter a comment..."
          v-model="commentMsg"
          @keyup.enter="publishMessage()"
        />
      </div>
      <div class="">
        <button class="comment-send-btn" @click="publishMessage()">
          SEND
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SingleComment from "/components/Comments/SingleComment.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CommentsList",
  components: {
    SingleComment
  },
  data() {
    return {
      commentMsg: "",
      commentsArray: [],
      messageTime12HrFormat: null,
      messageTime24HrFormat: null
    };
  },
  computed: {
    ...mapGetters(["getCommentsChMessage"])
  },
  watch: {
    getCommentsChMessage: function(msg) {
      this.handleNewComment(msg);
    }
  },
  methods: {
    ...mapActions(["publishMyCommentToAbly"]),
    publishMessage() {
      this.publishMyCommentToAbly(this.commentMsg);
      this.commentMsg = "";
    },
    async handleNewComment(msg) {
      const username = msg.data.username;
      const content = msg.data.content;
      const timestamp = this.formatTime(msg.timestamp);
      const msgId = msg.id;
      await this.commentsArray.push({
        username,
        content,
        timestamp,
        msgId
      });
      const divScrollHeight = this.$refs.commentsBox.scrollHeight;
      this.$refs.commentsBox.scrollTop = divScrollHeight;
    },
    formatTime(timestamp) {
      const messageTime24HrFormat = new Date(timestamp);
      let hours = messageTime24HrFormat.getHours();
      let minutes = messageTime24HrFormat.getMinutes();
      minutes = (minutes < 10 ? "0" : "") + minutes;
      let ampm = hours < 12 ? "am" : "pm";
      hours = hours % 12 || 12;
      this.messageTime12HrFormat = `${hours}:${minutes} ${ampm}`;
      return this.messageTime12HrFormat;
    }
  },
  created() {}
};
</script>

<style scoped lang="postcss">
.comments-box {
  min-height: 80vh;
  max-height: 80vh;
}

.comment-list-section {
  @apply pl-4 pt-6 pb-6 pr-6 ml-2 text-gray-700 text-left w-full min-h-screen;
}

.comments-header {
  @apply w-9/12 text-2xl font-semibold;
}

.comments {
  @apply mt-3 border border-gray-500 rounded rounded-b-none comments-box overflow-y-scroll;
}

.comment-input-section {
  @apply bottom-0 border-t-0 border border-gray-500 flex justify-start rounded rounded-t-none;
}

.comment-input {
  @apply block w-full rounded bg-gray-100 border-transparent;
}

.comment-input:focus {
  @apply border-gray-500 bg-white;
}

.comment-send-btn {
  @apply bg-gray-800 p-2 m-auto text-white;
}

.comment-send-btn:hover {
  @apply bg-gray-900;
}
</style>
