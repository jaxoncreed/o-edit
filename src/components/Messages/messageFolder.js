import React, { Fragment, Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LiveUpdate, withWebId, UpdateContext, withAuthorization } from '@inrupt/solid-react-components';
import chatService from './chatService';

import Chat from './chat'
import NewChat from './newChat'
import {
  ChatSelector,
  ChatPane,
  Logo,
  ChatHeader,
  SearchbarContainer,
  ChatList,
  SearchTextbox,
  ChatOptionContainer,
  ChatOptionProfileImage,
  ChatOptionTextContainer,
  ChatOptionName,
  ChatOptionMessage,
  ChatPaneHeader,
  CenterMessage
} from './messages.style';
import ProfileImage from '../Share/ProfileImage';

class MessageFolder extends Component {

  constructor(props) {
    super(props)
    this.state = {
      chats: [],
      newChatWindow: false,
      curChat: null
    }
  }

  async componentDidMount() {
    chatService.subscribe('conversations', () => {
      this.setState({ 
        chats: chatService.conversations,
        curChat: chatService.currentChat
      })
    });
  }

  // async componentDidUpdate(prevProps, prevState) {
  //   if (this.props.webId && this.props.webId !== prevProps.webId) {
  //     await this.fetchChats();
  //   }
  // }

  // async fetchChats() {
  //   const chats = await chatService.getConversations(this.props.webId);
  //   console.log(chats);
  // }

  render() {

    let headerMessage = '';
    let RenderedComponent = (
      <CenterMessage>
        Create or select a chat to view.
      </CenterMessage>
    )
    if (this.state.newChatWindow) {
      headerMessage = 'Create a new chat';
      RenderedComponent = <NewChat callback={() => this.setState({ newChatWindow: false })} />
    } else if (this.state.curChat) {
      headerMessage = this.state.curChat.chatTitle;
      RenderedComponent = <Chat />
    }

    console.log('CHATS!!!!!!!!!!!');
    console.log(this.state.chats);

    return (
      <Fragment>
        <ChatSelector>
          <ChatHeader>
            <Logo src="/img/OeditOrig.png" />
            <FontAwesomeIcon
              icon="plus"
              style={{ cursor: 'pointer' }}
              onClick={() => this.setState({ newChatWindow: true })}
            />
          </ChatHeader>
          <ChatList>
            <SearchbarContainer>
              <SearchTextbox type="text" placeholder="Search chats" />
              <FontAwesomeIcon icon="search" />
            </SearchbarContainer>
            {this.state.chats.map((chat) => (
              <ChatOptionContainer
                selected={chat.isCurrent && !this.state.newChatWindow}
                key={chat.chatFileUri}
                onClick={() => {
                  this.setState({ newChatWindow: false })
                  chatService.openChat(chat)
                }}
              >
                <ChatOptionProfileImage src={chat.others[0].photoUrl} />
                <ChatOptionTextContainer>
                  <ChatOptionName>{chat.chatTitle}</ChatOptionName>
                  {/* <ChatOptionMessage>{chat.lastMessage}</ChatOptionMessage> */}
                </ChatOptionTextContainer>
              </ChatOptionContainer>
            ))}
          </ChatList>
        </ChatSelector>
        <ChatPane>
          <ChatPaneHeader>
            {/* <FontAwesomeIcon icon="users" /> */}
            <span>{headerMessage}</span>
            <ProfileImage />
          </ChatPaneHeader>
          {RenderedComponent}
        </ChatPane>
      </Fragment>
    );
  }
};

export default withAuthorization(withWebId(MessageFolder));