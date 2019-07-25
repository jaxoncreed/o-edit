import { Observable, of } from 'rxjs';

import rdfService from './rdfService';


class ChatService {

  rdf = rdfService;

  friends = [];
  conversations = [];
  messages = [];

  currentChat;

  currentChatFileUri;
  interval;
  inboxDaemonTimer = 3000;

  me;
  other;

  subscriptions = {}

  constructor() {
    this.loadUserData().then(() => {
      this.loadFriends();
      this.loadConversations();
      this.startNotificationsDaemon();
    });

  }

  subscribe(subName, func) {
    if (this.subscriptions[subName]) {
      this.subscriptions[subName].push(func);
    } else {
      this.subscriptions[subName] = [ func ]
    }
  }

  triggerSubscriptions(subName) {
    if (this.subscriptions[subName] && Array.isArray(this.subscriptions[subName])) {
      this.subscriptions[subName].forEach(func => func());
    }
  }

  async loadUserData() {
    await this.rdf.getSession();
    if (!this.rdf.session) {
      return;
    }
    const name = (await this.rdf.getName(this.rdf.session.webId));
    const picUrl = (await this.rdf.getPicture(this.rdf.session.webId));
    this.me = {
      username: await this.getUsernameFromWebID(this.rdf.session.webId),
      name: name ? name.value : 'NoName',
      webId: this.rdf.session.webId,
      photoUrl: picUrl ? picUrl.value : 'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
    };
  }

  /* DEPRECATED
  setupListener() {
    this.rdf.addListener(this.getCurrentDateChatUri(this.currentChannelUri), this.loadMessages);
  }
  */


  getUser() {
    return of(this.me);
  }

  getFriends() {
    return of(this.friends);
  }

  getRawFriends() {
    return this.friends;
  }

  getConversations(){
    return of(this.conversations);
  }
  getCurrentChat() {
    return this.currentChat;
  }

  openChat(chat) {
    if (!this.rdf.session) {
      return;
    }
    if (this.currentChat != null) {
      this.currentChat.isCurrent = false;
    }
    chat.isCurrent = true;
    console.log('Chat selected ' + chat.chatFileUri);
    if (this.currentChat == null || this.currentChat.chatFileUri !== chat.chatFileUri) {
      this.currentChat = chat;
      this.reloadMessages();
    }
    this.triggerSubscriptions('conversations')
  }

  async sendMessage(msg) {
    if (this.currentChat != null) {
      const m = {
        userName: this.me.username,
        message: msg,
        webId: this.me.webId,
        maker: this.me,
        chat: this.currentChat,
        timeSent: new Date()
      };
      m.uri = await this.rdf.appendMessage(await this.getCurrentChatUri(this.currentChat.chatFileUri), m);
      this.addMessage(m);
    } else {
      console.log('No chat selected to send messages');
    }
    this.triggerSubscriptions('messages');
  }

  async deleteMessage(message) {
    message.chat = this.currentChat;
    this.rdf.deleteMessage(await this.getCurrentChatUri(this.currentChat.chatFileUri), message);
    this.messages.splice(this.messages.indexOf(message), 1);
  }

  getMessages() {
    return of(this.messages);
  }

  async loadFriends() {
    await this.rdf.getSession();
    if (!this.rdf.session) {
      return;
    }
    this.rdf.getFriends().then(res => res.map(e => e.value).forEach(async webId => {
      await this.loadPerson(webId)
    }));
  }

  async loadPerson(webId) {
    const name = (await this.rdf.getName(webId));
    const picUrl = (await this.rdf.getPicture(webId));
    this.friends.push({
      username: this.getUsernameFromWebID(webId),
      fullName: name ? name.value : 'NoName',
      webId,
      photoUrl: picUrl ? picUrl.value : 'https://www.pclodge.com/wp-content/uploads/2014/08/placeholder.png'
    });
  }

  async loadConversations() {
    await this.rdf.getSession();
    if (!this.rdf.session) {
      return;
    }
    const convs = await this.rdf.getConversations(this.me.webId);
    await Promise.all(convs.map(async e => {
      const c = {
        chatTitle: await this.rdf.getConversationTitle(e.chatFileUri),
        chatFileUri: e.chatFileUri,
        others: await Promise.all(e.others.map(async other => await this.getUserByWebId(other)))
      };
      this.addConversation(c);
    }));
    this.triggerSubscriptions('conversations');
  }

  addConversation(chat) {
    this.conversations.push(chat);
  }

  async reloadMessages() {
    this.messages.length = 0;
    this.reloadChatData().then(() => this.loadMessages());
    // this.checkInbox().then(() => this.reloadChatData().then(() => this.loadMessages()));
  }

  async reloadConversations() {
    this.conversations.length = 0;
    this.loadConversations();
    // this.checkInbox().then(() => this.reloadChatData().then(() => this.loadMessages()));
  }

