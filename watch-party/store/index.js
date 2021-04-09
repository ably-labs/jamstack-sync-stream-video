import Vuex from "vuex";
import * as Ably from "ably";

const createStore = () => {
  return new Vuex.Store({
    state: {
      ablyRealtimeInstance: null,
      isAblyConnected: false,
      ablyClientId: null,
      watchPartyRoomCode: null,
      showShareableCodeStatus: false,
      channelNames: {
        mainParty: "partych",
        comments: "comments"
      },
      channelInstances: {
        mainParty: null,
        comments: null
      },
      username: null,
      isAdmin: false,
      shareableLink: null,
      presenceCount: 0,
      didAdminChooseVideo: false,
      chosenVideoRef: null
    },

    getters: {
      showShareableCodeStatus: state => state.showShareableCodeStatus,
      getWatchPartyRoomCode: state => state.watchPartyRoomCode,
      getShareableLink: state => state.shareableLink,
      getAdminStatus: state => state.isAdmin,
      getPartyChInstance: state => state.channelInstances.mainParty,
      getCommentsChInstance: state => state.channelInstances.comments,
      getAblyConnectionStatus: state => state.isAblyConnected,
      getPresenceCount: state => state.presenceCount,
      getUsername: state => state.username,
      getSelectedVideoStatus: state => state.didAdminChooseVideo,
      getSelectedVideoRef: state => state.chosenVideoRef
    },

    mutations: {
      setAblyRealtimeInstance(state, ablyInstance) {
        state.ablyRealtimeInstance = ablyInstance;
      },
      setAblyConnectionStatus(state, status) {
        state.isAblyConnected = status;
      },
      setAblyClientId(state, id) {
        state.ablyClientId = id;
      },
      setWatchPartyRoomCode(state, code) {
        state.watchPartyRoomCode = code;
      },
      setUsername(state, username) {
        state.username = username;
      },
      setAdminStatus(state, isAdmin) {
        state.isAdmin = isAdmin;
      },
      setAblyChannelInstances(state, { mainParty, comments }) {
        state.channelInstances.mainParty = mainParty;
        state.channelInstances.comments = comments;
      },
      setShowCodeStatus(state, status) {
        state.showShareableCodeStatus = status;
      },
      setShareableLink(state, link) {
        console.log(link);
        state.shareableLink = link;
      },
      setPresenceIncrement(state) {
        state.presenceCount++;
      },
      setPresenceDecrement(state) {
        state.presenceCount--;
      }
    },

    actions: {
      instantiateAbly(vueContext, { username, isAdmin }) {
        const ablyInstance = new Ably.Realtime({
          authUrl: "https://ably-auth.glitch.me/auth"
        });
        ablyInstance.connection.once("connected", () => {
          console.log("Ably is connected successfully", isAdmin, username);
          vueContext.commit("setAblyConnectionStatus", true);
          vueContext.commit("setAblyRealtimeInstance", ablyInstance);
          vueContext.commit(
            "setAblyClientId",
            this.state.ablyRealtimeInstance.auth.clientId
          );
          vueContext.commit("setUsername", username);
          vueContext.commit("setAdminStatus", isAdmin);
          vueContext.dispatch("attachToChannels");
          vueContext.dispatch("subscribeToPresence");
          vueContext.dispatch("enterClientInPresenceSet");
        });
      },
      attachToChannels(vueContext) {
        const mainParty = this.state.ablyRealtimeInstance.channels.get(
          this.state.channelNames.mainParty
        );

        const comments = this.state.ablyRealtimeInstance.channels.get(
          this.state.channelNames.comments
        );
        vueContext.commit("setAblyChannelInstances", { mainParty, comments });
      },
      subscribeToPresence(vueContext) {
        this.state.channelInstances.mainParty.presence.subscribe(
          "enter",
          msg => {
            vueContext.commit("setPresenceIncrement");
          }
        );
        this.state.channelInstances.mainParty.presence.subscribe(
          "leave",
          msg => {
            vueContext.commit("setPresenceDecrement");
          }
        );
      },
      enterClientInPresenceSet(vueContext) {
        console.log("entering");
        this.state.channelInstances.mainParty.presence.enter({
          username: this.state.username
        });
        console.log(this.state.isAdmin);
        if (this.state.isAdmin) {
          vueContext.dispatch("showShareableCode");
        }
      },
      showShareableCode(vueContext) {
        console.log("in store");
        vueContext.commit("setShowCodeStatus", true);
      },
      generateWatchPartyCode(vueContext) {
        const uniqueCode = Math.random()
          .toString(36)
          .substr(2, 16);
        vueContext.commit("setWatchPartyRoomCode", uniqueCode);
      },
      disconnectAbly(vueContext) {
        this.state.ablyRealtimeInstance.connection.close();
        vueContext.commit("setAblyConnectionStatus", true);
      }
    }
  });
};

export default createStore;
