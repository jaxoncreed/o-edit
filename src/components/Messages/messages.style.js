import styled from "styled-components";

import { media } from "../../utils";

const darkPurple = '#190335';
const lightPurple = '#F3F2F4';
const white = '#FFF';

/**
 * Messages
 */
export const EditorWrapper = styled.section`
  display: flex;
  justify-content: stretch;
  height: 100vh;
  overflow: auto;
`;

export const FolderSelection = styled.nav`
  width: 50px;
  background-color: ${darkPurple};
  padding-top: 5px;
  padding-left: 17px;
  box-sizing: border-box;
  overflow: auto;
  direction: rtl;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`

export const FolderTab = styled.div`
  background-color: ${props => props.selected ? lightPurple : 'transparent'};
  color: ${props => props.selected ? darkPurple : lightPurple }
  flex-shrink: 0;
  border-top: ${lightPurple} solid 1px
  padding: 12px;
  padding-right: 10px;
  padding-left: ${props => props.selected ? '5px' : 0}
  width: ${props => props.selected ? '33px' : '28px'}
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  direction: ltr;
  border-bottom-left-radius: 5px;
  border-top-left-radius: ${props => props.selected ? '5px' : '0'};
  cursor: pointer;
`

export const FolderSelectionLabel = styled.span`
  font-size: 12px;
  text-overflow: ellipsis;
  writing-mode: vertical-lr;
  transform: rotate(180deg);
`


/**
 * Message Folder
 */
export const ChatSelector = styled.nav`
  background-color: ${lightPurple};
  width: 300px;
  flex-shrink: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

export const EditorHeader = styled.div`
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
`

export const Logo = styled.img`
  height: 26px;
`

export const ChatList = styled.div`
  overflow: auto
`

export const SearchbarContainer = styled.div`
  margin-left: 12px;
  margin-right: 12px;
  height: 30px;
  position: relative;
  background-color: ${white};
  border-radius: 15px;
  display: flex;
  align-items: center;
  padding-left: 7px;
  margin-bottom: 10px;
`

export const SearchTextbox = styled.input`
  background-color: transparent !important;
  border-radius: 15px !important;
  border: none !important;
  width: 100% !important;
  height: 100%;
  position: absolute !important;
  left: 0;
  top: 0;
  padding-left: 20px !important;
`

export const ChatOptionContainer = styled.div`
  background-color: ${props => props.selected ? white : 'transparent'}
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  margin-left: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const ChatOptionProfileImage = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-color: ${darkPurple}
`

export const ChatOptionTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 12px;
  overflow: hidden;
`

export const ChatOptionName = styled.span`

`

export const ChatOptionMessage = styled.span`
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap; 
  overflow: hidden;
`

export const ChatPane = styled.div`
  flex-grow: 6;
  flex-shrink: 0;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  flex-basis: 500px;
`

export const ChatPaneHeader = styled.header`
  height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid ${lightPurple}
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
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