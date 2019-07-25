import React, { useLayoutEffect, useRef } from 'react';
import {
  ChatMessagesPane,
  IndividualMessage,
  IndividualMessageImage,
  IndividualMessageText
} from './messages.style';
import useStayScrolled from 'react-stay-scrolled';
import chatService from './chatService';

export default function ChatMessages({ messages }) {
  const listRef = useRef();
  const { stayScrolled/*, scrollBottom*/ } = useStayScrolled(listRef);
  useLayoutEffect(() => {
    stayScrolled();
  }, [messages.length])

  console.log(messages)

  return (
    <ChatMessagesPane ref={listRef}>
      {messages.map((message, id) => (
        <IndividualMessage me={message.webId === chatService.me.webId} key={message.uri}>
          <IndividualMessageImage src={message.maker.photoUrl} />
          <IndividualMessageText me={message.webId === chatService.me.webId}>
            {message.message}
          </IndividualMessageText>
        </IndividualMessage>
      ))}
    </ChatMessagesPane>
  )
}