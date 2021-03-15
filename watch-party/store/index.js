import Vuex from "vuex";
import * as Ably from "ably";

const createStore = () => {
  return new Vuex.Store({
    state: {
      ablyRealtimeInstance: null,
      isAblyConnected: false,
      ablyClientId: null,
      watchPartyRoomCode: null,
      commonChannelNames: ["comments", "reactions"],
      hostChannelNames: ["adminControl"]
    },

    getters: {},

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
      }
    },

    actions: {
      instantiateAbly(vueContext) {
        const ablyInstance = new Ably.Realtime({
          authUrl: "https://ably-auth.glitch.me/auth"
        });
        ablyInstance.connection.once("connected", () => {
          vueContext.commit("setAblyConnectionStatus", true);
          vueContext.commit("setAblyRealtimeInstance", ablyInstance);
          vueContext.commit(
            "setAblyClientId",
            this.state.ablyRealtimeInstance.auth.clientId
          );
        });
      },
      generateWatchPartyCode(vueContext) {
        const uniqueCode =
          "room-" +
          Math.random()
            .toString(36)
            .substr(2, 16);
        vueContext.commit("setWatchPartyRoomCode", uniqueCode);
      }
    }
  });
};

export default createStore;
