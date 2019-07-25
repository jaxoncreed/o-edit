import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import URL from 'url-parse';
import { withToastManager } from 'react-toast-notifications';
import { LiveUpdate, withWebId, UpdateContext, withAuthorization } from '@inrupt/solid-react-components';
import MessageFolder from './messageFolder'
import { MessagesWrapper, FolderSelection, FolderSelectionLabel, FolderTab } from './messages.style';
import { PathFactory } from 'ldflex';
import ComunicaEngine from 'ldflex-comunica';
import { namedNode } from '@rdfjs/data-model';
import context from '../../contexts/context.json';
import ldflex from '@solid/query-ldflex';

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folders: [],

    }
  }

  // async componentDidMount() {
  //   if (this.props.webId) {
  //     await this.fetchChats();
  //   }
  // }

  // async componentDidUpdate(prevProps, prevState) {
  //   if (this.props.webId && this.props.webId !== prevProps.webId) {
  //     await this.fetchChats();
  //   }
  // }

  // async fetchChatsRecurse(folder, chats) {
  //   const customizeFunc = ldflex.customize;
  //   const data = ldflex.customize({ context })

  //   // console.log(data)
  //   // const container = data[folder];
  //   // console.log(container);
  //   // for await (const contained of container.contains) {
  //   //   console.log('============')
  //   //   console.log('Contained Value', contained.value)
  //   //   const type = await contained.type;
  //   //   console.log('contained type', type.value)
  //   //   if (
  //   //     (type.value === 'http://www.w3.org/ns/iana/media-types/text/turtle#Resource' ||
  //   //     type.value === 'http://www.w3.org/ns/ldp#Resource') &&
  //   //     contained.value.includes('.ttl')
  //   //   ) {
  //   //     console.log('RESOURCE', contained.value)
  //   //     try {
  //   //       const resource = data[`${contained.value}#this`];
  //   //       for await (const resourceType of resource.type) {
  //   //         console.log(resourceType.value)
  //   //         if (resourceType.value === 'http://www.w3.org/ns/pim/meeting#LongChat') {
  //   //           const chat = {
  //   //             url: resource.value,
  //   //             name: await resource[`http://purl.org/dc/elements/1.1/title`],
  //   //             participants: []
  //   //           };
  //   //           for await (const participant of resource['http://www.w3.org/2005/01/wf/flow#participation']) {
  //   //             chat.participants.push(await participant['http://www.w3.org/2005/01/wf/flow#participant'])
  //   //           }
  //   //           chats.push(chat);
  //   //         }
  //   //       }
  //   //     } catch(err) {
  //   //       console.log(err)
  //   //     }
  //   //   } else if (
  //   //     type.value === 'http://www.w3.org/ns/ldp#BasicContainer' ||
  //   //     type.value === 'http://www.w3.org/ns/ldp#Container'
  //   //   ) {
  //   //     await this.fetchChatsRecurse(contained.value, chats)
  //   //   }
  //   // }
  // }

  // async fetchChats() {
  //   const webId = this.props.webId;
  //   // const longChatPath = `${new URL(webId).origin}/o-chat/Long%20Chat%20One/index.ttl#this`
  //   // const longChat = data[longChatPath];
  //   // for await (const type of longChat.type) {
  //   //   console.log(type.value)
  //   // }
  //   const rootPath = `${new URL(webId).origin}/public/`;
  //   const chats = [];
  //   await this.fetchChatsRecurse(rootPath, chats);
  //   console.log(chats);
  //   // const root = data[rootPath]
  //   // for await (const contained of root.contains) {
  //   //   console.log(contained.value);
  //   //   for await (const type of data[`${contained.value}#this`].type) {
  //   //     console.log('==================')
  //   //     console.log(contained.value)
  //   //     console.log(type.value)
  //   //   }
  //   // }


  //   // console.log(`${await person.givenName} is interested in:`);
  //   // for await (const name of person.interest.label)
  //   //   console.log(`- ${name}`);

  //   // console.log(`${await person.givenName} is friends with:`);
  //   // for await (const name of person.friends.givenName)
  //   //   console.log(`- ${name}`);
  // }

  render() {
    // const folders = [
    //   {
    //     displayName: 'All Chats',
    //     icon: 'globe'
    //   },
    //   {
    //     displayName: 'jackson.solid.community/public/chat-one',
    //     icon: 'faFacebookMessenger'
    //   },
    //   {
    //     displayName: 'jackson.solid.community/o-chat/cool',
    //     icon: 'fa-slack',
    //     selected: true
    //   },
    //   {
    //     displayName: 'mitzi.solid.community/chatofages',
    //     icon: 'fa-gitter'
    //   },
    //   {
    //     displayName: 'timbl.com/private/chats',
    //     icon: 'folder'
    //   },
    // ]

    return (
      <MessagesWrapper>
        {/* <FolderSelection>
          <FontAwesomeIcon 
            icon="sync"
            style={{
              alignSelf: 'center',
              marginTop: '9px',
              marginBottom: '12px',
              color: '#FFF',
              cursor: 'pointer'
            }}
            onClick={this.fetchChats}
          />
          {folders.map(folder => (
            <FolderTab selected={folder.selected} key={folder.displayName}>
              <FolderSelectionLabel>
                {folder.displayName}
              </FolderSelectionLabel>
            </FolderTab>
          ))}
        </FolderSelection> */}
        <MessageFolder />
      </MessagesWrapper>
    );
  }
}
Messages.contextType = UpdateContext;

export default withAuthorization(withWebId(Messages));
