<template>
  <div class="container">
    <button
      class="bg-gray-800 p-2 m-auto text-white hover:bg-gray-900"
      @click="createRoom"
    >
      Create a private watch party
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  created() {
    console.log("first this");
    this.instantiateAbly();
  },
  computed: {
    ...mapGetters([""])
  },
  methods: {
    ...mapActions(["instantiateAbly", "generateWatchPartyCode"]),
    createRoom() {
      this.generateWatchPartyCode();
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
