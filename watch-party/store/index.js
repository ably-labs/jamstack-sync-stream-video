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
        mainParty: "partych"
      },
      channelInstances: {
        mainParty: null
      },
      username: null
    },

    getters: {
      showShareableCodeStatus: state => state.showShareableCodeStatus,
      watchPartyRoomCode: state => state.watchPartyRoomCode
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
      setAblyChannelInstances(state, mainParty) {
        state.channelInstances.mainParty = mainParty;
      },
      setShowCodeStatus(state, status) {
        console.log("sldkfj" + status);
        state.showShareableCodeStatus = status;
      }
    },

    actions: {
      instantiateAbly(vueContext, username) {
        const ablyInstance = new Ably.Realtime({
          authUrl: "https://ably-auth.glitch.me/auth"
        });
        ablyInstance.connection.once("connected", () => {
          console.log("Ably is connected successfully");
          vueContext.commit("setAblyConnectionStatus", true);
          vueContext.commit("setAblyRealtimeInstance", ablyInstance);
          vueContext.commit(
            "setAblyClientId",
            this.state.ablyRealtimeInstance.auth.clientId
          );
          vueContext.commit("setUsername", username);
          vueContext.dispatch("attachToChannels");
          vueContext.dispatch("enterClientInPresenceSet");
        });
      },
      attachToChannels(vueContext) {
        const mainParty = this.state.ablyRealtimeInstance.channels.get(
          this.state.channelNames.mainParty
        );
        vueContext.commit("setAblyChannelInstances", mainParty);
      },
      enterClientInPresenceSet(vueContext) {
        this.state.channelInstances.mainParty.presence.enter({
          username: this.state.username
        });
        vueContext.dispatch("showShareableCode");
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
