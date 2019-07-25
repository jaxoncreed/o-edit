import data from '@solid/query-ldflex';


// Maintain log of checked notification
const alreadychecked = [];


/**
 * Fetches the session from Solid, and store results in localStorage
 */
export async function getSession() {
  // this.session = await solid.auth.currentSession(localStorage);
}

/**
 * Gets a node that matches the specified pattern using the VCARD onthology
 *
 * any() can take a subject and a predicate to find Any one person identified by the webId
 * that matches against the node/predicated
 *
 * @param {string} node VCARD predicate to apply to the $rdf.any()
 * @param {string?} webId The webId URL (e.g. https://yourpod.solid.community/profile/card#me)
 * @return {string} The value of the fetched node or an emtpty string
 * @see https://github.com/solid/solid-tutorial-rdflib.js
 */
export function getValueFromVcard(node, webId) {
  // return getValueFromNamespace(node, VCARD, webId);
}

/**
 * Gets a node that matches the specified pattern using the FOAF onthology
 * @param {string} node FOAF predicate to apply to the $rdf.any()
 * @param {string?} webId The webId URL (e.g. https://yourpod.solid.community/profile/card#me)
 * @return {string} The value of the fetched node or an emtpty string
 */
export function getValueFromFoaf(node, webId) {
  // return getValueFromNamespace(node, FOAF, webId);
}

/**
 * Gets a node that matches the specified pattern using the LDP onthology
 * @param {string} node LDP predicate to apply to the $rdf.any()
 * @param {string?} webId The webId URL (e.g. https://yourpod.solid.community/profile/card#me)
 * @return {string} The value of the fetched node or an emtpty string
 */
export function getValueFromLdp(node, webId) {
  // return this.getValueFromNamespace(node, LDP, webId);
}

export function transformDataForm(form, me, doc) {
  const insertions = [];
  const deletions = [];
  const fields = Object.keys(form.value);
  const oldProfileData = JSON.parse(localStorage.getItem('oldProfileData')) || {};

  // We need to split out into three code paths here:
  // 1. There is an old value and a new value. This is the update path
  // 2. There is no old value and a new value. This is the insert path
  // 3. There is an old value and no new value. Ths is the delete path
  // These are separate codepaths because the system needs to know what to do in each case
  fields.map(field => {

    // const predicate = VCARD(this.getFieldName(field));
    const subject = this.getUriForField(field, me);
    const why = doc;

    const fieldValue = this.getFieldValue(form, field);
    const oldFieldValue = this.getOldFieldValue(field, oldProfileData);

    // if there's no existing home phone number or email address, we need to add one, then add the link for hasTelephone or hasEmail
    if (!oldFieldValue && fieldValue && (field === 'phone' || field === 'email')) {
      // this.addNewLinkedField(field, insertions, predicate, fieldValue, why, me);
    } else {

      // Add a value to be updated
      if (oldProfileData[field] && form.value[field] && !form.controls[field].pristine) {
        // deletions.push($rdf.st(subject, predicate, oldFieldValue, why));
        // insertions.push($rdf.st(subject, predicate, fieldValue, why));

        // Add a value to be deleted
      } else if (oldProfileData[field] && !form.value[field] && !form.controls[field].pristine) {
        // deletions.push($rdf.st(subject, predicate, oldFieldValue, why));

        // Add a value to be inserted
      } else if (!oldProfileData[field] && form.value[field] && !form.controls[field].pristine) {
        // insertions.push($rdf.st(subject, predicate, fieldValue, why));
      }
    }
  });

  return {
    insertions: insertions,
    deletions: deletions
  };
}

function addNewLinkedField(field, insertions, predicate, fieldValue, why, me) {
  // Generate a new ID. This id can be anything but needs to be unique.
  const newId = field + ':' + Date.now();

  // Get a new subject, using the new ID
  // const newSubject = $rdf.sym(this.session.webId.split('#')[0] + '#' + newId);

  // Set new predicate, based on email or phone fields
  // const newPredicate = field === 'phone' ? $rdf.sym(VCARD('hasTelephone')) : $rdf.sym(VCARD('hasEmail'));

  // Add new phone or email to the pod
  // insertions.push($rdf.st(newSubject, predicate, fieldValue, why));

  // Set the type (defaults to Home/Personal for now) and insert it into the pod as well
  // Todo: Make this dynamic
  // const type = field === 'phone' ? $rdf.literal('Home') : $rdf.literal('Personal');
  // insertions.push($rdf.st(newSubject, VCARD('type'), type, why));

  // Add a link in #me to the email/phone number (by id)
  // insertions.push($rdf.st(me, newPredicate, newSubject, why));
}

function getUriForField(field, me) {
  let uriString;
  let uri;

  switch (field) {
    case 'phone':
      uriString = this.getValueFromVcard('hasTelephone');
      if (uriString) {
        // uri = $rdf.sym(uriString);
      }
      break;
    case 'email':
      uriString = this.getValueFromVcard('hasEmail');
      if (uriString) {
        // uri = $rdf.sym(uriString);
      }
      break;
    default:
      uri = me;
      break;
  }

  return uri;
}

