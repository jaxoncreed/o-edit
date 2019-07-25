import React, { Fragment, Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  MessageInputArea,
  ChatTextBox
} from './messages.style';
import chatService from './chatService';
import useStayScrolled from 'react-stay-scrolled';
import ChatMessages from './chatMessages'

export default class Chat extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
    this.textRef = React.createRef();
    this.submitNewMessage = this.submitNewMessage.bind(this)
  }

  async componentDidMount() {
    chatService.subscribe('messages', () => {
      this.setState({ messages: chatService.messages })
    });
  }

  submitNewMessage(e) {
    if (e) {
      e.preventDefault()
    }
    chatService.sendMessage(this.textRef.current.value);
    this.textRef.current.value = '';
  }

  render() {
    const messages = [
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `Let me get this straight.`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `You're gonna go fight a dragon and rescue a princess just so Farquaad will give you back a swamp which you only don't have because he filled it full of freaks in the first place.`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `Is that about right?`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `You know, maybe there's a good reason donkeys shouldn't talk.`,
        me: true,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `I don't get it. Why don't you just pull some of that ogre stuff on him?`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `Throttle him`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `lay siege to his fortress`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `grind his bones to make your bread`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `the whole ogre trip`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `Oh, I know what. Maybe I could have decapitated an entire village and put their heads on a pike, gotten a knife, cut open their spleen and drink their fluids.`,
        me: true,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `Does that sound good to you?`,
        me: true,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `Uh, no, not really, no.`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `For your information, there's a lot more to ogres than people think.`,
        me: true,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `Example?`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `Example? Okay, um...`,
        me: true,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `Ogres are like onions.`,
        me: true,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `They stink?`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `Yes`,
        me: true,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `*No`,
        me: true,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `They make you cry?`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `No!`,
        me: true,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `You leave them in the sun, they get all brown, start sproutin' little white hairs.`,
      },
      {
        photo: 'https://randomuser.me/api/portraits/women/60.jpg', 
        text: `No! Layers! Onions have layers. Ogres have layers! Onions have layers. You get it? We both have layers.`,
        me: true,
      },
    ]

    console.log(this.state.messages)

    return (
      <Fragment>
        <ChatMessages messages={this.state.messages} />
        <MessageInputArea onSubmit={this.submitNewMessage}> 
          <ChatTextBox type="text" placeholder="Write a message" ref={this.textRef} />
          <FontAwesomeIcon
            icon="paper-plane"
            onClick={this.submitNewMessage}
            style={{ cursor: 'pointer' }}
          />
        </MessageInputArea>
      </Fragment>
    );
  }
};
