import styled from "styled-components";

const darkPurple = '#190335';
const lightPurple = '#F3F2F4';
const white = '#FFF';

/**
 * Editor
 */
export const EditorWrapper = styled.section`
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background-color: #1c1c1c;
  flex-direction: column;
`;

export const EditorHeader = styled.div`
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
  background-color: #303136;
  z-index: 2;
`

export const Logo = styled.img`
  height: 26px;
`

export const EditorContent = styled.div`
  flex-grow: 1;
  z-index: 1;
`

export const NavSection = styled.div`
  display: flex;
  align-items: center;
`

/**
 * Chat
 */
export const MessageInputArea = styled.form`
  flex-shrink: 1;
  height: 50px;
  border-top: 1px solid ${lightPurple}
  display: flex;
  align-items: center;
  padding-right: 12px;
  flex-shrink: 0;
`

export const ChatTextBox = styled.input`
  background-color: transparent !important;
  border: none !important;
  padding-left: 12px !important;
  background-color: red;
`

export const ChatMessagesPane = styled.ul`
  flex-grow: 1;
  overflow: auto;
  padding-left: 12px;
  padding-right: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-x: auto;
`

export const IndividualMessage = styled.li`
  display: flex;
  align-items: flex-end;
  flex-direction: ${props => props.me ? 'row-reverse' : 'row' }
  margin-top: 8px;
  margin-bottom: 8px;
`

export const IndividualMessageImage = styled.img`
  height: 20px;
  border-radius: 50%;
`

export const IndividualMessageText = styled.div`
  background-color: ${props => props.me ? darkPurple : lightPurple }
  color: ${props => props.me ? white : darkPurple}
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 19px;
  font-size: 14px;
  margin-left: ${props => props.me ? '25px' : '5px' }
  margin-right: ${props => props.me ? '5px' : '25px' }
  max-width: 60%;
`

export const CenterMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`

/**
 * New Chat
 */
export const NewChatContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  flex-direction: column;
`

export const NewChatInput = styled.input`
  max-width: 500px;
  margin-bottom: 10px;
`