/**
 * Extracts the value of a field of a NgForm and converts it to a $rdf.NamedNode
 * @param {NgForm} form
 * @param {string} field The name of the field that is going to be extracted from the form
 * @return {RdfNamedNode}
 */
function getFieldValue(form, field) {
  let fieldValue;

  if (!form.value[field]) {
    return;
  }

  switch (field) {
    case 'phone':
      // fieldValue = $rdf.sym('tel:+' + form.value[field]);
      break;
    case 'email':
      // fieldValue = $rdf.sym('mailto:' + form.value[field]);
      break;
    default:
      fieldValue = form.value[field];
      break;
  }

  return fieldValue;
}

function getOldFieldValue(field, oldProfile) {
  let oldValue;

  if (!oldProfile || !oldProfile[field]) {
    return;
  }

  switch (field) {
    case 'phone':
      // oldValue = $rdf.sym('tel:+' + oldProfile[field]);
      break;
    case 'email':
      // oldValue = $rdf.sym('mailto:' + oldProfile[field]);
      break;
    default:
      oldValue = oldProfile[field];
      break;
  }

  return oldValue;
}

function getFieldName(field) {
  switch (field) {
    case 'company':
      return 'organization-name';
    case 'phone':
    case 'email':
      return 'value';
    default:
      return field;
  }
}

export async function updateProfile(form) {
  // const me = $rdf.sym(this.session.webId);
  // const doc = $rdf.NamedNode.fromValue(this.session.webId.split('#')[0]);
  // const data = this.transformDataForm(form, me, doc);

  // Update existing values
  // if (data.insertions.length > 0 || data.deletions.length > 0) {
  //   this.updateManager.update(data.deletions, data.insertions, (response, success, message) => {
  //     if (success) {
  //       this.toastr.success('Your Solid profile has been successfully updated', 'Success!');
  //       form.form.markAsPristine();
  //       form.form.markAsTouched();
  //     } else {
  //       this.toastr.error('Message: ' + message, 'An error has occurred');
  //     }
  //   });
  // }
}

export function getAddress() {
  const linkedUri = this.getValueFromVcard('hasAddress');

  if (linkedUri) {
    return {
      locality: this.getValueFromVcard('locality', linkedUri),
      country_name: this.getValueFromVcard('country-name', linkedUri),
      region: this.getValueFromVcard('region', linkedUri),
      street: this.getValueFromVcard('street-address', linkedUri),
    };
  }

  return {};
}

// Function to get email. This returns only the first email, which is temporary
export function getEmail() {
  const linkedUri = this.getValueFromVcard('hasEmail');

  if (linkedUri) {
    return this.getValueFromVcard('value', linkedUri).split('mailto:')[1];
  }

  return '';
}

// Function to get phone number. This returns only the first phone number, which is temporary. It also ignores the type.
export function getPhone() {
  const linkedUri = this.getValueFromVcard('hasTelephone');

  if (linkedUri) {
    return this.getValueFromVcard('value', linkedUri).split('tel:+')[1];
  }
}

export async function getProfile() {

  if (!this.session) {
    await this.getSession();
  }

  try {
    await this.fetcher.load(this.session.webId);

    return {
      fn: this.getValueFromVcard('fn'),
      company: this.getValueFromVcard('organization-name'),
      phone: this.getPhone(),
      role: this.getValueFromVcard('role'),
      image: this.getValueFromVcard('hasPhoto'),
      address: this.getAddress(),
      email: this.getEmail(),
    };
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }
}

/**
 * Gets any resource that matches the node, using the provided Namespace
 * @param {string} node The name of the predicate to be applied using the provided Namespace
 * @param {$rdf.namespace} namespace The RDF Namespace
 * @param {string?} webId The webId URL (e.g. https://yourpod.solid.community/profile/card#me)
 */
function getValueFromNamespace(node, namespace, webId) {
  // const store = this.store.any($rdf.sym(webId || this.session.webId), namespace(node));
  // if (store) {
  //   return store.value;
  // }
  return '';
}


  //  //  //  //  //  //  //   //   //  //
  //  //  //  //  //  //  //   //   //  //
  // NEW METHODS ADDED BELOW THIS POINT //
  //  //  //  //  //  //  //   //   //  //
  //  //  //  //  //  //  //   //   //  //

/**
* Returns an array of NamedNode objects matching the term in a uri
* @param {any} term term to look for in the document
* @param {string} uri uri where you want to look (defaults to your webId)
* @return {Promise<Array<NamedNode>>} A promise containing the array of NamedNode objects
*/
export async function getArray(term, uri = this.session.webId) {
  try {
    const d = this.store.sym(uri);
    await this.fetcher.load(d.doc());
    return this.store.each(d, term);

  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }
}