  async reloadChatData() {
    console.log('Chat session data reloading...');
    await this.rdf.getSession();
    try {
      this.currentChatFileUri = this.getCurrentChatUri(this.currentChat.chatFileUri);
      await this.rdf.createStructure(this.currentChatFileUri);
    } catch (error) {
      console.error(error)
      console.log('Chat not initialised');

    }
    console.log(`Channel URI [${this.urlLogFilter(this.currentChat.chatFileUri)}] FOUND`);
    console.log(`Chat file URI [${this.urlLogFilter(this.currentChatFileUri)}] FOUND`);

  }

  async loadMessages() {
    console.log(`Getting messages from file [${this.urlLogFilter(this.currentChatFileUri)}]` +
      ` in channel [${this.urlLogFilter(this.currentChat.chatFileUri)}]`);
    await this.rdf.getMessageUrisForFile(this.currentChatFileUri, this.currentChat.chatFileUri).then(async res => {
      await Promise.all(res.map(async el => {
        const maker = await this.rdf.getMessageMaker(el.value, this.currentChatFileUri);
        const m = {
          userName: this.getUsernameFromWebID(maker),
          message: await this.rdf.getMessageContent(el.value, this.currentChatFileUri),
          webId: maker,
          maker: await this.getUserByWebId(maker),
        };
        m.uri = el.value;
        m.timeSent = await this.rdf.getMessageDate(el.value, this.currentChatFileUri);
        this.addMessage(m);
      }));
    });
    this.triggerSubscriptions('messages');
  }

  async getUserByWebId(webId) {
    if (this.me.webId === webId) {
      return this.me;
    }
    for (let i = 0; i < this.friends.length; i++) {
      if (this.friends[i].webId === webId) {
        return this.friends[i];
      }
    }
    await this.loadPerson(webId);
    for (let i = 0; i < this.friends.length; i++) {
      if (this.friends[i].webId === webId) {
        return this.friends[i];
      }
    }
  }

  addMessage(msg) {
    if (!this.messages.find(message => message.uri && (message.uri === msg.uri))) {
      this.messages.push(msg);
    }
  }

  getCurrentChatUri(channelUri) {
    const now = new Date();
    return channelUri + '/' +
      now.getUTCFullYear() + '/' +
      ('0' + (now.getUTCMonth() + 1)).slice(-2) + '/' +
      ('0' + now.getUTCDate()).slice(-2) + '/' + 'chat.ttl';
  }

  getUsernameFromWebID(webId) {
    let username = '';
    if (webId.includes('https://')) {
      username = webId.replace('https://', '');
    } else {
      username = webId.replace('http://', '');
    }
    return username.split('.')[0];
  }

  urlLogFilter(url) {
    try {
      return url.replace('https://josecuriosoalternativo.inrupt.net', '').replace('https://josecurioso.solid.community', '');
    } catch(err) {
      return '';
    }
  }

  async checkInbox() {
    if (!this.rdf.session) {
      return;
    }
    await this.rdf.checkInbox(this.me.webId, this);
  }

  async startNotificationsDaemon() {
    if (!this.rdf.session) {
      return;
    }
    this.interval = setInterval(() => {
      this.checkInbox();
    }, this.inboxDaemonTimer); // Executes checkInbox every this.inboxDaemonTimer seconds
  }

  stopNotificationsDaemon() {
    clearInterval(this.interval);
  }

  deleteMessageFromUri(uri) {
    this.messages.splice(this.messages.indexOf(this.getMessageByUri(uri)), 1);
  }

  getMessageByUri(uri) {
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].uri === uri) {
        return this.messages[i];
      }
    }
  }

  async callbackForNotificationProcessing(notification) {
    console.log('Notification callback executed:');
    if (notification.type === 'NewMessage') {
      const localNoti = notification;
      const maker = await this.rdf.getMessageMaker(localNoti.messageUri, this.currentChatFileUri);
      const m = {
        userName: this.getUsernameFromWebID(maker),
        message: await this.rdf.getMessageContent(localNoti.messageUri, this.currentChatFileUri),
        webId: maker,
        maker: await this.getUserByWebId(maker)
      };
      m.uri = localNoti.messageUri;
      m.timeSent = await this.rdf.getMessageDate(localNoti.messageUri, this.currentChatFileUri);
      this.addMessage(m);
      this.triggerSubscriptions('messages')
    }
    if (notification.type === 'DeletedMessage') {
      const localNoti = notification;
      this.deleteMessageFromUri(localNoti.messageUri);
    }
    if (notification.type === 'LongChat') {
      const localNoti = notification;
      this.rdf.addChatToCard(this.me.webId, localNoti.participants, localNoti.chatUri);
      this.addConversation({
        chatTitle: localNoti.chatName,
        chatFileUri: localNoti.chatUri,
        others: await Promise.all(localNoti.participants.map(async webId => await this.getUserByWebId(webId)))
      });
      this.triggerSubscriptions('conversations')
    }
  }

  async newConversation(otherWebIds, chatName) {
    const chatUri = await this.rdf.createNewChat(this.me.webId, otherWebIds, chatName);
    this.addConversation({
      chatTitle: chatName,
      chatFileUri: chatUri,
      others: await Promise.all(otherWebIds.map(async webId => await this.getUserByWebId(webId)))
    });
    this.triggerSubscriptions('conversations');
  }

}

export default new ChatService();
