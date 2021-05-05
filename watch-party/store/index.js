import Vuex from "vuex";
import * as Ably from "ably";

const createStore = () => {
  return new Vuex.Store({
    state: {
      ablyRealtimeInstance: null,
      isAblyConnected: false,
      ablyClientId: null,
      watchPartyRoomCode: null,
      shouldShowShareableCodeStatus: false,
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
      channelMessages: {
        mainPartyChMsg: null,
        commentsChMsg: null,
        videoChMsg: null
      },
      username: null,
      isAdmin: false,
      shareableLink: null,
      presenceCount: 0,
      didAdminChooseVideo: false,
      chosenVideoRef: null,
      didAdminLeave: false,
      onlineMembersArr: [],
      currentVideoStatus: {
        isVideoChosen: false,
        didStartPlayingVideo: false,
        chosenVideoUrl: null,
        chosenVideoRef: null,
        chosenVideoThumb: null,
        currentTime: null,
        isPlaying: false,
        isPaused: false
      },
      videoPlayerInstance: null,
      defaultVideoPlayerOptions: {
        //player configuration ml-6 w-11/12 container
        muted: false, //whether to mute
        language: "en",
        fluid: true,
        // width: "550px",
        // height: "300px",
        liveui: true,
        playbackRates: [0.7, 1.0, 1.5, 2.0], //Playback speed
        sources: [
          {
            type: "video/mp4",
            src:
              "https://res.cloudinary.com/dlaq5yfxp/video/upload/v1618305819/150716YesMen_synd_768k_vp8_w0dpbg.webm"
          }
        ],
        poster:
          "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg" //Cover image
      }
    },
    getters: {
      getShouldShowShareableCodeStatus: state =>
        state.shouldShowShareableCodeStatus,
      getWatchPartyRoomCode: state => state.watchPartyRoomCode,
      getShareableLink: state => state.shareableLink,
      getIsAdminStatus: state => state.isAdmin,
      getPartyChInstance: state => state.channelInstances.mainParty,
      getCommentsChInstance: state => state.channelInstances.comments,
      getVideoChInstance: state => state.channelInstances.video,
      getMainPartyChMessage: state => state.channelMessages.mainPartyChMsg,
      getCommentsChMessage: state => state.channelMessages.commentsChMsg,
      getVideoChMessage: state => state.channelMessages.videoChMsg,
      getIsAblyConnectedStatus: state => state.isAblyConnected,
      getPresenceCount: state => state.presenceCount,
      getUsername: state => state.username,
      getDidAdminChooseVideoStatus: state => state.didAdminChooseVideo,
      getChosenVideoRef: state => state.currentVideoStatus.chosenVideoRef,
      getChosenVideoUrl: state => state.currentVideoStatus.chosenVideoUrl,
      getChosenVideoThumb: state => state.currentVideoStatus.chosenVideoThumb,
      getDidAdminLeaveStatus: state => state.didAdminLeave,
      getCurrentVideoStatus: state => state.currentVideoStatus,
      getOnlineMembersArr: state => state.onlineMembersArr,
      getLatestVideoPlayerOptions: state => {
        let latestVideoPlayerOptions = state.defaultVideoPlayerOptions;
        latestVideoPlayerOptions.sources.src =
          "http://localhost:1337" + state.currentVideoStatus.chosenVideoUrl;
        latestVideoPlayerOptions.poster =
          "http://localhost:1337" + state.currentVideoStatus.chosenVideoThumb;
        return latestVideoPlayerOptions;
      }
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
      setIsAdminStatus(state, isAdmin) {
        state.isAdmin = isAdmin;
      },
      setAblyChannelInstances(state, { mainParty, comments, video }) {
        state.channelInstances.mainParty = mainParty;
        state.channelInstances.comments = comments;
        state.channelInstances.video = video;
      },
      setShouldShowCodeStatus(state, status) {
        state.shouldShowShareableCodeStatus = status;
      },
      setShareableLink(state, link) {
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
      setOnlineMembersArrInsert(state, memberObj) {
        state.onlineMembersArr.push(memberObj);
      },
      setOnlineMembersArrRemoval(state, clientId) {
        state.onlineMembersArr.splice(
          state.onlineMembersArr.findIndex(
            presenceEntry => presenceEntry.id === clientId
          ),
          1
        );
      },
      setVideoStatusUpdate(state, statusObj) {
        for (const key in statusObj) {
          state.currentVideoStatus[key] = statusObj[key];
        }
      },
      setVideoPlayerInstance(state, instance) {
        state.videoPlayerInstance = instance;
      }
    },

    actions: {
      //Ably init
      instantiateAbly(vueContext, { username, isAdmin }) {
        const ablyInstance = new Ably.Realtime({
          authUrl: "https://ably-auth.glitch.me/auth"
          //          echoMessages: false
        });
        ablyInstance.connection.once("connected", () => {
          vueContext.commit("setAblyConnectionStatus", true);
          vueContext.commit("setAblyRealtimeInstance", ablyInstance);
          vueContext.commit(
            "setAblyClientId",
            this.state.ablyRealtimeInstance.auth.clientId
          );
          vueContext.commit("setUsername", username);
          vueContext.commit("setIsAdminStatus", isAdmin);
          if (isAdmin) {
            vueContext.dispatch("generateWatchPartyCode");
          }
          vueContext.dispatch("attachToAblyChannels", isAdmin);
          vueContext.dispatch("getExistingAblyPresenceSet");
          vueContext.dispatch("subscribeToAblyPresence");
          vueContext.dispatch("enterClientInAblyPresenceSet");
        });
      },
      attachToAblyChannels(vueContext, isAdmin) {
        //mainPartyChannel
        const mainParty = this.state.ablyRealtimeInstance.channels.get(
          this.state.channelNames.mainParty +
            "-" +
            this.state.watchPartyRoomCode
        );

        //commentsChannel
        const comments = this.state.ablyRealtimeInstance.channels.get(
          this.state.channelNames.comments + "-" + this.state.watchPartyRoomCode
        );

        //videoChannel
        const video = this.state.ablyRealtimeInstance.channels.get(
          this.state.channelNames.video + "-" + this.state.watchPartyRoomCode
        );
        vueContext.commit("setAblyChannelInstances", {
          mainParty,
          comments,
          video
        });

        vueContext.dispatch("subscribeToChannels");
        if (!isAdmin) {
          vueContext.dispatch("requestInitialVideoStatus");
        }
      },

      subscribeToChannels({ state, dispatch }) {
        state.channelInstances.comments.subscribe(msg => {
          state.channelMessages.commentsChMsg = msg;
        });
        state.channelInstances.mainParty.subscribe(msg => {
          state.channelMessages.mainPartyChMsg = msg;
        });
        state.channelInstances.video.subscribe(msg => {
          if (msg.name === "general-status-request" && state.isAdmin) {
            dispatch("publishCurrentVideoStatus", "general-status");
          } else if (!state.isAdmin && msg.name !== "general-status-request") {
            state.channelMessages.videoChMsg = msg;
          }
        });
      },
      publishCurrentVideoStatus({ state }, updateEvent) {
        console.log("ADMIN PUBLISHING", updateEvent);
        state.channelInstances.video.publish(
          updateEvent,
          this.state.currentVideoStatus
        );
      },
      getExistingAblyPresenceSet(vueContext) {
        this.state.channelInstances.mainParty.presence.get((err, members) => {
          if (!err) {
            for (let i = 0; i < members.length; i++) {
              let { username, isAdmin } = members[i].data;
              vueContext.commit("setOnlineMembersArrInsert", {
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
      subscribeToAblyPresence(vueContext) {
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
        vueContext.commit("setPresenceIncrement");
        vueContext.commit("setOnlineMembersArrInsert", {
          id: member.clientId,
          username: member.data.username,
          isAdmin: member.data.isAdmin
        });
      },
      handleExistingMemberLeft(vueContext, member) {
        if (member.data.isAdmin) {
          vueContext.commit("setAdminLeaveStatus");
        } else {
          vueContext.commit("setOnlineMembersArrRemoval", member.id);
          vueContext.commit("setPresenceDecrement");
        }
      },
      enterClientInAblyPresenceSet(vueContext) {
        this.state.channelInstances.mainParty.presence.enter({
          username: this.state.username,
          isAdmin: this.state.isAdmin
        });
        if (this.state.isAdmin) {
          vueContext.dispatch("showShareableCode");
        }
      },
      requestInitialVideoStatus({ state }) {
        state.channelInstances.video.publish(
          "general-status-request",
          "request"
        );
      },
      publishMyCommentToAbly({ state }, commentMsg) {
        state.channelInstances.comments.publish("comment", {
          username: state.username,
          content: commentMsg
        });
      },
      //Utility methods
      showShareableCode(vueContext) {
        vueContext.commit("setShouldShowCodeStatus", true);
      },
      generateWatchPartyCode(vueContext) {
        const uniqueCode = Math.random()
          .toString(36)
          .substr(2, 16);
        vueContext.commit("setWatchPartyRoomCode", uniqueCode);
      }
    }
  });
};

export default createStore;