/**
* Returns a NamedNode object matching the term in a uri
* @param {any} term term to look for in the document
* @param {string} uri uri where you want to look (defaults to your webId)
* @return {Promise<NamedNode>} A promise containing the NamedNode object
*/
export async function getSingle(term, uri = this.session.webId) {
  const d = this.store.sym(uri);
  await this.fetcher.load(d.doc());
  return this.store.any(d, term);
}

/**
* Returns an array of NamedNode objects of your friends
* @param {string} uri webId where you want to look (defaults to your webId)
* @return {Promise<Array<NamedNode>>} A promise containing the array of NamedNode objects
*/
export async function getFriends(uri = this.session.webId) {
  // return this.getArray(FOAF('knows'), uri);
}

/**
* Returns a NamedNode object containing the name of a webId
* @param {string} uri webId where you want to look (defaults to your webId)
* @return {Promise<NamedNode>} A promise containing the NamedNode object
*/
export async function getName(uri = this.session.webId) {
  // return this.getSingle(VCARD('fn'), uri);
}

/**
 * Returns a NamedNode object containing the url of the profile picture
 * @param {string} uri webId of the card where you want to look (defaults to your webId)
* @return {Promise<NamedNode>} A promise containing the NamedNode object
  */
export async function getPicture(uri = this.session.webId) {
  // return this.getSingle(VCARD('hasPhoto'), uri);
}

/**
* Returns a NamedNode object containing the url of the inbox of a webId
* @param {string} webId webId where you want to look (defaults to your webId)
* @return {Promise<Array<NamedNode>>} A promise containing the NamedNode object
*/
export async function getInboxUrl(webId = this.session.webId) {
  // return this.getSingle(LDP('inbox'), webId);
}

/**
* Returns an array of NamedNode objects with the contents of the inbox
* @param {string} webId webId where you want to look (defaults to your webId)
* @return {Promise<Array<NamedNode>>} A promise containing the array of NamedNode objects
*/
export async function getInboxContents(webId = this.session.webId) {
  // return this.getArray(LDP('contains'), (await this.getInboxUrl(webId)).value);
}

/**
 * Gets all the message uris for a chat.ttl file
 * @param {string} year Year
 * @param {string} month Month
 * @param {string} day Day
 * @param {string} chatUri The uri of the root folder for the chat
 * @return {string} The uri of the chat.ttl file
 */
export function getChatFileUriForDate(year, month, day, chatUri) {
  return chatUri + '/' + year + '/' + month + '/' + day + '/' + 'chat.ttl';
}

/**
 * Gets all the message uris for a chat.ttl file
 * @param {string} chatFileUri The uri of the chat.ttl file
 * @param {string} chatUri The uri of the root folder for the chat
 * @return {Promise<Array<NamedNode>>} NamedNode objects containing the uris of each message
 */
export async function getMessageUrisForFile(chatFileUri, chatUri) {
  const d = this.store.sym(chatFileUri);
  await this.fetcher.load(d.doc());
  const indexUri = chatUri + '/index.ttl#this';
  const indexd = this.store.sym(indexUri);
  // const messagesIdsList = (await this.store.match(indexd, FLOW('message'), null, d.doc())).map(e => e.object);
  // return messagesIdsList;
}

/**
* Gets the maker of a given message
* @param {string} msgUri The uri of the message
* @param {string} chatFileUri The uri of the chat.ttl file
* @return {string} webId of the maker
*/
export async function getMessageMaker(msgUri, chatFileUri) {
  const subject = this.store.sym(msgUri);
  const chatFile = this.store.sym(chatFileUri);
  await this.fetcher.load(chatFile.doc(), { force: true, clearPreviousData: true });
  // const msgMaker = await this.store.match(subject, FOAF('maker'), null, chatFile.doc());
  // return msgMaker[0].object.value;
}

/**
* Gets the date of a given message
* @param {string} msgUri The uri of the message
* @param {string} chatFileUri The uri of the chat.ttl file
* @return {Date} date the message was sent
*/
export async function getMessageDate(msgUri, chatFileUri) {
  const subject = this.store.sym(msgUri);
  const chatFile = this.store.sym(chatFileUri);
  await this.fetcher.load(chatFile.doc());
  // const msgDate = await this.store.match(subject, TERMS('created'), null, chatFile.doc());
  // return new Date(msgDate[0].object.value);
}

/**
* Gets the content of a given message.
* @param {string} msgUri The uri of the message
* @param {string} chatFileUri The uri of the chat.ttl file
* @return {string} content of the messahge
*/
export async function getMessageContent(msgUri, chatFileUri) {
  const subject = this.store.sym(msgUri);
  const chatFile = this.store.sym(chatFileUri);
  await this.fetcher.load(chatFile.doc());
  // const msgContent = await this.store.match(subject, SIOC('content'), null, chatFile.doc());
  // return msgContent[0].object.value;
}

