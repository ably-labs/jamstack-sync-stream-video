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
        comments: "comments",
        video: "video"
      },
      channelInstances: {
        mainParty: null,
        comments: null,
        video: null
      },
      username: null,
      isAdmin: false,
      shareableLink: null,
      presenceCount: 0,
      didAdminChooseVideo: false,
      chosenVideoRef: null,
      didAdminLeave: false,
      onlineMembersArr: []
    },

    getters: {
      showShareableCodeStatus: state => state.showShareableCodeStatus,
      getWatchPartyRoomCode: state => state.watchPartyRoomCode,
      getShareableLink: state => state.shareableLink,
      getAdminStatus: state => state.isAdmin,
      getPartyChInstance: state => state.channelInstances.mainParty,
      getCommentsChInstance: state => state.channelInstances.comments,
      getVideoChInstance: state => state.channelInstances.video,
      getAblyConnectionStatus: state => state.isAblyConnected,
      getPresenceCount: state => state.presenceCount,
      getUsername: state => state.username,
      getSelectedVideoStatus: state => state.didAdminChooseVideo,
      getSelectedVideoRef: state => state.chosenVideoRef,
      getAdminLeaveStatus: state => state.didAdminLeave
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
      setAblyChannelInstances(state, { mainParty, comments, video }) {
        state.channelInstances.mainParty = mainParty;
        state.channelInstances.comments = comments;
        state.channelInstances.video = video;
      },
      setShowCodeStatus(state, status) {
        state.showShareableCodeStatus = status;
      },
      setShareableLink(state, link) {
        console.log(link);
        state.shareableLink = link;
      },
      setPresenceCount(state, count) {
        state.presenceCount = count;
      },
      setPresenceIncrement(state) {
        state.presenceCount++;
      },
      setPresenceDecrement(state) {
        state.presenceCount--;
      },
      setAdminLeaveStatus(state) {
        state.didAdminLeave = true;
      },
      addToOnlineMembersArr(state, memberObj) {
        state.onlineMembersArr.push(memberObj);
      },
      removeFromOnlineMembersArr(state, clientId) {
        state.onlineMembersArr.splice(
          state.onlineMembersArr.findIndex(
            presenceEntry => presenceEntry.id === clientId
          ),
          1
        );
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
          if (isAdmin) {
            vueContext.dispatch("generateWatchPartyCode");
          }
          vueContext.dispatch("attachToChannels");
          vueContext.dispatch("getExistingPresenceSet");
          vueContext.dispatch("subscribeToPresence");
          vueContext.dispatch("enterClientInPresenceSet");
        });
      },
      attachToChannels(vueContext) {
        const mainParty = this.state.ablyRealtimeInstance.channels.get(
          this.state.channelNames.mainParty +
            "-" +
            this.state.watchPartyRoomCode
        );

        const comments = this.state.ablyRealtimeInstance.channels.get(
          this.state.channelNames.comments + "-" + this.state.watchPartyRoomCode
        );
        console.log(comments);
        const video = this.state.ablyRealtimeInstance.channels.get(
          this.state.channelNames.video + "-" + this.state.watchPartyRoomCode
        );
        vueContext.commit("setAblyChannelInstances", {
          mainParty,
          comments,
          video
        });
      },
      getExistingPresenceSet(vueContext) {
        this.state.channelInstances.mainParty.presence.get((err, members) => {
          if (!err) {
            for (let i = 0; i < members.length; i++) {
              let { username, isAdmin } = members[i].data;
              vueContext.commit("addToOnlineMembersArr", {
                clientId: members[i].clientId,
                username,
                isAdmin
              });
            }
            vueContext.commit("setPresenceCount", members.length);
          } else {
            console.log(err);
          }
        });
      },
      subscribeToPresence(vueContext) {
        this.state.channelInstances.mainParty.presence.subscribe(
          "enter",
          msg => {
            vueContext.dispatch("handleNewMemberEntered", msg);
          }
        );
        this.state.channelInstances.mainParty.presence.subscribe(
          "leave",
          msg => {
            vueContext.dispatch("handleExistingMemberLeft", msg);
          }
        );
      },
      handleNewMemberEntered(vueContext, member) {
        console.log("before adding", vueContext.state.onlineMembersArr);
        vueContext.commit("setPresenceIncrement");
        vueContext.commit("addToOnlineMembersArr", {
          id: member.clientId,
          username: member.data.username,
          isAdmin: member.data.isAdmin
        });
        console.log("after adding", vueContext.state.onlineMembersArr);
      },
      handleExistingMemberLeft(vueContext, member) {
        if (member.data.isAdmin) {
          vueContext.commit("setAdminLeaveStatus");
        } else {
          console.log("before removing", vueContext.state.onlineMembersArr);
          vueContext.commit("removeFromOnlineMembersArr", member.id);
          console.log("after removing", vueContext.state.onlineMembersArr);
          vueContext.commit("setPresenceDecrement");
        }
      },
      enterClientInPresenceSet(vueContext) {
        console.log("entering");
        this.state.channelInstances.mainParty.presence.enter({
          username: this.state.username,
          isAdmin: this.state.isAdmin
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
      },
      setChosenVideoDetails(vueContext) {
        console.log("alkbj");
      }
    }
  });
};

export default createStore;
