const getters = {
  /* alert.js */
  toastMessage: state => state.alert.toastMessage,



  /* app.js */
  test: state => state.app.test,
  device: state => state.app.device,




  /* blind.js */
  blindStatus: state => state.blind.blindStatus,
  blindMessageList: state => state.blind.blindMessageList,
  leaveMessage: state => state.blind.leaveMessage,
  topicIndex: state => state.blind.topicIndex,



  /* chat.js */
  selectedFrinedsForNewChat: state => state.chat.selectedFrinedsForNewChat,
  chatRoomList: state => state.chat.chatRoomList,
  messageList: state => state.chat.messageList,


  currentChatRoomPage: state => state.chat.currentChatRoomPage,
  previousChatRoomPage: state => state.chat.previousChatRoomPage,

  reply_uuid: state => state.chat.reply_uuid,
  ingEventElement: state => state.chat.ingEventElement,
  currentScollPosition: state => state.chat.currentScollPosition,
  
  zoomImageSrc: state => state.chat.zoomImageSrc,


  /* friends.js */
  friends: state => state.friends.friends,
  profileInfo: state => state.friends.profileInfo,
  blockList: state => state.friends.blockList,
  isChangeNotification: state => state.friends.isChangeNotification,



  /* public.js */
  publicInfo: state => state.public.publicInfo,
  currentPublicInfo: state => state.public.currentPublicInfo,
  blockWords: state => state.public.blockWords,
  publicMessageList: state => state.public.publicMessageList,
  publicSettingInfo: state => state.public.publicSettingInfo,
  msgMoreSetting: state => state.public.msgMoreSetting,
  


  /* settings.js */
  myInfo: state => state.settings.myInfo,
  mySetting: state => state.settings.mySetting,

  header: state => state.settings.header,
  bottom: state => state.settings.bottom,
  effect: state => state.settings.effect,
  
  actionElementActive: state => state.settings.actionElementActive,
  actionElementValue: state => state.settings.actionElementValue,
  bottomActive: state => state.settings.bottomActive,
  bottomMatchHidden: state => state.settings.bottomMatchHidden,

  addImage: state => state.settings.addImage,
  destroyZoom: state => state.settings.destroyZoom,
}


export default getters