/**
* Returns the uri of the chat channel used for a conversation between two webids
* @param {string} myWebId My webId
* @param {string} otherWebId The webId of the other person
* @return {Promise<string>} Promise resolving to the uri of the chanel
*/
export async function getChannelUri(myWebId, otherWebId) {
  const chats = await this.getConversations(myWebId);
  chats.forEach(chat => {
    if (chat.others.includes(otherWebId)) {
      return chat.chatFileUri;
    }
  });
  return 'none';
}

/**
* Adds the new message to the given chat file
* @param {string} chatFileUri uri of the chat file where we want to append the message
* @param {ChatMessage} message Chat message we want to append
* @return {Promise<string>} Promise resolving to the uri of the message
*/
export async function appendMessage(chatFileUri, message) {
  const msgUri = this.buildMsgUri(chatFileUri, message.timeSent);
  const indexUri = chatFileUri.split('/').slice(0, 5).join('/') + '/index.ttl#this';
  const msgUriSym = this.store.sym(msgUri);
  const indexUriSym = this.store.sym(indexUri);

  const ins = [];

  const cFile = this.store.sym(chatFileUri);
  this.fetcher.load(cFile.doc());
  // ins.push($rdf.st(msgUriSym, TERMS('created'), message.timeSent, cFile.doc()));
  // ins.push($rdf.st(msgUriSym, SIOC('content'), message.message, cFile.doc()));
  // ins.push($rdf.st(msgUriSym, FOAF('maker'), this.store.sym(message.webId), cFile.doc()));

  // ins.push($rdf.st(indexUriSym, FLOW('message'), msgUriSym, cFile.doc()));


  this.updateManager.update([], ins, (uri, ok, msg, response) => {
    if (ok) {
      console.log('Message sent');
    } else {
      console.log(msg, response);
    }
  });

  const chatFolder = chatFileUri.split('/').slice(0, 5).join('/') + '/';

  this.sendNotifsNewMessage(message.chat.others, chatFolder, msgUri); // comment to avoid spam
  return msgUri;
}

/**
* Removes the specified message from the given chat file
* @param {string} chatFileUri uri of the chat file from which we want to delete the message
* @param {ChatMessage} message Chat message we want to delete
* @return {Promise}
*/
export async function deleteMessage(chatFileUri, message) {
  const msgUri = message.uri;
  const indexUri = chatFileUri.split('/').slice(0, 5).join('/') + '/index.ttl#this';
  const msgUriSym = this.store.sym(msgUri);
  const indexUriSym = this.store.sym(indexUri);

  const cFile = this.store.sym(chatFileUri);
  this.fetcher.load(cFile.doc());
  const dels = this.store.statementsMatching(msgUriSym, null, null, cFile.doc());

  this.store.statementsMatching(indexUriSym, null, msgUriSym, cFile.doc()).forEach(element => {
    dels.push(element);
  });

  this.updateManager.update(dels, [], (uri, ok, msg, response) => {
    if (ok) {
      console.log('Message deleted: ' + message.message + ' (' + message.timeSent + ')');
    } else {
      console.log(msg, response);
    }
  });
  this.sendNotifsDeletedMessage(message.chat.others, chatFileUri, msgUri); // comment to avoid spam
}

/**
 * Builds the URI of the message from the URI of its chat and the sent date
 * @param {string} chatFileUri uri of the chat to which the message belongs
 * @param {Date} timeSent Date in which the message was sent
 * @return {string} the uri of the message
 */
export function buildMsgUri(chatFileUri, timeSent) {
  const msgUri = chatFileUri + '#Msg' + timeSent.getTime();
  return msgUri.substring(0, msgUri.length - 3);
}

/**
* Adds a listener to a file for when it changes
* @param {string} chatFileUri the uri of the resource we want to listen to
* @param {function} callback function to call onUpdate
*/
export async function addListener(chatFileUri, callback) {
  const cFile = this.store.sym(chatFileUri);
  this.updateManager.addDownstreamChangeListener(cFile.doc(), callback);
}

/**
* Adds a user to your friends list
* @param {string} addWebId the webId of the friend you want to add
*/
export async function addFriend(addWebId) {
  await this.getSession();
  const card = this.store.sym(this.session.webId.replace('#me', ''));
  const me = this.store.sym(this.session.webId);
  const newFriend = this.store.sym(addWebId);
  await this.fetcher.load(newFriend.doc());

  // const checks = await this.store.match(null, null, FOAF('PersonalProfileDocument'), newFriend.doc());


  // if (checks.length > 0 && addWebId !== '') {
  //   try {
  //     const ins = $rdf.st(me, FOAF('knows'), newFriend, card.doc());

  //     this.updateManager.update([], ins, (uri, ok, message, response) => {
  //       if (ok) {
  //         console.log('Friend added');
  //       } else {
  //         console.log(message, response);
  //       }
  //     });
  //   } catch {
  //     throw new Error('Not a valid profile URI');
  //   }
  // } else {
  //   throw new Error('Not a valid profile URI');
  // }
}

