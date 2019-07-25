import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NewChatContainer, NewChatInput } from './messages.style.js';
import chatService from './chatService';

class NewChat extends Component {

  constructor(props) {
    super(props);
    this.chatRef = React.createRef();
    this.webIdRef = React.createRef();
    this.submit = this.submit.bind(this);
  }

  async submit(e) {
    e.preventDefault();
    const name = this.chatRef.current.value;
    const webId = this.webIdRef.current.value;
    try {
      await chatService.newConversation([ webId ], name);
    } catch(err) {
      console.error(err)
      alert('Error creating chat');
    }
    this.props.callback();
  }
 
  render() {
    return (
      <NewChatContainer onSubmit={this.submit}>
        <NewChatInput type="text" placeholder="Chat Name" ref={this.chatRef} />
        <NewChatInput type="text" placeholder="Friend's WebId" ref={this.webIdRef} />
        <NewChatInput type="submit" value="Create Chat" />
      </NewChatContainer>
    );
  }
};

export default NewChat;
