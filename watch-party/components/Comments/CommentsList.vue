<template>
  <div class="comment-list-section">
    <div class="flex tab-buttons">
      <button
        :class="{
          'active-tab-btn': isCommentsTabSelected,
          'inactive-tab-btn': isOnlineListTabSelected
        }"
        @click="switchTabTo('comments')"
      >
        Comments
      </button>
      <button
        :class="{
          'active-tab-btn': isOnlineListTabSelected,
          'inactive-tab-btn': isCommentsTabSelected
        }"
        @click="switchTabTo('onlineList')"
      >
        Who's watching?
      </button>
    </div>
    <template v-if="isCommentsTabSelected">
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
        <div class="comment-input-container">
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
    </template>
    <template v-if="isOnlineListTabSelected">
      <div class="comments" ref="commentsBox">
        <ul>
          <li v-for="member in getOnlineMembersArr" :key="member.clientId">
            <SingleAvatar
              :clientId="member.clientId"
              :username="member.username"
              :isAdmin="member.isAdmin"
            ></SingleAvatar>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import SingleComment from "/components/Comments/SingleComment.vue";
import SingleAvatar from "/components/Comments/SingleAvatar.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CommentsList",
  components: {
    SingleComment,
    SingleAvatar
  },
  data() {
    return {
      commentMsg: "",
      commentsArray: [],
      messageTime12HrFormat: null,
      messageTime24HrFormat: null,
      isCommentsTabSelected: true,
      isOnlineListTabSelected: false
    };
  },
  computed: {
    ...mapGetters(["getCommentsChMessage", "getOnlineMembersArr"])
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
      this.messageTime12HrFormat = `${hours}:${minutes}${ampm}`;
      return this.messageTime12HrFormat;
    },
    switchTabTo(to) {
      switch (to) {
        case "comments":
          console.log("to comments");
          this.isCommentsTabSelected = true;
          this.isOnlineListTabSelected = false;
          break;
        case "onlineList":
          console.log("to online");
          this.isOnlineListTabSelected = true;
          this.isCommentsTabSelected = false;
          break;
      }
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
  @apply pb-6 pr-5 ml-2 text-gray-700 text-left w-full max-h-full;
}

.comments {
  @apply border border-gray-500 border-t-0 overflow-y-scroll;
  min-height: 40vh;
  max-height: 40vh;
}

.comment-input-section {
  @apply bottom-0 border-t-0 border border-gray-500 flex justify-start rounded rounded-t-none;
}

.comment-input-container {
  @apply w-full;
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

.tab-buttons {
  @apply border border-b-0 border-gray-500 rounded rounded-b-none text-sm;
}

.active-tab-btn {
  @apply bg-gray-800 rounded rounded-b-none p-2 text-white w-1/2;
}

.active-tab-btn:hover {
  @apply bg-gray-900;
}

.inactive-tab-btn {
  @apply bg-gray-300 rounded rounded-b-none p-2 text-gray-800 w-1/2;
}

.inactive-tab-btn:hover {
  @apply bg-gray-400;
}

@screen md {
  .tab-buttons {
    @apply text-base;
  }

  .comment-list-section {
    @apply pl-4 pt-6 pb-6 pr-6 ml-2 min-h-screen;
  }

  .comments {
    @apply border border-gray-500 border-t-0 comments-box overflow-y-scroll;
  }
}
</style>