/**
* Creates a new chat folder and its index, also adds the info on the user's card
* @param {string} myWebId the webId of the user creating the chat
* @param {string} otherWebId the other person webId
* @param {string} chatFolder folder to contain the chat data
*/
export async function createNewChat(myWebId, otherWebIds, chatName) {
  // const chatFolder = myWebId.replace('profile/card#me', 'public/' + shortHash(otherWebIds.join() + myWebId + new Date()));
  // const indexFileUri = chatFolder + '/index.ttl';
  // const pId = 'id' + (+new Date);

  // const pIdUriSym = this.store.sym(indexFileUri + '#pId' + pId);
  // const thisUriSym = this.store.sym(indexFileUri + '#this');
  // const sPrefUriSym = this.store.sym(indexFileUri + '#SharedPreferences');
  // const meUriSym = this.store.sym(myWebId);

  // const currDate = new Date();

  // const ins = [];

  // const indexFile = this.store.sym(indexFileUri);
  // const myCardFile = this.store.sym(myWebId.replace('#me', ''));
  // const chatFolderFile = this.store.sym(chatFolder);
  // this.fetcher.load(myCardFile.doc());


  // ins.push($rdf.st(pIdUriSym, ICAL('dtstart'), currDate, indexFile.doc()));
  // ins.push($rdf.st(pIdUriSym, FLOW('participant'), meUriSym, indexFile.doc()));

  // otherWebIds.forEach(element => {
  //   const otherUiSym = this.store.sym(element);
  //   ins.push($rdf.st(pIdUriSym, FLOW('participant'), otherUiSym, indexFile.doc()));
  // });

  // ins.push($rdf.st(pIdUriSym, UI('backgroundColor'), '#f0d3e3', indexFile.doc()));

  // ins.push($rdf.st(thisUriSym, RDFSYN('type'), MEE('LongChat'), indexFile.doc()));
  // ins.push($rdf.st(thisUriSym, DCEL('author'), meUriSym, indexFile.doc()));
  // ins.push($rdf.st(thisUriSym, DCEL('created'), currDate, indexFile.doc()));
  // ins.push($rdf.st(thisUriSym, DCEL('title'), chatName, indexFile.doc()));
  // ins.push($rdf.st(thisUriSym, FLOW('participation'), pIdUriSym, indexFile.doc()));
  // ins.push($rdf.st(thisUriSym, UI('sharedPreferences'), sPrefUriSym, indexFile.doc()));


  // await this.updateManager.put(indexFile.doc(), ins, 'text/turtle', (uri, ok, message, response) => {
  //   if (ok) {
  //     console.log(`File [${this.urlLogFilter(uri)}] PUT with message [${message}].`);
  //   } else {
  //     console.error(`File [${this.urlLogFilter(uri)}] failed PUT with message [${message}].`);
  //   }
  // });

  // const cardNote = [];
  // cardNote.push($rdf.st(chatFolderFile, RDFSYN('type'), MEE('LongChat'), myCardFile.doc()));
  // otherWebIds.forEach(element => {
  //   const otherUiSym = this.store.sym(element);
  //   cardNote.push($rdf.st(chatFolderFile, FLOW('participant'), otherUiSym, myCardFile.doc()));
  // });

  // await this.updateManager.update([], cardNote, (uri, ok, message, response) => {
  //   if (ok) {
  //     console.log(`Reference set on card [${this.urlLogFilter(uri)}] UPDATED with message [${message}].`);
  //   } else {
  //     console.log(`Reference set on card [${this.urlLogFilter(uri)}] failed UPDATE with message [${message}].`);
  //   }
  // });
  // this.setPermissions(chatFolder, otherWebIds, myWebId);
  // this.sendNotifsNewConv(myWebId, chatFolder, chatName, otherWebIds);  // Commented to avoid spamming the other person while testing
  // return chatFolder;
}

/**
* Creates the chat file only if it doesn't exist
* @param {string} uri the uri of the chat file
*/
export async function createChatFileForDay(uri) {
  const chatDayFile = this.store.sym(uri);
  const chatFolder = uri.replace('/chat.ttl', '');
  const chatDayFolder = this.store.sym(chatFolder);
  await this.fetcher.load(chatDayFolder.doc());
  // const matches = await this.store.match(chatDayFolder, LDP('contains'), null, chatDayFolder.doc());

  // if (matches.length === 0) {
  //   console.log(`    Chat file [${this.urlLogFilter(uri)}] in folder [${this.urlLogFilter(chatFolder)}] NOT FOUND, creating it...`);
  //   await this.updateManager.put(chatDayFile.doc(), '', 'text/turtle', function (o, s, c) { });
  //   console.log(`    Chat file [${this.urlLogFilter(uri)}] in folder [${this.urlLogFilter(chatFolder)}] CREATED`);
  // } else {
  //   console.log(`    Chat file [${this.urlLogFilter(uri)}] in folder [${this.urlLogFilter(chatFolder)}] FOUND, skipping creation`);
  // }
}


