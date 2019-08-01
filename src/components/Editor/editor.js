import React, { Component } from 'react';
import Monaco, { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react';
import auth from 'solid-auth-client';

import { withWebId, UpdateContext, withAuthorization } from '@inrupt/solid-react-components';
import { EditorWrapper, EditorHeader, EditorContent, Logo, NavSection } from './editor.style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons'
import ProfileImage from '../Share/ProfileImage';

class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content: '',
      changesToCompare: false,
      unsavedChanges: false,
      compareMode: false,
      originalContent: ''
    }

    this.handleEditorDidMount = this.handleEditorDidMount.bind(this)
    this.getCurrentFileContent = this.getCurrentFileContent.bind(this)
    this.saveCurrentFileContent = this.saveCurrentFileContent.bind(this)
    this.onNewFileContent = this.onNewFileContent.bind(this)
    this.initSockets = this.initSockets.bind(this)
    this.save = this.save.bind(this)
  }

  async componentDidMount() {
    this.docUrl = this.getDocUrl()
    await this.initSockets()
    this.setState({ content: await this.getCurrentFileContent() })
    this.lastSaved = new Date()
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor.dispose()
    }
  }

  getDocUrl() {
    const location = this.props.location
    if (location) {
      try {
        const thisUrl = new URL('https://example.com' + location.pathname + location.search)
        const inputtedUrl = thisUrl.searchParams.get('doc')
        try {
          new URL(inputtedUrl)
          return inputtedUrl
        } catch (e) {
          return null
        }
      } catch (e) {
        return null
      }
    }
    return null
  }

  async handleEditorDidMount(valueGetter, editor) {
    this.editor = editor
    this.valueGetter = valueGetter
    if (!this.docUrl) {
      const newDocUrl = await new Promise((resolve, reject) => {
        var result = window.prompt('Enter a valid URL for the document you would like to view');
        resolve(result);
      })
      this.props.history.push(`${this.props.location.pathname}?doc=${newDocUrl}`)
    }

    if (!this.state.compareMode) {
      this.editor.onDidChangeModelContent((e) => {
        if (new Date() - this.lastSaved > 1000) {
          this.setState({ unsavedChanges: true })
        }
      })
    }
  }

  async getCurrentFileContent() {
    const result = await auth.fetch(this.docUrl)
    return await result.text()
  }

  async saveCurrentFileContent() {
    this.lastSaved = new Date()
    await auth.fetch(this.docUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/turtle'
      },
      body: this.valueGetter()
    })
  }

  async initSockets() {
    // TODO: this is bad, you should use the header
    const wsUrl = `wss://${new URL(this.docUrl).host}/`
    this.socket = new WebSocket(wsUrl)
    const docUrl = this.docUrl
    this.socket.onopen = function() {
      this.send(`sub ${docUrl}`);
    }
    this.socket.onmessage = this.onNewFileContent
  }

  onNewFileContent(msg) {
    const timeElapsed = new Date() - this.lastSaved
    console.log(`New Message after ${timeElapsed}ms`, msg)
    if (/pub.*/.test(msg.data) && timeElapsed > 2000) {
      this.setState({ changesToCompare: true })
    }
  }

  async save() {
    if (this.state.unsavedChanges && !this.state.changesToCompare) {
      await this.saveCurrentFileContent()
      this.setState({
        compareMode: false,
        unsavedChanges: false,
        originalContent: '',
        content: this.valueGetter()
      })
    } else if (this.state.changesToCompare) {
      this.setState({
        compareMode: true,
        changesToCompare: false,
        unsavedChanges: true,
        originalContent: await this.getCurrentFileContent()
      })
    }
  }

  render() {

    return (
      <EditorWrapper>
        <EditorHeader>
          <NavSection>
            <Logo src="/img/OeditOrig.png" />
            <FontAwesomeIcon 
              icon={faSave}
              style={{
                fontSize: '20px',
                color: this.state.unsavedChanges ? '#73b8fc' : '#666',
                marginLeft: '16px',
                cursor: this.state.unsavedChanges ? 'pointer' : 'arrow',
              }}
              onClick={this.save}
            />
          </NavSection>
          <NavSection>
            {this.state.changesToCompare ? (
              <button
                style={{
                  marginRight: '16px'
                }}
                onClick={async () => {
                  this.setState({
                    compareMode: true,
                    changesToCompare: false,
                    unsavedChanges: true,
                    originalContent: await this.getCurrentFileContent()
                  })
                }}
              >
                New changes were made to this file. Compare changes?
              </button>
            ) : '' }
            <ProfileImage />
          </NavSection>
        </EditorHeader>
        <EditorContent>
          {this.state.compareMode ? (
            <MonacoDiffEditor
              theme={'dark'}
              language={'none'}
              original={this.state.originalContent}
              modified={this.state.content}
              editorDidMount={this.handleEditorDidMount}
              loading={'Loading...'}
            />
          ) : (
            <Monaco
              theme={'dark'}
              language={'none'}
              value={this.state.content}
              editorDidMount={this.handleEditorDidMount}
              loading={'Loading...'}
            />
          )}
        </EditorContent>
      </EditorWrapper>
    );
  }
}
Editor.contextType = UpdateContext;

export default withAuthorization(withWebId(Editor));