/**
 * Creates the folder structure
 * @param {string} uri the uri of the chat file that needs the structure
 */
export async function createStructure(uri) {
  console.log('Creating folder structure');
  const splitted = uri.split('/');
  const uris = [];

  let chatfile = false;

  // await fileClient.readFile(uri).then(body => {
  //   console.log(`    Chat file done [${this.urlLogFilter(uri)}]`);
  //   chatfile = true;
  // }, async err => chatfile = false);


  // if (!chatfile) {
  //   for (let i = 4; i > 0; i--) {
  //     uris.push(splitted.slice(0, splitted.length - i).join('/'));
  //   }
  //   for (let i = 0; i < 4; i++) {
  //     console.log(`    Creating folder [${this.urlLogFilter(uris[i])}]`);
  //     await fileClient.createFolder(uris[i]);
  //   }
  //   console.log('Folder structure done, proceeding with chat file.');
  //   await this.createChatFileForDay(uri);
  // }
}

/**
* Formats the uris for the console output, removing unnecesary parts
* @param {string} uri uri that needs formatting
*/
export function urlLogFilter(url) {
  return url.replace('https://josecuriosoalternativo.inrupt.net', '').replace('https://josecurioso.solid.community', '');
}

export async function sendNotifsNewConv(webId, chatFolderUri, chatName, otherWebIds) {
  otherWebIds.forEach(e => {
    this.sendNotifNewConv(webId, chatFolderUri, e, chatName, otherWebIds);
  });
}

/**
 * Sends a notification to the webId's inbox informing of the newly created chat
 * @param {string} webId webId of the other person
 * @param {string} chatFolderUri URI of the folder containing the chat
 */
export async function sendNotifNewConv(webId, chatFolderUri, otherWebId, chatName, otherWebIds) {
  const inboxUrl = (await this.getInboxUrl(otherWebId)).value;
  const notiFile = this.store.sym(inboxUrl + 'dechatnotifications.ttl');

  const chatFolderFile = this.store.sym(chatFolderUri);
  const meWebIdFile = this.store.sym(webId);

  const ins = [];

  // ins.push($rdf.st(chatFolderFile, RDFSYN('type'), MEE('LongChat'), notiFile.doc()));
  // ins.push($rdf.st(chatFolderFile, DCEL('title'), chatName, notiFile.doc()));
  // ins.push($rdf.st(chatFolderFile, FLOW('participant'), meWebIdFile, notiFile.doc()));
  // otherWebIds.forEach(e => {
  //   if (e !== otherWebId) {
  //     const oWebId = this.store.sym(e);
  //     ins.push($rdf.st(chatFolderFile, FLOW('participant'), oWebId, notiFile.doc()));
  //   }
  // });
  // console.log(ins);
  // this.pushNotification(inboxUrl, ins);
}

export async function sendNotifsNewMessage(otherWebIds, chatFolderUri, messageUri) {
  otherWebIds.forEach(e => {
    this.sendNotifNewMessage(e, chatFolderUri, messageUri);
  });
}

/**
 * Sends a notification to the webId's inbox about a new message being received
 * @param {string} webId webId of the other person
 * @param {string} chatFolderUri URI of the folder containing the chat
 * @param {string} messageUri URI of the message the wbId is being notified of
 */
export async function sendNotifNewMessage(webId, chatFolderUri, messageUri) {
  const inboxUrl = (await this.getInboxUrl(webId)).value;
  const notiFile = this.store.sym(inboxUrl + 'dechatnotifications.ttl');
  const messageUriFile = this.store.sym(messageUri);
  const chatFolderFile = this.store.sym(chatFolderUri);

  const ins = [];

  // ins.push($rdf.st(chatFolderFile, NONE('NewMessage'), messageUriFile, notiFile.doc()));

  this.pushNotification(inboxUrl, ins);
}

export async function sendNotifsDeletedMessage(otherWebIds, chatFolderUri, messageUri) {
  otherWebIds.forEach(e => {
    this.sendNotifDeletedMessage(e, chatFolderUri, messageUri);
  });
}

/**
 * Sends a notification to the webId's inbox about a new message being received
 * @param {string} webId webId of the other person
 * @param {string} chatFolderUri URI of the folder containing the chat
 * @param {string} messageUri URI of the message the wbId is being notified of
 */
export async function sendNotifDeletedMessage(webId, chatFolderUri, messageUri) {
  const inboxUrl = (await this.getInboxUrl(webId)).value;
  const notiFile = this.store.sym(inboxUrl + 'dechatnotifications.ttl');
  const messageUriFile = this.store.sym(messageUri);
  const chatFolderFile = this.store.sym(chatFolderUri);

  const ins = [];

  // ins.push($rdf.st(chatFolderFile, NONE('DeletedMessage'), messageUriFile, notiFile.doc()));

  this.pushNotification(inboxUrl, ins);
}

/**
 * Pushes a given notification to the given user with the given content
 * @param {inboxUrl} chatUri Uri of the inbox of the recipient
 * @param {Array<any>} ins The inserts to be made
 */
export async function pushNotification(inboxUrl, ins) {
  const notiUri = inboxUrl + 'dechatnotifications.ttl';

  const notiFile = this.store.sym(notiUri);
  const inboxFolder = this.store.sym(inboxUrl);


  // solid.auth.fetch(inboxUrl, {
  //   method: 'POST',
  //   body: ins.join('')
  // });
}

/**
 * Adds the edit permissions on a given URI for a given WebId
 * @param {string} resourceUri the URI of the resource we want to grant permissions of
 * @param {string} webId the user that is getting access rights
 */
export async function setPermissions(resourceUri, webIds, ownerWebId) {
  const aclUri = resourceUri + '/.acl';
  const crwUri = aclUri + '#ControlReadWrite';
  const rUri = aclUri + '#Read';
  const rwUri = aclUri + '#ReadWrite';
  const aclFile = this.store.sym(aclUri);
  const crwFile = this.store.sym(crwUri);
  const rFile = this.store.sym(rUri);
  const rwFile = this.store.sym(rwUri);
  const file = this.store.sym(resourceUri + '/');
  const ownerWebIdFile = this.store.sym(ownerWebId);

  const ins = [];

  // this.store.add(crwFile, RDFSYN('type'), ACL('Authorization'), aclFile.doc());
  // this.store.add(crwFile, ACL('agent'), ownerWebIdFile, aclFile.doc());
  // this.store.add(crwFile, ACL('accessTo'), file, aclFile.doc());
  // this.store.add(crwFile, ACL('defaultForNew'), file, aclFile.doc());
  // this.store.add(crwFile, ACL('mode'), ACL('Control'), aclFile.doc());
  // this.store.add(crwFile, ACL('mode'), ACL('Read'), aclFile.doc());
  // this.store.add(crwFile, ACL('mode'), ACL('Write'), aclFile.doc());

  // this.store.add(rFile, RDFSYN('type'), ACL('Authorization'), aclFile.doc());
  // this.store.add(rFile, ACL('agentClass'), FOAF('Agent'), aclFile.doc());
  // this.store.add(rFile, ACL('accessTo'), file, aclFile.doc());
  // this.store.add(rFile, ACL('defaultForNew'), file, aclFile.doc());
  // this.store.add(rFile, ACL('mode'), ACL('Read'), aclFile.doc());

  // this.store.add(rwFile, RDFSYN('type'), ACL('Authorization'), aclFile.doc());
  // webIds.forEach(element => {
  //   const webIdFile = this.store.sym(element);
  //   this.store.add(rwFile, ACL('agent'), webIdFile, aclFile.doc());
  // });

  // this.store.add(rwFile, ACL('accessTo'), file, aclFile.doc());
  // this.store.add(rwFile, ACL('defaultForNew'), file, aclFile.doc());
  // this.store.add(rwFile, ACL('mode'), ACL('Read'), aclFile.doc());
  // this.store.add(rwFile, ACL('mode'), ACL('Write'), aclFile.doc());


  // const contents = $rdf.serialize(aclFile.doc(), this.store, aclUri, 'text/turtle');
  // await this.updateManager.put(aclFile.doc(), contents, 'text/turtle', (uri, ok, message, response) => {
  //   if (ok) {
  //     console.log(`File [${this.urlLogFilter(uri)}] PUT with message [${message}].`);
  //   } else {
  //     console.error(`File [${this.urlLogFilter(uri)}] failed PUT with message [${message}].`);
  //   }
  // });
}

/**
 * Checks the inbox for notifications, processes them and returns them to the chat service using the given callback
 * @param {string} webId The webIf of the owner of the inbox of intrest (usually the logged in user)
 * @param {function} callback The callback function in chatservice that we have to call whenever we find and interesting notification
 */
export async function checkInbox(webId, caller) {
  console.log('Checking inbox...');
  const inboxUri = await this.getInboxUrl(webId);
  const inboxUriSym = this.store.sym(inboxUri);

  // const processed = [];
  await this.fetcher.load(inboxUriSym.doc(), { force: true, clearPreviousData: true });
  // const contentUris = (await this.store.match(null, RDFSYN('type'), PL('Resource'), inboxUriSym.doc())).map(e => e.subject);
  // console.log(`    Elements found: ${contentUris.length}`);
  // await contentUris.forEach(async element => {
  //   if (alreadychecked.indexOf(element) === -1) {
  //     console.log(`    Checking: ${element}`);
  //     await this.processNotification(element).then(async result => {
  //       if (result.type !== 'none') {
  //         processed.push(result);
  //         this.deleteNotification(element);
  //         await caller.callbackForNotificationProcessing(result);
  //       } else {
  //         alreadychecked.push(element); // Only save on checked the ones we have not deleted.
  //       }
  //     });
  //   }
  // });
  // console.log(`    All ${contentUris.length} elements checked`);
}

/**
 * This method parses the text and processes the contents returning a Notification object containing the information
 * @param {string} notificationUri URI of the notification we want to process
 * @return {Notification} The Notification extracted from the URI
 */
export async function processNotification(notificationUri) {
  console.log(`    Processing: ${notificationUri}`);
  let notification;

  await this.store.fetcher.webOperation('GET', notificationUri).then(async res => {
    if (res.status === 404) {
    } else {
      const body = res.responseText;
      // const doc = $rdf.sym(notificationUri);
      // try {
      //   await $rdf.parse(body, this.store, doc.uri, 'text/turtle');
      //   let content = await this.store.match(null, NONE('NewMessage'), null, doc.doc());
      //   if (content.length > 0) {
      //     notification = new NewMessageNotification('NewMessage', content[0].subject.value, content[0].object.value);
      //   } else {
      //     content = await this.store.match(null, RDFSYN('type'), MEE('LongChat'), doc.doc());
      //     if (content.length > 0) {
      //       const participants = await this.store.match(null, FLOW('participant'), null, doc.doc());
      //       const titles = await this.store.match(null, DCEL('title'), null, doc.doc());
      //       notification = new ChatNotification('LongChat', titles[0].object.value, content[0].subject.value,
      //         participants.map(e => e.object.value));
      //     } else {
      //       content = await this.store.match(null, NONE('DeletedMessage'), null, doc.doc());
      //       if (content.length > 0) {
      //         notification = new DeletedMessageNotification('DeletedMessage', content[0].subject.value, content[0].object.value);
      //       } else {
      //         notification = new Notification('error');
      //       }
      //     }
      //   }
      // } catch (error) {
      //   notification = new Notification('error');
      //   console.log(`    Unable to parse: ${notificationUri}`);
      // }
    }
  });
  return notification;
}

/**
 * This method deletes a notification once it has been consumed.
 * @param {string} notificationUri URI of the notification we want to delete.
 */
export async function deleteNotification(notificationUri) {
  console.log(`    Deleting: ${notificationUri}`);
  await this.store.fetcher.webOperation('DELETE', notificationUri)
    .then(e => {
      console.log(`    Deleted: ${notificationUri}`);
    });
}

export async function addChatToCard(myWebId, otherWebIds, chatFolder) {
  const myCardFile = this.store.sym(myWebId.replace('#me', '#'));
  const chatFolderFile = this.store.sym(chatFolder);
  await this.fetcher.load(myCardFile.doc(), { force: true, clearPreviousData: true });

  const cardNote = [];

  // cardNote.push($rdf.st(chatFolderFile, RDFSYN('type'), MEE('LongChat'), myCardFile.doc()));
  // otherWebIds.forEach(element => {
  //   const otherUiSym = this.store.sym(element);
  //   cardNote.push($rdf.st(chatFolderFile, FLOW('participant'), otherUiSym, myCardFile.doc()));
  // });

  // await this.updateManager.update([], cardNote, (uri, ok, message, response) => {
  //   if (ok) {
  //     console.log(`Reference set on card [${this.urlLogFilter(uri)}] UPDATED with message [${message}].`);
  //   } else {
  //     console.log(`Reference set on card [${this.urlLogFilter(uri)}] failed UPDATE with message [${message}].`);
  //   }
  // });
}

export function testingMethod(myWebId, otherWebIds, chatName) {
  /*
  fileClient.readFolder(uri).then(folder => {
    console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
  }, err => fileClient.createFolder(uri));
  */

  this.createNewChat(myWebId, otherWebIds, chatName);
}


/**
* Returns the list of conversations your pod is aware of
* @param {string} myWebId My webId
* @return {Promise<string>} Promise resolving to the array of Chat objects
*/
export async function getConversations(myWebId) {
  const ret = [];
  const d = data[myWebId.replace('#me', '')];
  const coinc = await this.store.match(null, RDFSYN('type'), MEE('LongChat'), d.doc());
  await coinc.forEach(async element => {
    const d2 = this.store.sym(element.subject.value);
    const participants = await this.store.match(d2, FLOW('participant'), null, d.doc());
    ret.push(new Chat('', element.subject.value, participants.map(e => e.object.value)));
  });
  return ret;
}

export async function getConversationTitle(convUri) {
  const indexFileSym = this.store.sym(convUri + '/index.ttl');
  const indexThisFileSym = this.store.sym(convUri + '/index.ttl#this');
  await this.fetcher.load(indexFileSym.doc());
  // const titles = await this.store.match(indexThisFileSym, DCEL('title'), null, indexFileSym.doc());
  // return titles[0].object.value;
}
